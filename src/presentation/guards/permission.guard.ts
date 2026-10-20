import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    Inject,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import {
    PERMISSION_KEY,
    type RequiredPermission,
} from '../decorators/require-permission.decorator';
import type { AccessTokenPayload } from '../../application/authentication/access-token';
import type { UserRepository } from '../../domain/identity/user.repository';
import { 
    USER_REPOSITORY,
} from '../../domain/identity/user.repository';


interface AuthenticatedRequest extends Request {
    user?: AccessTokenPayload;
}


@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,

        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermission =
            this.reflector.getAllAndOverride<RequiredPermission>(
                PERMISSION_KEY,
                [
                    context.getHandler(),
                    context.getClass(),
                ],
            );

        if (!requiredPermission) {
            return true;
        }

        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

        if(!request.user) {
            throw new UnauthorizedException(
                'Usuario nao autenticado',
            );
        }

        const userId = Number(request.user.sub);

        if (!Number.isSafeInteger(userId) || userId <= 0) {
            throw new UnauthorizedException(
                'identificador de usuario ínvalido',
            )
        }

        const permissionName =`${requiredPermission.resource}:${requiredPermission.action}`;

        const hasPermission = await this.userRepository.hasPermission(
            userId,
            permissionName,
        )

        if (!hasPermission) {
            throw new ForbiddenException('Permissiao insuficiente');
        }

        return true;
    }
}