/**
 * Generic API response envelope used for every HTTP response.
 *
 * Equivalent to the Java `ApiResponse<T>` DTO:
 *   { status, success, message, data }
 *
 * You normally do NOT need to construct this manually in controllers — the
 * global `ResponseInterceptor` and `HttpExceptionFilter` build it for you.
 * It is exported so you can use it as a return type for documentation /
 * Swagger / typed clients.
 */
export class ApiResponse<T = unknown> {
  status: number;
  success: boolean;
  message: string;
  data: T | null;

  constructor(
    status: number,
    success: boolean,
    message: string,
    data: T | null = null,
  ) {
    this.status = status;
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static ok<T>(data: T, message = 'Success', status = 200): ApiResponse<T> {
    return new ApiResponse<T>(status, true, message, data);
  }

  static fail(
    message: string,
    status = 400,
    data: unknown = null,
  ): ApiResponse<unknown> {
    return new ApiResponse(status, false, message, data);
  }
}
