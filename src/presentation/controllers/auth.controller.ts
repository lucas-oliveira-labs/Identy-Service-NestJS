import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from  '../../auth/auth.service';
import { LoginDto } from '../../auth/dto/login.dto';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
}