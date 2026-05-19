import { Injectable } from "@nestjs/common";
import { createHmac } from "node:crypto";
import { PrismaService } from "../../common/services/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class WebhooksService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  async receive(provider: any, payload: any, signature?: string) {
    const endpoint =
      (await this.prisma.webhookEndpoint.findFirst({ where: { provider, isActive: true } })) ??
      (await this.prisma.webhookEndpoint.create({
        data: { name: `${provider} default`, provider, secretHash: "unconfigured", isActive: false }
      }));
    const valid = endpoint ? this.verify(JSON.stringify(payload), endpoint.secretHash, signature) : false;
    const event = await this.prisma.webhookEvent.create({
      data: {
        endpointId: endpoint.id,
        eventType: payload.type ?? "external.update",
        payload,
        signature,
        status: valid ? "RECEIVED" : "UNVERIFIED"
      }
    });
    await this.audit.log({ action: "WEBHOOK_RECEIVED", entityType: "WEBHOOK_EVENT", entityId: event.id, metadata: { provider, valid } });
    return { received: true, valid };
  }

  private verify(payload: string, secret: string, signature?: string) {
    if (!signature) return false;
    const digest = createHmac("sha256", secret).update(payload).digest("hex");
    return signature === digest;
  }
}
