import {ConflictException, Inject} from '@nestjs/common';

import Role from '../../domain/role/role.domain';
import { ROLE_REPOSITORY,
    type RoleRepository, 
    } from '../../domain/role/role.repository';



interface DeleteRoleInput {
    id: number;
}


export class DeleteRoleUseCase {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: RoleRepository
    ) {}

    async execute(input: DeleteRoleInput): Promise<void> {
        const role = await this.roleRepository.findById(input.id);

        if (!role) {
            throw new ConflictException('Role nao encontrada');
        }

        await this.roleRepository.delete(input.id);
    }
}