import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info: Error, context: ExecutionContext) {
    if (err || !user) {
      throw new RpcException({
        statusCode: 401,
        message: 'Authentication failed: Invalid or expired JWT',
      });
    }
    return user;
  }
}
