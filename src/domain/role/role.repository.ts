import Role from './role.domain';

export interface RoleRepository {
    findById(id: number): Promise<Role | null>;

    findByName(name: string): Promise<Role | null>;

    findAll(): Promise<Role[]>;

    create(role: Role): Promise<Role>;

    update(role: Role): Promise<Role>;

    delete(id: number): Promise<void>;
}

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');