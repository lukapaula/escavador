import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/services/prisma.service";
import { EncryptionService } from "../../common/services/encryption.service";
import { AuditService } from "../audit/audit.service";
import type { PersonCreateInput } from "@legalops/types";

@Injectable()
export class PersonsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
    private readonly audit: AuditService
  ) {}

  async create(input: PersonCreateInput, userId: number) {
    const person = await this.prisma.person.create({
      data: {
        fullName: input.fullName,
        cpfEncrypted: this.encryption.encrypt(input.cpf),
        cpfHash: this.encryption.hash(input.cpf),
        birthDate: input.birthDate ? new Date(input.birthDate) : undefined,
        phone: input.phone,
        email: input.email,
        source: input.source,
        purpose: input.purpose,
        legalBasis: input.legalBasis,
        consentFileUrl: input.consentFileUrl,
        notes: input.notes,
        createdBy: BigInt(userId)
      }
    });
    await this.audit.log({ userId, action: "PERSON_CREATED", entityType: "PERSON", entityId: person.id });
    return person;
  }

  list() {
    return this.prisma.person.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" }, take: 100 });
  }

  get(id: string) {
    return this.prisma.person.findUnique({ where: { uuid: id } });
  }
}
