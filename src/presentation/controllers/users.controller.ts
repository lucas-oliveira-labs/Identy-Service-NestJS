import {Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../../users/users.service';


@Controller('users') // define rota base
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}

    @Post()
    create(@Body() body: any) {
        return this.usersService.create(body);
    }
}