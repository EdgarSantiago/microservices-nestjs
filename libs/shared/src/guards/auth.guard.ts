import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, Observable, of, switchMap } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'http') {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const authHeaderParts = (authHeader as string).split(' ');

    if (authHeaderParts.length !== 2 || authHeaderParts[0] !== 'Bearer') {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    const [, jwt] = authHeaderParts;

    return this.authService.send({ cmd: 'verify-jwt' }, { jwt }).pipe(
      switchMap(({ exp }) => {
        if (!exp) {
          return of(false);
        }

        const TOKEN_EXP_MS = exp * 1000;

        const isJwtValid = Date.now() < TOKEN_EXP_MS;

        return of(isJwtValid);
      }),
      catchError(() => {
        throw new RpcException({
          statusCode: 401,
          message: 'Você precisa estar logado',
        });
      }),
    );
  }
}
