import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/services/prisma.service";
import { EncryptionService } from "../../common/services/encryption.service";
import { AuditService } from "../audit/audit.service";
import { ReceitaWsService } from "../../providers/receitaws/receitaws.service";
import type { CompanyCreateInput } from "@legalops/types";

@Injectable()
export class CompaniesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
    private readonly audit: AuditService,
    private readonly receita: ReceitaWsService
  ) {}

  async create(input: CompanyCreateInput, userId: number) {
    const enriched = input.cnpj ? await this.receita.cnpj(input.cnpj).catch(() => null) : null;
    const company = await this.prisma.company.create({
      data: {
        legalName: enriched?.legalName ?? input.legalName,
        tradeName: enriched?.tradeName ?? input.tradeName,
        cnpjEncrypted: this.encryption.encrypt(input.cnpj),
        cnpjHash: this.encryption.hash(input.cnpj),
        email: input.email,
        phone: input.phone,
        mainActivity: enriched?.mainActivity,
        legalNature: enriched?.legalNature,
        size: enriched?.size,
        address: enriched?.address,
        partners: enriched?.partners,
        source: enriched ? "RECEITAWS" : "MANUAL",
        notes: input.notes
      }
    });
    await this.audit.log({ userId, action: "COMPANY_CREATED", entityType: "COMPANY", entityId: company.id });
    return company;
  }

  list() {
    return this.prisma.company.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" }, take: 100 });
  }
}
