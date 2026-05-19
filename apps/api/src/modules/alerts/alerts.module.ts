import { Module } from "@nestjs/common";
import { AlertsController } from "./alerts.controller";
import { AlertService } from "./alert.service";
import { AuditModule } from "../audit/audit.module";

@Module({ imports: [AuditModule], controllers: [AlertsController], providers: [AlertService], exports: [AlertService] })
export class AlertsModule {}
