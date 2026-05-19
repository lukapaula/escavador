import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { personCreateSchema } from "@legalops/types";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { PersonsService } from "./persons.service";

@UseGuards(JwtAuthGuard)
@Controller("persons")
export class PersonsController {
  constructor(private readonly persons: PersonsService) {}

  @Get()
  list() {
    return this.persons.list();
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.persons.get(id);
  }

  @Post()
  create(@Body() body: unknown, @CurrentUser() user: CurrentUser) {
    return this.persons.create(personCreateSchema.parse(body), user.sub);
  }
}
