import { Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";
import { searchRequestSchema, type SearchRequestInput } from "@legalops/types";
import { PrismaService } from "../../common/services/prisma.service";
import { AuditService } from "../audit/audit.service";
import { LgpdComplianceService } from "../compliance/lgpd-compliance.service";
import { EscavadorService } from "../../providers/escavador/escavador.service";
import { CnjDatajudService } from "../../providers/cnj/cnj-datajud.service";

@Injectable()
export class SearchesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly lgpd: LgpdComplianceService,
    private readonly escavador: EscavadorService,
    private readonly cnj: CnjDatajudService
  ) {}

  async create(raw: unknown, userId: number) {
    const input = searchRequestSchema.parse(raw);
    this.lgpd.validateConsultation(input);
    const search = await this.prisma.searchRequest.create({
      data: {
        requestedBy: BigInt(userId),
        targetType: input.targetType,
        targetId: input.targetId ? BigInt(input.targetId) : null,
        provider: input.provider,
        queryType: input.queryType,
        queryValue: input.queryValue,
        purpose: input.purpose,
        legalBasis: input.legalBasis,
        lgpdJustification: input.lgpdJustification,
        status: "RUNNING"
      }
    });

    const context = {
      purpose: input.purpose,
      legalBasis: input.legalBasis,
      justification: input.lgpdJustification,
      requestedBy: String(userId),
      correlationId: search.uuid
    };

    try {
      const result = await this.dispatch(input, context);
      const updated = await this.prisma.searchRequest.update({
        where: { id: search.id },
        data: { status: "COMPLETED", rawResult: (result as any)?.raw, normalizedResult: result as any }
      });
      await this.audit.log({
        userId,
        action: "SEARCH_COMPLETED",
        entityType: input.targetType,
        entityId: input.targetId,
        metadata: { provider: input.provider, queryType: input.queryType, fingerprint: this.fingerprint(input.queryValue) }
      });
      return updated;
    } catch (error) {
      await this.prisma.searchRequest.update({ where: { id: search.id }, data: { status: "FAILED", errorMessage: String(error) } });
      throw error;
    }
  }

  list() {
    return this.prisma.searchRequest.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  }

  private dispatch(input: SearchRequestInput, context: any) {
    const provider = input.provider === "CNJ_DATAJUD" ? this.cnj : this.escavador;
    if (input.queryType === "PERSON") return provider.searchPerson(input.queryValue, context);
    if (input.queryType === "COMPANY") return provider.searchCompany(input.queryValue, context);
    if (input.queryType === "PROCESS") return provider.searchProcess(input.queryValue, context);
    return provider.getMovements(input.queryValue, context);
  }

  private fingerprint(value: string) {
    return createHash("sha256").update(value).digest("hex");
  }
}
