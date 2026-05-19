import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { SearchesService } from "./searches.service";

@UseGuards(JwtAuthGuard)
@Controller("searches")
export class SearchesController {
  constructor(private readonly searches: SearchesService) {}

  @Get()
  list() {
    return this.searches.list();
  }

  @Post()
  create(@Body() body: unknown, @CurrentUser() user: CurrentUser) {
    return this.searches.create(body, user.sub);
  }
}
