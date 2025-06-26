import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

// Catch decorator is used to catch exceptions, if leave empty it will catch all exceptions
// If you want to catch specific exceptions, you can pass them as arguments to the Catch decorator
// For example: @Catch(HttpException, ForbiddenException)
// This will catch both HttpException and ForbiddenException
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();

    console.log('ExceptionFilter Called');

    return res.status(status).json({
      isSuccess: false,
      statusCode: status,
      path: req.url,
      message: exception.message,
    });
  }
}
