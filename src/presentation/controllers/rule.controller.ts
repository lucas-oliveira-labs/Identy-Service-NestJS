import { Body,ParseIntPipe, Controller,Param, Post, Get, Put, Delete} from '@nestjs/common';
import { CreateRoleUseCase } from '../../application/role/create-role.use-case';
import { DeleteRoleUseCase } from '../../application/role/delete-role.use-case';
import { FindAllRolesUseCase } from '../../application/role/find-all-roles.use-case';
import { FindRoleByIdUseCase } from '../../application/role/find-role-by-id.use-case';
import { UpdateRoleUseCase } from '../../application/role/update-role.use-case';
import { CreateRoleDto } from '../../application/role/dtos/create-role.dto';
import { UpdateRoleDto } from '../../application/role/dtos/update-role.dto';


@Controller('roles')
export class RoleController {
    constructor(
        private readonly createRoleUseCase: CreateRoleUseCase,
        private readonly deleteRoleUseCase: DeleteRoleUseCase,
        private readonly findAllRolesUseCase: FindAllRolesUseCase,
        private readonly findRoleByIdUseCase: FindRoleByIdUseCase,
        private readonly updateRoleUseCase: UpdateRoleUseCase,
    ){}

    @Post('/create')
    async create(@Body() dto: CreateRoleDto) {
        return this.createRoleUseCase.execute({
            name: dto.name,
        });
    }

    @Get()
    async findAll() {
        return this.findAllRolesUseCase.execute();
    }

    @Get('/:id')
    async findById(@Param('id') id: number) {
        return this.findRoleByIdUseCase.execute({id});
    }

    @Put('/:id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
        return this.updateRoleUseCase.execute({
            id,
            name: dto.name,
        });
    }

    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.deleteRoleUseCase.execute({id});
    }   
}