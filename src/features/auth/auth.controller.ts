import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service'
import { ResponseMessage } from '../../common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('api/v1/auth')
@Throttle({ auth: {ttl: 60000, limit: 5}})
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ResponseMessage('Register successful.')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Login successful.')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
}
