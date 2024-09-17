import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { getTokenValues, isNotExpired } from './utils/helper-methods';
import { UserService } from '../user/user.service';
import { SuccessResponse } from '../global/consts';
import { EmailService } from '../notifications/services/email.service';
import { Status } from '../user/utils/enums';
import { hashWithBcryptJS, validatePassword } from './utils/bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ChangePassDto } from './dto/change-pass.dto';
import { Role } from '../global/enums';
import {
  MongoFindParams,
  MongoUpdateParams,
} from '../global/types/mongo.types';

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
    //bcryptjs used for issues with python dependency for bcrypt
    //Ideally bcrypt should be used as it is much faster, replace the method in utils if that is preferred
    user.password = await hashWithBcryptJS(user.password);

    const token = getTokenValues();

    const createdUser = await this.userService.create({
      ...user,
      status: Status.pending,
      token,
    });

    // Send Email with Token in the backGround
    this.emailService.sendMail(
      user.email,
      'Email Verification',
      './signup-verification.hbs',
      { token: token.value },
    );

    if (createdUser) return SuccessResponse;
  }

  async verifyUserEmail({ email, token }) {
    //TODO: add token restriction to 3
    const query: MongoUpdateParams = {
      query: { email },
      updateData: { $inc: { 'token.tries': -1 } },
      options: { new: false },
    };
    const user = await this.userService.findOneAndUpdate(query);

    if (!user || user.status !== Status.pending)
      throw new NotFoundException('Not found');

    if (user.token.tries <= 0) {
      throw new UnprocessableEntityException(
        'You have ran out of try limit. Please generate a new token',
      );
    }

    if (user.token.value !== token)
      throw new UnauthorizedException(
        `Incorrect token. ${user.token.tries} tries left`,
      ); //Todo: handle try/tries

    if (!isNotExpired(user.token.expiration)) {
      throw new UnauthorizedException('Token has been expired');
    }

    await this.userService.findByIdAndUpdate(user._id, {
      status: Status.active,
      token: {},
    });

    return SuccessResponse;
  }

  async resendVerificationToken(email: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user || user.status !== Status.pending)
      throw new NotFoundException('Not found');

    const token = getTokenValues();
    user.token = token;
    await user.save();

    // Send Email with Token in the backGround
    this.emailService.sendMail(
      email,
      'Email Verification',
      './signup-verification.hbs',
      {
        token: token.value,
      },
    );

    return SuccessResponse;
  }

  async loginUser(loginUser: LoginDto) {
    const { email, password } = loginUser;

    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('Wrong Email or password');

    const validate = await validatePassword(password, user?.password);
    if (!validate) throw new UnauthorizedException('Wrong Email or password');

    const payload = { sub: user._id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async changePassword(email: string, changePassDto: ChangePassDto) {
    const { oldPassword, newPassword } = changePassDto;

    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('Wrong Email or password');

    const validate = await validatePassword(oldPassword, user?.password);
    if (!validate) throw new UnauthorizedException('Wrong Email or password');

    user.password = await hashWithBcryptJS(newPassword);
    await user.save();

    return SuccessResponse;
  }

  async forgottenPasswordVerification({ email }) {
    const user = await this.userService.findOneByEmail(email);
    //TODO: check whether user should be notified on this or not, can change here
    if (!user) throw new UnauthorizedException('User not found!');

    if (user.status === Status.blocked)
      throw new UnauthorizedException('User has been blocked');

    const token = getTokenValues();
    user.token = token;
    await user.save();

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
    this.emailService.sendMail(email, subject, template, {
      token: token.value,
    });

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
    user.password = newPassword;
    await user.save();

    return SuccessResponse;
  }
}
