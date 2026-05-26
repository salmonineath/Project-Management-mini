import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key used by `ResponseInterceptor` to look up the message.
 * Exported so the interceptor can reference the exact same string.
 */
export const RESPONSE_MESSAGE_KEY = 'response_message';

/**
 * Attach a human-readable message to a controller route. The global
 * `ResponseInterceptor` will pick this up and put it on the wrapped
 * response.
 *
 * Usage:
 *   @Post()
 *   @ResponseMessage('Project created successfully')
 *   create(@Body() dto: CreateProjectDto) {
 *     return this.projectsService.create(dto);
 *   }
 */
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE_KEY, message);
