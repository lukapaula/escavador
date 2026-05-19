import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { MonitoringsService } from "./monitorings.service";

@UseGuards(JwtAuthGuard)
@Controller("monitorings")
export class MonitoringsController {
  constructor(private readonly monitorings: MonitoringsService) {}

  @Get()
  list() {
    return this.monitorings.list();
  }

  @Post()
  create(@Body() body: unknown, @CurrentUser() user: CurrentUser) {
    return this.monitorings.create(body, user.sub);
  }
}
