import { Inject, NotFoundException} from '@nestjs/common';

import User from '../../domain/identity/user.domain';
import { USER_REPOSITORY,
    type UserRepository, 
    } from '../../domain/identity/user.repository';


interface UpdateUserInput {
    id: number;
    email: string;
    name: string;
}
export class PutUserById {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
    ) {}

    async execute(input: UpdateUserInput): Promise<User> {
        const existingUser = await this.userRepository.findById(input.id);

            if (!existingUser) {
                throw new NotFoundException('usuário nao existe');
            }
            return this.userRepository.updateUser(
                input.id,
                input.email,
                input.name
            )
    }
}