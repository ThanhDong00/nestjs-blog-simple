import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(
      `Request... Method: ${req.method}, URL: ${req.originalUrl}, Body: ${JSON.stringify(req.body)}`,
    );
    // res.on('finish', () => {
    //   console.log(
    //     `Response... Status: ${res.statusCode}, Body: ${JSON.stringify(res.locals)}`,
    //   );
    // });
    next();
  }
}
