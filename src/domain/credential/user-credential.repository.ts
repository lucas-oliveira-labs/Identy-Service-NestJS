import UserCredential from './user-credential.domain';


export interface UserCredentialRepository {
    create(
        userId: number,
        password: string,
    ): Promise<UserCredential>;

    findByUserId(
        userId: number,
    ): Promise<UserCredential | null>;

    updatePassword(
        userId: number,
        newPassword: string,
    ): Promise<UserCredential>
}

export const USER_CREDENTIAL_REPOSITORY = Symbol('USER_CREDENTIAL_REPOSITORY');