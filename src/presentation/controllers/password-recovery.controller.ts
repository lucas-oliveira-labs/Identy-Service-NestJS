import { Body, Controller, Post} from '@nestjs/common';

import { ForgotPasswordUseCase } from '../../application/authentication/forgot-password.use-case';
import { ForgotPasswordDto } from '../../auth/dto/forgot-password.dto';
import { ResetPasswordDto } from '../../auth/dto/reset-password.dto';
import { ResetPasswordUseCase } from '../../application/authentication/reset-password.use-case';


@Controller('auth')
export class PasswordRecoveryController {
    constructor(
        private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
        private readonly ResetPasswordUseCase: ResetPasswordUseCase,
    ) {}

    @Post('forgot-password')
    async forgotPassword(
        @Body() dto: ForgotPasswordDto,
    ): Promise<void> {
        await this.forgotPasswordUseCase.execute({
            email: dto.email,
        });
    }

    @Post('reset-password')
    async resetPassword(
        @Body() dto: ResetPasswordDto,
    ): Promise<void> {
        await this.ResetPasswordUseCase.execute({
            token: dto.token,
            password: dto.password,
        });
    }
}