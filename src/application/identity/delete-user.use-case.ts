import { Inject, NotFoundException} from '@nestjs/common';

import User from '../../domain/identity/user.domain';
import { USER_REPOSITORY,
    type UserRepository, 
    } from '../../domain/identity/user.repository';


interface DeleteUserInput {
    id: number;
}
export class DeleteUserByIdCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
    ) {}

    async execute(input: DeleteUserInput): Promise<void> {
        const existingUser = await this.userRepository.findById(input.id);

            if (!existingUser) {
                throw new NotFoundException('usuário nao existe');
            }
            
            await this.userRepository.deleteUser(input.id);
    }
}