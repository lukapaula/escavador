import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/services/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [consultasHoje, monitoramentosAtivos, alertasCriticos, novosProcessos, movimentacoesRecentes, avgCompany, avgPerson] =
      await Promise.all([
        this.prisma.searchRequest.count({ where: { createdAt: { gte: today } } }),
        this.prisma.monitoring.count({ where: { status: "ACTIVE" } }),
        this.prisma.alert.count({ where: { severity: "CRITICAL", status: { not: "RESOLVED" } } }),
        this.prisma.processCase.count({ where: { createdAt: { gte: today } } }),
        this.prisma.processMovement.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
        this.prisma.company.aggregate({ _avg: { riskScore: true } }),
        this.prisma.person.aggregate({ _avg: { riskScore: true } })
      ]);
    const topTribunais = await this.prisma.processCase.groupBy({ by: ["court"], _count: { court: true }, orderBy: { _count: { court: "desc" } }, take: 5 });
    return {
      consultasHoje,
      monitoramentosAtivos,
      alertasCriticos,
      novosProcessos,
      movimentacoesRecentes,
      riscoMedio: Math.round(((avgCompany._avg.riskScore ?? 0) + (avgPerson._avg.riskScore ?? 0)) / 2),
      topTribunais
    };
  }
}
