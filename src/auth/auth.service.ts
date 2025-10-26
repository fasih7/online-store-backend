import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {
  checkStatus,
  getTokenValues,
  isNotExpired,
} from './utils/helper-methods';
import { UserService } from '../user/user.service';
import { SuccessResponse } from '../global/consts';
import { EmailService } from '../notifications/services/email.service';
import { Status } from '../user/utils/enums';
import { hashWithBcryptJS, validatePassword } from './utils/bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ChangePassDto } from './dto/change-pass.dto';
import { Role } from '../global/enums';
import { User } from '../user/entities';
import { PayloadType } from '../global/types/shared-types';
import { setRtCookie } from '../global/cookies';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  //TODO: Implement optional token verification and email verification
  //TODO: Implementation for SSO

  async registerUser(user: CreateUserDto & { role: Role }) {
    const { email } = user;
    //bcryptjs used for issues with python dependency for bcrypt
    //Ideally bcrypt should be used as it is much faster, replace the method in utils if that is preferred
    try {
      user.password = await hashWithBcryptJS(user.password);

      const token = getTokenValues();

      const createdUser = await this.userService.create({
        ...user,
        status: Status.pending,
        token,
      });
      if (createdUser) return SuccessResponse;
    } catch (error) {
      if (error.status === 422) {
        const user = await this.userService.findOneByEmail(email);
        if (!user || user.status === Status.pending)
          throw new UnauthorizedException('Email is pending verification');
      }
      throw error;
    }

    // Send Email with Token in the backGround
    // this.emailService.sendMail(
    //   user.email,
    //   'Email Verification',
    //   './signup-verification.hbs',
    //   { token: token.value },
    // );
  }

  async verifyUserEmail({ email, token }, res: any) {
    //TODO: add token restriction to 3
    const user = await this.userService.findOneByEmail(email);
    if (user && user.token) {
      user.token.tries = user.token.tries - 1;
      await this.userService.findOneAndUpdate(user.id, { token: user.token });
    }

    if (!user || user.status !== Status.pending)
      throw new NotFoundException('Not found');

    if (user.token.tries <= 0) {
      throw new UnprocessableEntityException(
        'You have ran out of try limit. Please generate a new token',
      );
    }

    //todo: temp to bypass email verification
    const byPassToken = process.env.NODE_ENV === 'local' && token === '852000';

    if (user.token.value !== token && !byPassToken)
      throw new UnauthorizedException(
        `Incorrect token. ${user.token.tries} tries left`,
      ); //Todo: handle try/tries

    if (!isNotExpired(user.token.expiration)) {
      throw new UnauthorizedException('Token has been expired');
    }

    const confirmedUser = await this.userService.findByIdAndUpdate(user.id, {
      status: Status.active,
      token: null,
    });

    const { access_token, refreshToken } =
      await this.generateLoginTokens(confirmedUser);
    setRtCookie(res, refreshToken);

    return { access_token };
  }

  async resendVerificationToken(email: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user || user.status !== Status.pending)
      throw new NotFoundException('Not found');

    const token = getTokenValues();
    await this.userService.findOneAndUpdate(user.id, { token });

    //TODO: it breaks app
    // Send Email with Token in the backGround
    // this.emailService.sendMail(
    //   email,
    //   'Email Verification',
    //   './signup-verification.hbs',
    //   {
    //     token: token.value,
    //   },
    // );

    return SuccessResponse;
  }

  async loginUser(loginUser: LoginDto, res: any) {
    const { email, password } = loginUser;

    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('Wrong Email or password');

    const validate = await validatePassword(password, user?.password);
    if (!validate) throw new UnauthorizedException('Wrong Email or password');

    if (!checkStatus(user.status))
      throw new InternalServerErrorException('Something went wrong');

    const { access_token, refreshToken } = await this.generateLoginTokens(user);
    setRtCookie(res, refreshToken);

    return { access_token };
  }

  async refreshToken(userId: string, refreshToken: string, res: any) {
    const { access_token, refreshToken: newRt } = await this.rotateRefreshToken(
      userId,
      refreshToken,
    );

    setRtCookie(res, newRt);
    return { access_token };
  }

  async changePassword(email: string, changePassDto: ChangePassDto) {
    const { oldPassword, newPassword } = changePassDto;

    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('Wrong Email or password');

    const validate = await validatePassword(oldPassword, user?.password);
    if (!validate) throw new UnauthorizedException('Wrong Email or password');

    const hashedPassword = await hashWithBcryptJS(newPassword);
    await this.userService.findOneAndUpdate(user.id, {
      password: hashedPassword,
    });

    return SuccessResponse;
  }

  async forgottenPasswordVerification({ email }) {
    const user = await this.userService.findOneByEmail(email);
    //TODO: check whether user should be notified on this or not, can change here
    if (!user) throw new UnauthorizedException('User not found!');

    if (user.status !== Status.active && user.status !== Status.pending)
      throw new UnauthorizedException('User is not active');

    const token = getTokenValues();
    console.log(token);
    await this.userService.findOneAndUpdate(user.id, { token });

    let subject = 'Password Recovery',
      template = './forgot-password-verification.hbs';

    if (user.status === Status.pending) {
      subject = 'Email Verification';
      template = './signup-verification.hbs';
      //TODO: throw exception here accordingly
      return {
        success: true,
        message: 'please verify your email. An Email has been sent',
      };
    }

    // Send Email with Token in the backGround
    // this.emailService.sendMail(email, subject, template, {
    //   token: token.value,
    // });

    return SuccessResponse;
  }

  async updatePassword({ email, password, token }) {
    const user = await this.userService.findOneByEmail(email);

    //TODO: check case if token.value is {} and passed as same as well | can be handled not empty string
    if (user.token.value !== token)
      throw new UnauthorizedException('Incorrect token');

    if (!isNotExpired(user.token.expiration)) {
      throw new UnauthorizedException('Token has been expired');
    }

    const newPassword = await hashWithBcryptJS(password);
    await this.userService.findOneAndUpdate(user.id, {
      password: newPassword,
      token: null,
    });

    return SuccessResponse;
  }

  //--------------------------------- Private Methods ---------------------------------//

  async rotateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findOneById(userId);

    if (!user || !user.hashedRt) {
      throw new ForbiddenException('Access denied');
    }

    const valid = await validatePassword(refreshToken, user.hashedRt);
    if (!valid) {
      this.clearRefreshToken(userId);
      throw new ForbiddenException('Invalid refresh token');
    }

    const tokens = await this.getTokens(user);
    this.setRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

  private async generateAccessToken(user: Partial<User>) {
    const payload: PayloadType = { id: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private async clearRefreshToken(userId: string) {
    await this.userService.findOneAndUpdate(userId, { hashedRt: null });
  }

  private async getTokens(user: Partial<User>) {
    const payload: PayloadType = { id: user.id, email: user.email };

    const [access_token, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_TTL ?? '30d',
      }),
    ]);

    return { access_token, refreshToken };
  }

  private async setRefreshToken(userId: string, rt: string) {
    const hashedRt = await hashWithBcryptJS(rt);

    await this.userService.findOneAndUpdate(userId, { hashedRt });
  }

  private async generateLoginTokens(user: User) {
    const tokens = await this.getTokens(user);
    await this.setRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
