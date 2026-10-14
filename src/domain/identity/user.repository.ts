import User from './user.domain';

export interface UserRepository {
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    createUser(email: string, name: string): Promise<User>;
    updateUser(id: number, email: string, name: string): Promise<User>;
    deleteUser(id: number): Promise<void>;

    assignRoles(userId: number, roleIds: number[]): Promise<void>;
    removeRole(userId: number, roleId: number): Promise<void>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');