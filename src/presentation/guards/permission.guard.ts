import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import {
    PERMISSION_KEY,
    type RequiredPermission,
} from '../decorators/require-permission.decorator';
import type { AccessTokenPayload } from '../../application/authentication/access-token';


interface AuthenticatedRequest extends Request {
    user?: AccessTokenPayload;
}


@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
    ) {}

    canActivate(context: ExecutionContext): boolean {
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

        throw new ForbiddenException(
            `Permissão necessária: ${requiredPermission.resource}:${requiredPermission.action}`,
        )
    }
}