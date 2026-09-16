import { Inject, BadRequestException, NotFoundException } from '@nestjs/common';

import User from '../../domain/identity/user.domain';
import { 
    USER_REPOSITORY,
    type UserRepository,
} from '../../domain/identity/user.repository';


interface PatchUserInput {
    id: number;
    email?: string;
    name?: string;
}

export class PatchUserByIdUserCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly UserRepository: UserRepository,
    ) {}

    async execute(input: PatchUserInput): Promise<User> {
        const existingUser = await this.UserRepository.findById(input.id);

        if(!existingUser) {
            throw new NotFoundException('usuários nao existe');
        }

        if (input.email === undefined && input.name === undefined) {
            throw new BadRequestException(
                'informe ao menos um campo para atualizacao',
            );
        }

        return this.UserRepository.updateUser(
            input.id,
            input.email ?? existingUser.email,
            input.name ?? existingUser.name,
        )
    }
}
