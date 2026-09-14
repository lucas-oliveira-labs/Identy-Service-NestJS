import {Body,Param, Controller,ParseIntPipe, Post, Get } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/identity/create-user.use-case';
import { CreateUserDto } from '../../application/identity/dto/create-user.dto';
import { GetUserByIdUseCase } from '../../application/identity/find-user.use-case';


@Controller('users/') // define rota base
export class UsersController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly GetUserByIdUseCase: GetUserByIdUseCase,
    ) {}

    @Post('create')
    create(@Body() body: CreateUserDto) {
        return this.createUserUseCase.execute(body);
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: string) {
        return this.GetUserByIdUseCase.execute(Number(id));
    }
}