import { Module } from "@nestjs/common";
import { MonitoringsController } from "./monitorings.controller";
import { MonitoringsService } from "./monitorings.service";
import { AuditModule } from "../audit/audit.module";

@Module({ imports: [AuditModule], controllers: [MonitoringsController], providers: [MonitoringsService], exports: [MonitoringsService] })
export class MonitoringsModule {}
