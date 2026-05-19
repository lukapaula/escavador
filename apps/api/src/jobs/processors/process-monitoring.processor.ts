import { Processor, WorkerHost } from "@nestjs/bullmq";
import type { Job } from "bullmq";
import { EscavadorService } from "../../providers/escavador/escavador.service";
import { ProcessCasesService } from "../../modules/process-cases/process-cases.service";
import { AlertService } from "../../modules/alerts/alert.service";

@Processor("sync-process-movements")
export class ProcessMonitoringProcessor extends WorkerHost {
  constructor(
    private readonly escavador: EscavadorService,
    private readonly cases: ProcessCasesService,
    private readonly alerts: AlertService
  ) {
    super();
  }

  async process(job: Job<{ caseNumber: string; userId: string }>) {
    const context = {
      purpose: "Monitoramento processual contratado",
      legalBasis: "LEGITIMATE_INTEREST",
      justification: "Rotina de atualizacao de movimentacoes autorizada em monitoramento ativo",
      requestedBy: job.data.userId,
      correlationId: job.id ?? job.name
    };
    const found = await this.escavador.searchProcess(job.data.caseNumber, context);
    if (!found) return { synced: false };
    const processCase = await this.cases.upsertProcess(found);
    const movements = await this.escavador.getMovements(job.data.caseNumber, context);
    await this.cases.addMovements(processCase.id, movements.data);
    if (movements.data.some((movement) => /bloqueio|penhora|condena/i.test(`${movement.title} ${movement.description}`))) {
      await this.alerts.createCritical({
        entityType: "PROCESS_CASE",
        entityId: processCase.id,
        title: "Movimentacao critica detectada",
        description: "A movimentacao contem termos que exigem revisao humana.",
        metadata: { caseNumber: job.data.caseNumber }
      });
    }
    return { synced: true, movements: movements.data.length };
  }
}
