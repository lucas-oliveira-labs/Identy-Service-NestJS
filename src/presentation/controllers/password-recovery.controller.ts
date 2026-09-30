import { Body, Controller, Post} from '@nestjs/common';

import { ForgotPasswordUseCase } from '../../application/authentication/forgot-password.use-case';
import { ForgotPasswordDto } from '../../auth/dto/forgot-password.dto';


@Controller('auth')
export class PasswordRecoveryController {
    constructor(
        private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    ) {}

    @Post('forgot-password')
    async forgotPassword(
        @Body() dto: ForgotPasswordDto,
    ): Promise<void> {
        await this.forgotPasswordUseCase.execute({
            email: dto.email,
        });
    }
}