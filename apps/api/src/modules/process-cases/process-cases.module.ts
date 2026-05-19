import { Module } from "@nestjs/common";
import { ProcessCasesController } from "./process-cases.controller";
import { ProcessCasesService } from "./process-cases.service";
import { AuditModule } from "../audit/audit.module";
import { ComplianceModule } from "../compliance/compliance.module";

@Module({ imports: [AuditModule, ComplianceModule], controllers: [ProcessCasesController], providers: [ProcessCasesService], exports: [ProcessCasesService] })
export class ProcessCasesModule {}
