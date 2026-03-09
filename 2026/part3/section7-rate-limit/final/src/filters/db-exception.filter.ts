import {
  CheckConstraintViolationException,
  DriverException,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

const DB_HTTP_MAP: Record<string, { status: number; message: string }> = {
  UniqueConstraintViolationException: {
    status: HttpStatus.CONFLICT,
    message: 'Resource already exists',
  },
};

@Catch(UniqueConstraintViolationException, CheckConstraintViolationException)
export class DbExceptionFilter<T> implements ExceptionFilter {
  catch(exception: DriverException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const name = exception.name;

    const { status } = DB_HTTP_MAP[name];

    response.status(status).json(DB_HTTP_MAP[name]);
  }
}
