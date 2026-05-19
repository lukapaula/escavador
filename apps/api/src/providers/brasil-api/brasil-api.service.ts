import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpProviderClient } from "../http-provider.client";

@Injectable()
export class BrasilApiService {
  private readonly client: HttpProviderClient;

  constructor(config: ConfigService) {
    this.client = new HttpProviderClient("BRASIL_API", config.get<string>("BRASIL_API_URL") ?? "https://brasilapi.com.br/api");
  }

  cnpj(cnpj: string) {
    return this.client.request(`/cnpj/v1/${cnpj.replace(/\D/g, "")}`);
  }

  cep(cep: string) {
    return this.client.request(`/cep/v2/${cep.replace(/\D/g, "")}`);
  }

  banks() {
    return this.client.request("/banks/v1");
  }

  holidays(year: number) {
    return this.client.request(`/feriados/v1/${year}`);
  }
}
