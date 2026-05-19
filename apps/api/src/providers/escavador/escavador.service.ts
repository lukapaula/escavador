import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { LegalDataProvider, ProviderPage, ProviderRequestContext } from "@legalops/providers";
import type { NormalizedCompany, NormalizedMovement, NormalizedPerson, NormalizedProcessCase } from "@legalops/types";
import { HttpProviderClient } from "../http-provider.client";

@Injectable()
export class EscavadorService implements LegalDataProvider {
  private readonly client: HttpProviderClient;

  constructor(config: ConfigService) {
    this.client = new HttpProviderClient("ESCAVADOR", config.get<string>("ESCAVADOR_API_URL") ?? "https://api.escavador.com/api/v2", {
      Authorization: `Bearer ${config.get<string>("ESCAVADOR_API_KEY") ?? ""}`
    });
  }

  async searchPerson(query: string, context: ProviderRequestContext): Promise<ProviderPage<NormalizedPerson>> {
    const raw = await this.client.request<any>(`/busca?qo=${encodeURIComponent(query)}&tipo=pessoa`);
    return {
      data: (raw.items ?? raw.data ?? []).map((item: any) => ({
        name: item.nome ?? item.name ?? query,
        document: item.documento,
        rawId: String(item.id ?? ""),
        source: "ESCAVADOR",
        riskHints: item.processos?.length ? ["PROCESSOS_ENCONTRADOS"] : []
      })),
      nextPage: raw.links?.next ?? raw.next_page,
      raw
    };
  }

  async searchCompany(query: string): Promise<ProviderPage<NormalizedCompany>> {
    const raw = await this.client.request<any>(`/busca?qo=${encodeURIComponent(query)}&tipo=empresa`);
    return {
      data: (raw.items ?? raw.data ?? []).map((item: any) => ({
        legalName: item.razao_social ?? item.nome ?? query,
        tradeName: item.nome_fantasia,
        cnpj: item.cnpj,
        source: "ESCAVADOR"
      })),
      nextPage: raw.links?.next ?? raw.next_page,
      raw
    };
  }

  async searchProcess(caseNumber: string): Promise<NormalizedProcessCase | null> {
    const raw = await this.client.request<any>(`/processos/numero/${encodeURIComponent(caseNumber)}`);
    const processo = raw.data ?? raw;
    if (!processo) return null;
    return {
      caseNumber,
      court: processo.tribunal,
      courtState: processo.estado,
      instance: processo.instancia,
      caseClass: processo.classe,
      subject: processo.assunto,
      area: processo.area,
      secrecyLevel: processo.segredo_justica ? 1 : 0,
      parties: processo.partes,
      lawyers: processo.advogados,
      provider: "ESCAVADOR"
    };
  }

  async getMovements(caseNumber: string): Promise<ProviderPage<NormalizedMovement>> {
    const raw = await this.client.request<any>(`/processos/numero/${encodeURIComponent(caseNumber)}/movimentacoes`);
    return {
      data: (raw.items ?? raw.data ?? []).map((item: any) => ({
        movementDate: item.data,
        movementType: item.tipo,
        title: item.titulo ?? item.conteudo?.slice(0, 120) ?? "Movimentacao processual",
        description: item.conteudo ?? item.descricao,
        provider: "ESCAVADOR",
        rawPayload: item
      })),
      nextPage: raw.links?.next ?? raw.next_page,
      raw
    };
  }

  async monitorCase(caseNumber: string, webhookUrl: string): Promise<{ externalId?: string; raw?: unknown }> {
    const raw = await this.client.request<any>("/monitoramentos/processos", {
      method: "POST",
      body: JSON.stringify({ numero_processo: caseNumber, callback_url: webhookUrl })
    });
    return { externalId: String(raw.id ?? raw.data?.id ?? ""), raw };
  }
}
