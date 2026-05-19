import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { ProcessMonitoringProcessor } from "./processors/process-monitoring.processor";
import { MonitoringsModule } from "../modules/monitorings/monitorings.module";
import { ProcessCasesModule } from "../modules/process-cases/process-cases.module";
import { AlertsModule } from "../modules/alerts/alerts.module";
import { IntegrationsModule } from "../modules/integrations/integrations.module";

@Module({
  imports: [
    BullModule.registerQueue(
      { name: "sync-process-movements" },
      { name: "refresh-company-data" },
      { name: "refresh-person-data" },
      { name: "generate-alerts" },
      { name: "sync-monitorings" }
    ),
    MonitoringsModule,
    ProcessCasesModule,
    AlertsModule,
    IntegrationsModule
  ],
  providers: [ProcessMonitoringProcessor]
})
export class JobsModule {}
