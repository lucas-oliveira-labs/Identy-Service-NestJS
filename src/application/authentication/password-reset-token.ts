import { PASSWORD_RESET_TOKEN_REPOSITORY } from '../../domain/credential/password-reset-token.repository';



export const PASSWORD_RESET_TOKEN_SERVICE = Symbol(
    'PASSWORD_RESET_TOKEN_SERVICE',
);

export interface PasswordResetTokenService {
    generate(userId: number): Promise<string>;
}