import { BcryptPasswordHasher } from '../../infrastruture/security/bcrypt-password-hasher';
export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER');

export interface PasswordHasher {
    hash(password: string): Promise<string>;
    compare(password: string, hash: string): Promise<boolean>;
}
