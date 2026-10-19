import {
    ConflictException,
    Inject,
    NotFoundException,
} from '@nestjs/common';

import Role from '../../domain/role/role.domain';
import {
    ROLE_REPOSITORY,
    type RoleRepository,
} from '../../domain/role/role.repository';


interface UpdateRoleInput {
    id: number;
    name: string;
}


export class UpdateRoleUseCase {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: RoleRepository,
    ) {}

    async execute(input: UpdateRoleInput): Promise<Role> {
        const role = await this.roleRepository.findById(input.id);

        if (!role) {
            throw new NotFoundException('Role nao encontrada');
        }

        const existingRole = await this.roleRepository.findByName(input.name);

        if (existingRole && existingRole.id !== role.id) {
            throw new ConflictException('Role ja existe');
        }

        role.name = input.name;
        role.updatedAt = new Date();

        return this.roleRepository.update(role);
    }
}