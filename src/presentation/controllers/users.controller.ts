import {Body,Param, Controller,ParseIntPipe, Post, Get, Put, Delete, Patch } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { RequirePermission } from '../decorators/require-permission.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { CreateUserUseCase } from '../../application/identity/create-user.use-case';
import { CreateUserDto } from '../../application/identity/dto/create-user.dto';
import { GetUserByIdUseCase } from '../../application/identity/find-user.use-case';
import { PutUserById } from '../../application/identity/update-user.use-case';
import { UpdateUserDto } from '../../application/identity/dto/update-user.dto';
import { DeleteUserByIdCase } from '../../application/identity/delete-user.use-case';
import { PatchUserByIdUserCase } from '../../application/identity/patch-user.use-case';
import { PatchUserDto } from '../../application/identity/dto/patch-user.dto';
import { AssignRolesToUserDto } from '../../application/identity/dto/assign-roles-to-user.dto';
import { AssignRolesToUserUseCase } from '../../application/role/assign-roles-to-user.use-case';
import { RemoveRoleFromUserUseCase } from '../../application/role/remove-role-from-user.use-case';


@Controller('users/') // define rota base
export class UsersController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly GetUserByIdUseCase: GetUserByIdUseCase,
        private readonly PutUserById: PutUserById,
        private readonly PatchUserById: PatchUserByIdUserCase,
        private readonly DeleteUserByIdCase: DeleteUserByIdCase,
        private readonly AssignRolesToUserUseCase: AssignRolesToUserUseCase,
        private readonly RemoveRoleFromUserUseCase: RemoveRoleFromUserUseCase,
    ) {}

    @Post('create')
    create(@Body() body: CreateUserDto) {
        return this.createUserUseCase.execute(body);
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @RequirePermission('users', 'get')
    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: string) {
        return this.GetUserByIdUseCase.execute(Number(id));
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @RequirePermission('users', 'put')
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

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @RequirePermission('users', 'patch')
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

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @RequirePermission('users', 'delete')
    @Delete(':id')
    del(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.DeleteUserByIdCase.execute({
            id,
        })
    }
    
    @UseGuards(JwtAuthGuard, PermissionGuard)
    
    @Post(':id/roles')
    assignRoles(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: AssignRolesToUserDto,
    ) {
        return this.AssignRolesToUserUseCase.execute(
            id,
            body.roleIds,
        )
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @RequirePermission('users', 'delete')
    @Delete(':id/roles/:roleId')
    removeRole(
        @Param('id', ParseIntPipe) id: number,
        @Param('roleId', ParseIntPipe) roleId: number
    ) {
        return this.RemoveRoleFromUserUseCase.execute(
            id,
            roleId,
        )
    }

}