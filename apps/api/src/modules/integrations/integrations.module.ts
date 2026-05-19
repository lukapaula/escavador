import { Module } from "@nestjs/common";
import { EscavadorService } from "../../providers/escavador/escavador.service";
import { BrasilApiService } from "../../providers/brasil-api/brasil-api.service";
import { ReceitaWsService } from "../../providers/receitaws/receitaws.service";
import { CnjDatajudService } from "../../providers/cnj/cnj-datajud.service";

@Module({
  providers: [EscavadorService, BrasilApiService, ReceitaWsService, CnjDatajudService],
  exports: [EscavadorService, BrasilApiService, ReceitaWsService, CnjDatajudService]
})
export class IntegrationsModule {}
