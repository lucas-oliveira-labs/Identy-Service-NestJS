import {Injectable} from '@nestjs/common';


@Injectable()
export class UsersService {
    create(data: any) {
        return {
            message: 'Usuário criado',
            data,
        };
    }
}