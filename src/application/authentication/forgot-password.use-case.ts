import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";

import { USER_REPOSITORY } from "../../domain/identity/user.repository";
import type { UserRepository } from '../../domain/identity/user.repository';

import { PASSWORD_RESET_TOKEN_SERVICE, 
    type PasswordResetTokenService 
} from './password-reset-token';


interface ForgotPasswordInput {
    email: string;
}


@Injectable()
export class ForgotPasswordUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly usersRepository: UserRepository,

        @Inject(PASSWORD_RESET_TOKEN_SERVICE)
        private readonly passwordResetTokenService: PasswordResetTokenService,
    ) {}

    async execute(input: ForgotPasswordInput): Promise<void> {
        const user = await this.usersRepository.findByEmail(input.email);

        if (!user) {
            return;
        }

        await this.passwordResetTokenService.generate(user.id!);
    }
}