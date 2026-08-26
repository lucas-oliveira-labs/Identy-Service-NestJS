import { Injectable } from "@nestjs/common";
import {
    HealthCheckService,
    HealthCheckResult,
    TypeOrmHealthIndicator,
} from "@nestjs/terminus";

@Injectable()
export class HealthService {
    constructor(
        private readonly health: HealthCheckService,
        private readonly db: TypeOrmHealthIndicator,
    ) {}

    checkReady() {
        return this.health.check([
            () => this.db.pingCheck('database'),
        ])
    }
}