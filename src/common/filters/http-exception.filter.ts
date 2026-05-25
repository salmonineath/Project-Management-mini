import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../dto/api-response.dto';

/**
 * Global exception filter so error responses use the same envelope as
 * success responses:
 *   { status, success: false, message, data: null }
 *
 * - `HttpException` (e.g. `throw new NotFoundException('Project not found')`)
 *   keeps its status code and message.
 * - For class-validator failures, NestJS sets the response body to
 *   `{ message: string[] | string, error, statusCode }`. We surface the
 *   message array as a comma-joined string so the shape stays consistent.
 * - Anything else becomes a 500 with a generic message (the original error
 *   is logged server-side so you can still debug).
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let data: unknown = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const r = exceptionResponse as {
          message?: string | string[];
          error?: string;
        };
        if (Array.isArray(r.message)) {
          message = r.message.join(', ');
        } else if (typeof r.message === 'string') {
          message = r.message;
        } else if (typeof r.error === 'string') {
          message = r.error;
        } else {
          message = exception.message;
        }
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
      message = 'Internal server error';
    } else {
      this.logger.error('Unknown exception thrown', String(exception));
    }

    response
      .status(status)
      .json(new ApiResponse(status, false, message, data));
  }
}
