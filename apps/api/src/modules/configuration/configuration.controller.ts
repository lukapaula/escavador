import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("settings")
export class ConfigurationController {
  @Get()
  get() {
    return {
      twoFactor: { optional: true },
      retention: { defaultDays: 365, anonymization: true },
      exports: { maxRows: 100 },
      providers: ["ESCAVADOR", "BRASIL_API", "RECEITAWS", "CNJ_DATAJUD"]
    };
  }
}
