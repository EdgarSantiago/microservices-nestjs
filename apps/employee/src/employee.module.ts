import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import {
  PostgresDBModule,
  RedisModule,
  SharedModule,
  SharedService,
} from '@app/shared';
import { EmployeeEntity } from './entities/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'apps/auth/src/auth.service';

@Module({
  imports: [
    PostgresDBModule,
    RedisModule,
    SharedModule,
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    TypeOrmModule.forFeature([EmployeeEntity]),
  ],
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
  ],
})
export class EmployeeModule {}
