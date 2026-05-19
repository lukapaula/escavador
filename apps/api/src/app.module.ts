import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BullModule } from "@nestjs/bullmq";
import { AuthModule } from "./modules/auth/auth.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { PersonsModule } from "./modules/persons/persons.module";
import { CompaniesModule } from "./modules/companies/companies.module";
import { SearchesModule } from "./modules/searches/searches.module";
import { ProcessCasesModule } from "./modules/process-cases/process-cases.module";
import { MonitoringsModule } from "./modules/monitorings/monitorings.module";
import { AlertsModule } from "./modules/alerts/alerts.module";
import { AuditModule } from "./modules/audit/audit.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { ComplianceModule } from "./modules/compliance/compliance.module";
import { WebhooksModule } from "./modules/webhooks/webhooks.module";
import { IntegrationsModule } from "./modules/integrations/integrations.module";
import { ConfigurationModule } from "./modules/configuration/configuration.module";
import { JobsModule } from "./jobs/jobs.module";
import { CommonModule } from "./common/common.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: { url: config.getOrThrow<string>("REDIS_URL") }
      })
    }),
    CommonModule,
    AuthModule,
    DashboardModule,
    PersonsModule,
    CompaniesModule,
    SearchesModule,
    ProcessCasesModule,
    MonitoringsModule,
    AlertsModule,
    AuditModule,
    ReportsModule,
    ComplianceModule,
    WebhooksModule,
    IntegrationsModule,
    ConfigurationModule,
    JobsModule
  ]
})
export class AppModule {}
