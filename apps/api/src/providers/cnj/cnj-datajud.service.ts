import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { LegalDataProvider, ProviderPage, ProviderRequestContext } from "@legalops/providers";
import type { NormalizedCompany, NormalizedMovement, NormalizedPerson, NormalizedProcessCase } from "@legalops/types";
import { HttpProviderClient } from "../http-provider.client";

@Injectable()
export class CnjDatajudService implements LegalDataProvider {
  private readonly client: HttpProviderClient;

  constructor(config: ConfigService) {
    this.client = new HttpProviderClient("CNJ_DATAJUD", config.get<string>("CNJ_DATAJUD_URL") ?? "https://api-publica.datajud.cnj.jus.br", {
      Authorization: `APIKey ${config.get<string>("CNJ_DATAJUD_API_KEY") ?? ""}`
    });
  }

  async searchPerson(): Promise<ProviderPage<NormalizedPerson>> {
    return { data: [], raw: { status: "DATAJUD does not expose generic person search in this connector" } };
  }

  async searchCompany(): Promise<ProviderPage<NormalizedCompany>> {
    return { data: [], raw: { status: "DATAJUD does not expose generic company search in this connector" } };
  }

  async searchProcess(caseNumber: string, _context: ProviderRequestContext): Promise<NormalizedProcessCase | null> {
    const raw = await this.client.request<any>("/api_publica_tjsp/_search", {
      method: "POST",
      body: JSON.stringify({ query: { match: { numeroProcesso: caseNumber.replace(/\D/g, "") } } })
    });
    const hit = raw.hits?.hits?.[0]?._source;
    if (!hit) return null;
    return {
      caseNumber,
      court: hit.tribunal,
      courtState: hit.uf,
      caseClass: hit.classe?.nome,
      subject: hit.assuntos?.map((subject: any) => subject.nome).join(", "),
      secrecyLevel: hit.nivelSigilo ?? 0,
      provider: "CNJ_DATAJUD"
    };
  }

  async getMovements(caseNumber: string, context: ProviderRequestContext): Promise<ProviderPage<NormalizedMovement>> {
    const process = await this.searchProcess(caseNumber, context);
    return {
      data: ((process as any)?.movimentos ?? []).map((item: any) => ({
        movementDate: item.dataHora,
        title: item.nome ?? "Movimento DataJud",
        description: item.complementosTabelados?.join(", "),
        provider: "CNJ_DATAJUD",
        rawPayload: item
      }))
    };
  }

  async monitorCase() {
    return { raw: { status: "prepared-for-enterprise-token-and-polling" } };
  }
}
