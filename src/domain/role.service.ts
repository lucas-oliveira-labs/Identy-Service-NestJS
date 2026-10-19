import { Inject, Injectable } from '@nestjs/common';
import  Role  from './role/role.domain';
import { ROLE_REPOSITORY } from './role/role.repository';
import type { RoleRepository } from './role/role.repository';
import { RoleService} from './role/role.contract';


@Injectable()
export class RoleServiceImpl implements RoleService {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: RoleRepository,
    ) {}

    async create(name: string): Promise<Role> {
        const normalizedName = name.trim().toLowerCase();

        const existingRole = await this.roleRepository.findByName(
            normalizedName,
        );

        if (existingRole) {
            throw new Error('Esse Role já existe');
        }

        const role = new Role({
            name: normalizedName,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return this.roleRepository.create(role);
    }

    async findById(id: number): Promise<Role | null> {
        return this.roleRepository.findById(id);
    }

    async findByName(name: string): Promise<Role | null> {
        const normalizedName = name.trim().toLowerCase();
        return this.roleRepository.findByName(normalizedName);
    }

    async findAll(): Promise<Role[]> {
        return this.roleRepository.findAll();
    }

    async update(id: number, name: string): Promise<Role> {
        const role = await this.roleRepository.findById(id);

        if (!role) {
            throw new Error('Role não encontrado');
        }

        const normalizedName = name.trim().toLowerCase();

        const existingRole = await this.roleRepository.findByName(
            normalizedName,
        );

        if ( existingRole && existingRole.id !== id) {
            throw new Error('Esse Role já existe');
        }

        role.name = normalizedName;
        role.updatedAt = new Date();

        return this.roleRepository.update(role);
    }

    async delete(id: number): Promise<void> {
        const role = await this.roleRepository.findById(id);

        if (!role) {
            throw new Error('Role não encontrado');
        }

        await this.roleRepository.delete(id);
    }
}