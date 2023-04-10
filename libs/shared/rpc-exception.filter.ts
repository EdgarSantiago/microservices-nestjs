import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { Message } from 'amqplib';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const message: Message = ctx[2];

    res.status(400).json({
      code: exception.getError,
      message: exception.message,
      correlationId: message.properties.correlationId,
    });
  }
}
