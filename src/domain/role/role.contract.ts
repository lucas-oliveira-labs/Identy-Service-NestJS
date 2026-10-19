import Role from './role.domain';

export const ROLE_SERVICE = Symbol('ROLE_SERVICE');

export interface RoleService {
    create(name: string): Promise<Role>;
    findById(id: number): Promise<Role | null>;
    findByName(name: string): Promise<Role | null>;
    findAll(): Promise<Role[]>;
    update(id: number, name: string): Promise<Role>;
    delete(id: number): Promise<void>;
}