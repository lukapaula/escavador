import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { AlertService } from "./alert.service";

@UseGuards(JwtAuthGuard)
@Controller("alerts")
export class AlertsController {
  constructor(private readonly alerts: AlertService) {}

  @Get()
  list() {
    return this.alerts.list();
  }

  @Patch(":id")
  patch(@Param("id") id: string, @Body() body: { status?: string; assignedTo?: number }, @CurrentUser() user: CurrentUser) {
    return this.alerts.patch(id, body, user.sub);
  }
}
