import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from './logger';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  loggerService = new LoggerService();

  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    // this.loggerService.silly(
    //   'Global',
    //   exception.stack,
    //   exception.response?.message || exception.message,
    // );
    console.log(exception);

    response.status(status).json({
      statusCode: status,
      error: exception.response?.error,
      message:
        exception.response?.message ||
        // exception.message ||
        'Internal server error',
      // path: request.url,
      //   timestamp: new Date().toISOString(),
    });
  }
}
