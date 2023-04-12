import {
  ConflictException,
  Injectable,
  Inject,
  UnauthorizedException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UserEntity, UserJwt, UserRepositoryInterface } from '@app/shared';

import { ExistingUserDTO } from './dtos/existing-user.dto';
import { NewUserDTO } from './dtos/new-user.dto';
import { AuthServiceInterface } from './interfaces/auth.service.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UserRepositoryInterface,
    private readonly jwtService: JwtService,
  ) {}

  async getUsers(): Promise<UserEntity[]> {
    return await this.usersRepository.findAll();
  }

  async getUserById(id: number): Promise<UserEntity> {
    return await this.usersRepository.findOneById(id);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.usersRepository.findByCondition({
      where: { email },
      select: ['id', 'email', 'password', 'roles'],
    });
  }

  async findById(id: number): Promise<UserEntity> {
    return this.usersRepository.findOneById(id);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(newUser: Readonly<NewUserDTO>): Promise<UserEntity> {
    const { email, password, roles } = newUser;

    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new RpcException({ statusCode: 400, message: 'Already exist' });
    }

    const hashedPassword = await this.hashPassword(password);

    const savedUser = await this.usersRepository.save({
      email,
      password: hashedPassword,
      roles: ['user'],
    });

    delete savedUser.password;
    return savedUser;
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.findByEmail(email);
    const doesUserExist = !!user;

    if (!doesUserExist) return null;

    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );

    if (!doesPasswordMatch) return null;

    return user;
  }

  async login(existingUser: Readonly<ExistingUserDTO>) {
    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new RpcException({
        statusCode: 401,
        message: 'Senha ou email incorretos',
      });
    }

    delete user.password;

    const jwt = await this.jwtService.signAsync({ user });

    return { token: jwt, user };
  }

  async verifyJwt(jwt: string): Promise<{ user: UserEntity; exp: number }> {
    if (!jwt) {
      throw new RpcException({
        statusCode: 401,
        message: 'Falha da autenticação: Nenhum JWT',
      });
    }

    try {
      const { user, exp } = await this.jwtService.verifyAsync(jwt);
      return { user, exp };
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Falha da autenticação: Invalido ou JWT expirado',
      });
    }
  }

  async getUserFromHeader(jwt: string): Promise<UserJwt> {
    if (!jwt) {
      throw new RpcException({
        statusCode: 401,
        message: 'Falha da autenticação: Nenhum JWT',
      });
    }

    try {
      return this.jwtService.decode(jwt) as UserJwt;
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Falha da autenticação: Invalido ou JWT expirado',
      });
    }
  }
}
