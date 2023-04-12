import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles: string[] = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      // If no roles are required, allow access.
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const userEmail = req.user.email;

    // Fetch the user from the database.
    const user = await this.userModel.findOne({ userEmail }).exec();

    // Check if the user has any of the required roles.
    const hasRole = requiredRoles.some((role) => user?.roles?.includes(role));
    // Allow access if the user has any of the required roles.
    return hasRole;
  }
}
