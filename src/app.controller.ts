import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

@Controller()
export class AppController {
  @SkipThrottle()
  @Get()
  healthCheck(): string {
    return 'Hello nest js server in good health';
  }
}
