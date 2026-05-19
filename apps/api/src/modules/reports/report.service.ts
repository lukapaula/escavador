import { Injectable } from "@nestjs/common";
import puppeteer from "puppeteer";
import { PrismaService } from "../../common/services/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  async generate(input: { searchRequestId?: number; reportType: string; observations?: string }, userId: number) {
    const report = await this.prisma.report.create({
      data: { generatedBy: BigInt(userId), reportType: input.reportType, searchRequestId: input.searchRequestId ? BigInt(input.searchRequestId) : null, status: "PROCESSING" }
    });
    const search = input.searchRequestId ? await this.prisma.searchRequest.findUnique({ where: { id: BigInt(input.searchRequestId) } }) : null;
    const html = this.renderHtml({ search, observations: input.observations, userId });
    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const buffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();
    const fileUrl = `s3://legalops-reports/${report.uuid}.pdf`;
    await this.prisma.report.update({ where: { id: report.id }, data: { status: "READY", fileUrl } });
    await this.audit.log({ userId, action: "REPORT_GENERATED", entityType: "REPORT", entityId: report.id, metadata: { bytes: buffer.length, fileUrl } });
    return { ...report, status: "READY", fileUrl, bytes: buffer.length };
  }

  private renderHtml(input: { search: any; observations?: string; userId: number }) {
    return `<!doctype html><html><body style="font-family:Arial;padding:32px;color:#172033">
      <h1>LegalOps Compliance Report</h1>
      <p><strong>Finalidade:</strong> ${input.search?.purpose ?? "Relatorio interno"}</p>
      <p><strong>Base legal:</strong> ${input.search?.legalBasis ?? "N/A"}</p>
      <p><strong>Consulta:</strong> ${input.search?.queryType ?? ""} ${input.search?.queryValue ?? ""}</p>
      <h2>Resultado normalizado</h2><pre>${JSON.stringify(input.search?.normalizedResult ?? {}, null, 2)}</pre>
      <h2>Observacoes</h2><p>${input.observations ?? "Sem observacoes adicionais."}</p>
      <p><strong>Responsavel:</strong> ${input.userId}</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      <small>Disclaimer LGPD: documento de apoio a analise humana. Nao realiza decisao automatica de contratacao.</small>
    </body></html>`;
  }
}
