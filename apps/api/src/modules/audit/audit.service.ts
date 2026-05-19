import { Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";
import { PrismaService } from "../../common/services/prisma.service";

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(input: {
    userId?: number | bigint;
    action: string;
    entityType: string;
    entityId?: string | number | bigint;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, unknown>;
  }) {
    const previous = await this.prisma.auditLog.findFirst({ orderBy: { id: "desc" } });
    const payload = JSON.stringify({
      ...input,
      userId: input.userId?.toString(),
      entityId: input.entityId?.toString(),
      previous: previous?.entryHash ?? null,
      createdAt: new Date().toISOString()
    });
    return this.prisma.auditLog.create({
      data: {
        userId: input.userId ? BigInt(input.userId) : null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId?.toString(),
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : {},
        prevHash: previous?.entryHash,
        entryHash: createHash("sha256").update(payload).digest("hex")
      }
    });
  }

  list() {
    return this.prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  }
}
