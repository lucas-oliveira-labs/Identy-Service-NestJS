import { Inject, Injectable } from "@nestjs/common";

import { USER_REPOSITORY } from "../../domain/identity/user.repository";
import type { UserRepository } from '../../domain/identity/user.repository';

import { PASSWORD_RESET_TOKEN_SERVICE, 
    type PasswordResetTokenService 
} from './password-reset-token';

import { EmailService } from "../../infrastruture/email/email.service";

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

        private readonly emailService: EmailService,
    ) {}

    async execute(input: ForgotPasswordInput): Promise<void> {
        const user = await this.usersRepository.findByEmail(input.email);

        if (!user) {
            return;
        }

        const token = await this.passwordResetTokenService.generate(user.id!);

        await this.emailService.sendEmail({
            to: user.email,
            subject: 'Recuperacao de senha',
            text: `Use o token abaixo para recuperar sua senha:\n\n${token}`,
            html: `
                <h1>Recuperacao de senha</h1>
                <p>Recebemos uma solicitacao para redefinir sua senha.</p>
                <p>Use o token abaixo:</p>
                <p><strong>${token}</strong></p>
                <p>Esse token possui validade limitada e só pode ser utilizado uma vez.</p>
            `
        })
    }
}