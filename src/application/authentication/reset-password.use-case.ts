import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

import { PASSWORD_RESET_TOKEN_REPOSITORY,
    type PasswordResetTokenRepository 
} from '../../domain/credential/password-reset-token.repository';
import {
    PASSWORD_HASHER,
    type PasswordHasher
} from './password-hasher';
import { USER_CREDENTIAL_REPOSITORY,
        type UserCredentialRepository
} from '../../domain/credential/user-credential.repository';


interface ResetPasswordInput {
    token: string;
    password: string;
}


@Injectable()
export class ResetPasswordUseCase {
    constructor(
        @Inject(PASSWORD_RESET_TOKEN_REPOSITORY)
        private readonly passwordResetTokenRepository: PasswordResetTokenRepository,

        @Inject(USER_CREDENTIAL_REPOSITORY)
        private readonly userCredentialRepository: UserCredentialRepository,

        @Inject(PASSWORD_HASHER)
        private readonly PasswordHasher: PasswordHasher,
    ) {}

    async execute(input: ResetPasswordInput): Promise<void> {
        const tokenHash = createHash('sha256')
        .update(input.token)
        .digest('hex');

        const passwordResetToken = 
            await this.passwordResetTokenRepository.findByTokenHash(
                tokenHash,
            );

        if (!passwordResetToken) {
            throw new BadRequestException(
                'Token inválido ou expirados',
            );
        }

        if (passwordResetToken.expiresAt <= new Date()) {
            throw new BadRequestException(
                'Token inválido ou expirado',
            );
        }

        if (passwordResetToken.usedAt !== null) {
            throw new BadRequestException(
                'Token inválido ou expirado',
            );
        }

        
        if (passwordResetToken.revokedAt !== null) {
            throw new BadRequestException(
                'Token inválido ou expirado',
            );
        }

        const credential = await this.userCredentialRepository.findByUserId(
            passwordResetToken.userId,
        );

        if (!credential) {
            throw new BadRequestException(
                'Nao foi possivel; redefinir a senha',
            );
        }

        const hashedPassword = await this.PasswordHasher.hash(input.password);

        await this.userCredentialRepository.updatePassword(
            passwordResetToken.userId,
            hashedPassword,
        );

        await this.passwordResetTokenRepository.markAsUsed(
            passwordResetToken.id,
        );

        await this.passwordResetTokenRepository.revokedActiveTokens(
            passwordResetToken.userId,
        );
    }
}