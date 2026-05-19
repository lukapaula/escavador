import { Module } from "@nestjs/common";
import { SearchesController } from "./searches.controller";
import { SearchesService } from "./searches.service";
import { AuditModule } from "../audit/audit.module";
import { ComplianceModule } from "../compliance/compliance.module";
import { IntegrationsModule } from "../integrations/integrations.module";

@Module({ imports: [AuditModule, ComplianceModule, IntegrationsModule], controllers: [SearchesController], providers: [SearchesService] })
export class SearchesModule {}
