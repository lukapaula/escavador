import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ProcessCasesService } from "./process-cases.service";

@UseGuards(JwtAuthGuard)
@Controller("process-cases")
export class ProcessCasesController {
  constructor(private readonly cases: ProcessCasesService) {}

  @Get()
  list() {
    return this.cases.list();
  }

  @Get(":id")
  get(@Param("id") id: string, @CurrentUser() user: CurrentUser) {
    return this.cases.get(id, user.role);
  }
}
