import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { ReadinessService } from '../../health/readiness.service';


@Controller('ready')
export class ReadinessController {
    constructor(
        private readonly ReadinessService: ReadinessService,
    ) {}

    @Get()
    @HealthCheck()
    check() {
        return this.ReadinessService.check();
    }
}