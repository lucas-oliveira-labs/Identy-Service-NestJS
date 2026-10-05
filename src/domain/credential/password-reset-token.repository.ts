import PasswordResetToken from './password-reset-token.domain';

export interface PasswordResetTokenRepository {
    create(
        userId: number,
        tokenHash: string,
        expiresAt: Date,
    ): Promise<PasswordResetToken>;

    findByTokenHash(
        tokenHash: string,
    ): Promise<PasswordResetToken | null>;

    revokedActiveTokens(
        userId: number,
    ): Promise<void>;

    markAsUsed(
        id: number,
    ): Promise<void>;
}

export const PASSWORD_RESET_TOKEN_REPOSITORY = Symbol(
    'PASSWORD_RESET_TOKEN_REPOSITORY',
)