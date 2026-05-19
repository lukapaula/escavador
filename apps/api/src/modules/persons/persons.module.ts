import { Module } from "@nestjs/common";
import { PersonsController } from "./persons.controller";
import { PersonsService } from "./persons.service";
import { AuditModule } from "../audit/audit.module";

@Module({ imports: [AuditModule], controllers: [PersonsController], providers: [PersonsService] })
export class PersonsModule {}
