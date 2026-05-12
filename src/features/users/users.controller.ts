import { Controller, Get } from '@nestjs/common';

@Controller('/api/v1')
export class UsersController {
  @Get('/users')
  getUsers(): string {
    return 'this will return all users';
  }
}
