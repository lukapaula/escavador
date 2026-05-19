import { Module } from "@nestjs/common";
import { CompaniesController } from "./companies.controller";
import { CompaniesService } from "./companies.service";
import { AuditModule } from "../audit/audit.module";
import { IntegrationsModule } from "../integrations/integrations.module";

@Module({ imports: [AuditModule, IntegrationsModule], controllers: [CompaniesController], providers: [CompaniesService] })
export class CompaniesModule {}
