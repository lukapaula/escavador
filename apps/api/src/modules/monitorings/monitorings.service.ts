import { Injectable } from "@nestjs/common";
import { monitoringCreateSchema } from "@legalops/types";
import { PrismaService } from "../../common/services/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class MonitoringsService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  async create(raw: unknown, userId: number) {
    const input = monitoringCreateSchema.parse(raw);
    const nextCheckAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const monitoring = await this.prisma.monitoring.create({
      data: { ...input, entityId: BigInt(input.entityId), createdBy: BigInt(userId), nextCheckAt }
    });
    await this.audit.log({ userId, action: "MONITORING_CREATED", entityType: input.entityType, entityId: input.entityId });
    return monitoring;
  }

  list() {
    return this.prisma.monitoring.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  }
}
