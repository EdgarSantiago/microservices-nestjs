import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Delete,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { AuthGuard, UserInterceptor, UserRequest } from '@app/shared';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('EMPLOYEE_SERVICE') private readonly employeeService: ClientProxy,
  ) {}

  @UseGuards(AuthGuard)
  @Get('users')
  async getUsers() {
    return this.authService.send(
      {
        cmd: 'get-users',
      },
      {},
    );
  }

  @Post('auth/register')
  async register(
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.send(
      {
        cmd: 'register',
      },
      {
        firstName,
        lastName,
        email,
        password,
      },
    );
  }

  @Post('auth/login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.send(
      {
        cmd: 'login',
      },
      {
        email,
        password,
      },
    );
  }

  //Employees
  @Get('employees')
  async getEmployees(@Body('phone') phone: string, @Body('cpf') cpf: string) {
    return this.employeeService.send(
      {
        cmd: 'get-employees',
      },
      {
        phone,
        cpf,
      },
    );
  }

  @Get('employees/:id')
  async getEmployee(@Param('id') id: number) {
    return this.employeeService.send(
      {
        cmd: 'get-employee',
      },
      {
        id,
      },
    );
  }

  @Post('employees')
  async createEmployee(@Body('phone') phone: string, @Body('cpf') cpf: string) {
    return this.employeeService.send(
      {
        cmd: 'create-employee',
      },
      {
        phone,
        cpf,
      },
    );
  }
  //update employee
  @Put('employees/:id')
  async updateEmployee(
    @Param('id') id: number,
    @Body('phone') phone: string,
    @Body('cpf') cpf: string,
  ) {
    return this.employeeService.send(
      {
        cmd: 'update-employee',
      },
      {
        id,
        phone,
        cpf,
      },
    );
  }

  @Delete('employees/:id')
  async deleteEmployee(@Param('id') id: number) {
    return this.employeeService.send(
      {
        cmd: 'delete-employee',
      },
      {
        id,
      },
    );
  }

  //
}
