import { Module } from '@nestjs/common';

import { SharedModule } from '@app/shared';

import { AppController } from './app.controller';

@Module({
  imports: [
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.registerRmq(
      'EMPLOYEE_SERVICE',
      process.env.RABBITMQ_EMPLOYEE_QUEUE,
    ),
  ],
  controllers: [AppController],
})
export class AppModule {}
