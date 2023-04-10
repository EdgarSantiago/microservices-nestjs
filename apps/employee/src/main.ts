import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { SharedService } from '@app/shared';
import { EmployeeModule } from './employee.module';

async function bootstrap() {
  const app = await NestFactory.create(EmployeeModule);
  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);
  const queue = configService.get('RABBITMQ_AUTH_EMPLOYEE');
  app.connectMicroservice(sharedService.getRmqOptions(queue));
  await app.startAllMicroservices();
  await app.listen(5001);
}
bootstrap();
