import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes } from 'crypto';

import  {
    PASSWORD_RESET_TOKEN_REPOSITORY,
} from '../../domain/credential/password-reset-token.repository';

import type {PasswordResetTokenRepository} from '../../domain/credential/password-reset-token.repository';


import { PasswordResetTokenService } from '../../application/authentication/password-reset-token';


@Injectable()
export class PasswordResetTokenServiceImpl implements PasswordResetTokenService {
    constructor(
        @Inject(PASSWORD_RESET_TOKEN_REPOSITORY)
        private readonly repository: PasswordResetTokenRepository,
        private readonly configService: ConfigService,
    ) {}

    async generate(userId: number): Promise<string> {
        await this.repository.revokedActiveTokens(userId);

        const token = randomBytes(32).toString('hex');

        const tokenHash = createHash('sha256')
            .update(token)
            .digest('hex');

        const expiresIn = this.configService.getOrThrow<string>(
            'auth.passwordResetTokenExpiresIn',
        );

        const expiresAt = new Date(
            Date.now() + this.durationToMilliseconds(expiresIn),
        );

        await this.repository.create(
            userId,
            tokenHash,
            expiresAt,
        );

        return token;

    }

    private durationToMilliseconds(duration: string): number {
        const match = duration.match(/^(\d+)(s|m|h|d)$/);

        if (!match) {
            throw new Error(
                'Invalid password reset token expiration',
            );
        }

        const value = Number(match[1]);
        const unit = match[2];

        const multipliers: Record<string, number> = {
            s: 1000,
            m: 60 * 1000,
            h: 60 * 60 * 1000,
            d: 24 * 60 * 1000,
        };

        return value * multipliers[unit];
    }
}