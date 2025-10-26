import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../../user/user.service';
import { Role } from '../../global/enums';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class RefreshAuthGuard extends AuthGuard('jwt-refresh') {
  getRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return request;
  }
}

@Injectable()
export class AdminAuthGuard extends JwtAuthGuard {
  constructor(private readonly userService: UserService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First, ensure the user is authenticated via JWT
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) {
      return false;
    }

    // Get the request object
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new ForbiddenException('User not found in token');
    }

    try {
      // Fetch user from database to get current role
      const dbUser = await this.userService.findOneByIdWithRole(user.id);

      if (!dbUser) {
        throw new ForbiddenException('User not found');
      }

      // Check if user has admin role
      if (dbUser.role !== Role.admin) {
        throw new ForbiddenException('Admin access required');
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Unable to verify admin privileges');
    }
  }
}
