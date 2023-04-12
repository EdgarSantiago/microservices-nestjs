import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles: string[] = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      // Return false if no token is provided
      return false;
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      request.user = decoded.user; // Attach user information to request object
    } catch (err) {
      // Handle token verification error
      return false;
    }

    const user = request.user;
    if (!user || !user.roles) {
      // Check if user or user.roles is undefined
      return false;
    }

    const hasRole = requiredRoles.some((role) => user?.roles?.includes(role));
    // Allow access if the user has any of the required roles.
    return hasRole;
  }
}
