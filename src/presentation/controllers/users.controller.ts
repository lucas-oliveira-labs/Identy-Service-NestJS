import {Body, Controller, Post } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/identity/create-user.use-case';
import { CreateUserDto } from '../../application/identity/dto/create-user.dto';


@Controller('users/create') // define rota base
export class UsersController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
    ) {}

    @Post()
    create(@Body() body: CreateUserDto) {
        return this.createUserUseCase.execute(body);
    }
}