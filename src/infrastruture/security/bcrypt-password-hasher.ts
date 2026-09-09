import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PasswordHasher } from '../../application/authentication/password-hashed';


@Injectable()
export class BcryptPasswordHashed implements PasswordHasher {
    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }
}
