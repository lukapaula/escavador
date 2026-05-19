import { Injectable, NotFoundException } from "@nestjs/common";
import { createHash } from "node:crypto";
import { PrismaService } from "../../common/services/prisma.service";
import { LgpdComplianceService } from "../compliance/lgpd-compliance.service";
import type { NormalizedMovement, NormalizedProcessCase } from "@legalops/types";

@Injectable()
export class ProcessCasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lgpd: LgpdComplianceService
  ) {}

  list() {
    return this.prisma.processCase.findMany({ orderBy: { updatedAt: "desc" }, take: 100 });
  }

  async get(uuid: string, role: string) {
    const item = await this.prisma.processCase.findUnique({ where: { uuid }, include: { movements: { orderBy: { movementDate: "desc" } } } });
    if (!item) throw new NotFoundException("Processo nao encontrado");
    if (!this.lgpd.canViewSealedCase(role, item.secrecyLevel)) {
      return { ...item, parties: null, lawyers: null, movements: [], subject: "Detalhes bloqueados por segredo de justica" };
    }
    return item;
  }

  async upsertProcess(input: NormalizedProcessCase) {
    return this.prisma.processCase.upsert({
      where: { caseNumber: input.caseNumber },
      update: { lastSyncAt: new Date(), court: input.court, courtState: input.courtState, secrecyLevel: input.secrecyLevel ?? 0 },
      create: {
        caseNumber: input.caseNumber,
        court: input.court,
        courtState: input.courtState,
        instance: input.instance,
        caseClass: input.caseClass,
        subject: input.subject,
        area: input.area,
        secrecyLevel: input.secrecyLevel ?? 0,
        parties: input.parties as any,
        lawyers: input.lawyers as any,
        provider: input.provider
      }
    });
  }

  async addMovements(processCaseId: bigint, movements: NormalizedMovement[]) {
    for (const movement of movements) {
      const movementHash = createHash("sha256")
        .update(`${processCaseId}:${movement.movementDate}:${movement.title}:${movement.description ?? ""}`)
        .digest("hex");
      await this.prisma.processMovement.upsert({
        where: { movementHash },
        update: {},
        create: {
          processCaseId,
          movementDate: movement.movementDate ? new Date(movement.movementDate) : null,
          movementType: movement.movementType,
          title: movement.title,
          description: movement.description,
          source: "API",
          provider: movement.provider,
          movementHash,
          rawPayload: movement.rawPayload as any
        }
      });
    }
  }
}
