import {ConflictException, Inject} from '@nestjs/common';

import Role from '../../domain/role/role.domain';
import { ROLE_REPOSITORY,
    type RoleRepository, 
    } from '../../domain/role/role.repository';



interface CreateRoleInput {
    name: string;
}


export class CreateRoleUseCase {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: RoleRepository
    ) {}

    async execute(input: CreateRoleInput): Promise<Role> {
        const existingRole = await this.roleRepository.findAll();

        if (existingRole) {
            throw new ConflictException('Role ja existe');
        }

        const role = new Role({
            name: input.name,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return this.roleRepository.create(role);
    }
}