import {
    Controller,
    Delete,
    Get,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import type {
    SessionData,
    SessionService,
} from '../../application/authentication/session';

import { SESSION_SERVICE } from '../../application/authentication/session';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Inject } from '@nestjs/common';

interface AuthenticatedRequest extends Request {
    user: {
        sub: number;
    };
}

@Controller('auth/sessions')
@UseGuards(JwtAuthGuard)
export class SessionController {
    constructor(
        @Inject(SESSION_SERVICE)
        private readonly sessionService: SessionService,
    ) {}

    @Get()
    async listSessions(
        @Req() request: AuthenticatedRequest,
    ): Promise<SessionData[]> {
        return this.sessionService.listByUser(request.user.sub);
    }

    @Delete(':id')
    async deleteSession(
        @Param('id') sessionId: string,
        @Req() request: AuthenticatedRequest,
    ): Promise<void> {
        await this.sessionService.delete(
            sessionId,
            String(request.user.sub),
        );
    }

    @Delete()
    async deleteAllSessions(
        @Req() request: AuthenticatedRequest,
    ): Promise<void> {
        await this.sessionService.deleteAll(
            String(request.user.sub),
        );
    }
}