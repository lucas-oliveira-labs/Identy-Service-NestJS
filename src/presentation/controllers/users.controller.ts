import {Body,Param, Controller,ParseIntPipe, Post, Get, Put, Delete, Patch } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/identity/create-user.use-case';
import { CreateUserDto } from '../../application/identity/dto/create-user.dto';
import { GetUserByIdUseCase } from '../../application/identity/find-user.use-case';
import { PutUserById } from '../../application/identity/update-user.use-case';
import { UpdateUserDto } from '../../application/identity/dto/update-user.dto';
import { DeleteUserByIdCase } from '../../application/identity/delete-user.use-case';
import { PatchUserByIdUserCase } from '../../application/identity/patch-user.use-case';
import { PatchUserDto } from '../../application/identity/dto/patch-user.dto';


@Controller('users/') // define rota base
export class UsersController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly GetUserByIdUseCase: GetUserByIdUseCase,
        private readonly PutUserById: PutUserById,
        private readonly PatchUserById: PatchUserByIdUserCase,
        private readonly DeleteUserByIdCase: DeleteUserByIdCase
    ) {}

    @Post('create')
    create(@Body() body: CreateUserDto) {
        return this.createUserUseCase.execute(body);
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: string) {
        return this.GetUserByIdUseCase.execute(Number(id));
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateUserDto,
    ) {
        return this.PutUserById.execute({
            id,
            email: body.email,
            name: body.name,
        })
    }

    @Patch(':id')
    patch(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: PatchUserDto,
    ) {
        return this.PatchUserById.execute({
            id,
            email: body.email,
            name: body.name,
        })
    }

    @Delete(':id')
    del(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.DeleteUserByIdCase.execute({
            id,
        })
    }
}