import { Module } from "@nestjs/common";
import { ReportsController } from "./reports.controller";
import { ReportService } from "./report.service";
import { AuditModule } from "../audit/audit.module";

@Module({ imports: [AuditModule], controllers: [ReportsController], providers: [ReportService] })
export class ReportsModule {}
