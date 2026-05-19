import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { companyCreateSchema } from "@legalops/types";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CompaniesService } from "./companies.service";

@UseGuards(JwtAuthGuard)
@Controller("companies")
export class CompaniesController {
  constructor(private readonly companies: CompaniesService) {}

  @Get()
  list() {
    return this.companies.list();
  }

  @Post()
  create(@Body() body: unknown, @CurrentUser() user: CurrentUser) {
    return this.companies.create(companyCreateSchema.parse(body), user.sub);
  }
}
