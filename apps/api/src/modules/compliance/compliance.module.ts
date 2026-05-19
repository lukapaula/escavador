import { Module } from "@nestjs/common";
import { LgpdComplianceService } from "./lgpd-compliance.service";

@Module({
  providers: [LgpdComplianceService],
  exports: [LgpdComplianceService]
})
export class ComplianceModule {}
