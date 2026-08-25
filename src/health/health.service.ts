import { Injectable } from "@nestjs/common";
import {
    HealthCheckService,
    HealthCheckResult,
} from "@nestjs/terminus";

@Injectable()
export class HealthService {
    constructor(private readonly health: HealthCheckService) {}

    check(): Promise<HealthCheckResult> {
        return this.health.check([]);
    }
}