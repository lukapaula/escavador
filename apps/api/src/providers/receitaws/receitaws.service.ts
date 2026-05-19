import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpProviderClient } from "../http-provider.client";

@Injectable()
export class ReceitaWsService {
  private readonly client: HttpProviderClient;

  constructor(config: ConfigService) {
    this.client = new HttpProviderClient("RECEITAWS", config.get<string>("RECEITAWS_URL") ?? "https://www.receitaws.com.br/v1");
  }

  async cnpj(cnpj: string) {
    const raw = await this.client.request<any>(`/cnpj/${cnpj.replace(/\D/g, "")}`);
    return {
      legalName: raw.nome,
      tradeName: raw.fantasia,
      cnpj: raw.cnpj,
      status: raw.situacao,
      mainActivity: raw.atividade_principal?.[0]?.text,
      legalNature: raw.natureza_juridica,
      size: raw.porte,
      address: raw,
      partners: raw.qsa ?? [],
      raw
    };
  }
}
