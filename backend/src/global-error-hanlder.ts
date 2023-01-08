import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalErrorHanlder implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    if (exception instanceof HttpException && exception.getStatus() !== 500) {
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.BAD_REQUEST;

      response.status(status).json({
        statusCode: status,
        message: exception.message,
      });
    } else {
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.BAD_REQUEST;

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
