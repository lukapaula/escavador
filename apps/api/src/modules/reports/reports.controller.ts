import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ReportService } from "./report.service";

@UseGuards(JwtAuthGuard)
@Controller("reports")
export class ReportsController {
  constructor(private readonly reports: ReportService) {}

  @Post("generate")
  generate(@Body() body: { searchRequestId?: number; reportType: string; observations?: string }, @CurrentUser() user: CurrentUser) {
    return this.reports.generate(body, user.sub);
  }
}
