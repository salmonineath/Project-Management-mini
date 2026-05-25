import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dto/api-response.dto';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';

/**
 * Wraps every successful controller return value in an `ApiResponse`.
 *
 * Controllers can just `return data` (or `return await service.doThing()`)
 * and this interceptor will produce:
 *   { status, success: true, message, data }
 *
 * The `message` is read from the `@ResponseMessage('...')` decorator on the
 * route handler; if absent it defaults to 'Success'.
 *
 * If a controller already returns an `ApiResponse` instance, we pass it
 * through unchanged — useful for the rare case you want full manual control.
 */
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const httpCtx = context.switchToHttp();
    const response = httpCtx.getResponse<Response>();

    const message =
      this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? 'Success';

    return next.handle().pipe(
      map((data) => {
        // Pass-through if the controller already built an ApiResponse.
        if (data instanceof ApiResponse) {
          return data as ApiResponse<T>;
        }

        const status = response.statusCode ?? 200;
        return new ApiResponse<T>(status, true, message, data ?? null);
      }),
    );
  }
}
