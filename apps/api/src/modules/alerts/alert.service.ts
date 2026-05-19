import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/services/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class AlertService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  list() {
    return this.prisma.alert.findMany({ orderBy: [{ severity: "desc" }, { createdAt: "desc" }], take: 100 });
  }

  async patch(uuid: string, data: { status?: any; assignedTo?: number }, userId: number) {
    const alert = await this.prisma.alert.update({
      where: { uuid },
      data: { status: data.status, assignedTo: data.assignedTo ? BigInt(data.assignedTo) : undefined }
    });
    await this.audit.log({ userId, action: "ALERT_UPDATED", entityType: "ALERT", entityId: alert.id, metadata: data });
    return alert;
  }

  createCritical(input: { entityType: any; entityId: bigint; title: string; description?: string; metadata?: any }) {
    return this.prisma.alert.create({
      data: {
        entityType: input.entityType,
        entityId: input.entityId,
        severity: "CRITICAL",
        alertType: "PROCESS_RISK",
        title: input.title,
        description: input.description,
        metadata: input.metadata
      }
    });
  }
}
