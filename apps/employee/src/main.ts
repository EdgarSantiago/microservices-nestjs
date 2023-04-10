import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { SharedService } from '@app/shared';
import { EmployeeModule } from './employee.module';

async function bootstrap() {
  const app = await NestFactory.create(EmployeeModule);
  //app.enableCors();
  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);
  const queue = configService.get('RABBITMQ_EMPLOYEE_QUEUE');
  app.connectMicroservice(sharedService.getRmqOptions(queue));
  app.startAllMicroservices();
  //await app.listen(5001);
}
bootstrap();
