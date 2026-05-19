import { AlertTriangle, ArrowUpRight, BadgeCheck, BriefcaseBusiness, Clock3, FileText, Scale, ShieldCheck } from "lucide-react";
import { Shell } from "../components/shell";

const cards = [
  { label: "Consultas hoje", value: "42", icon: FileText, tone: "text-primary" },
  { label: "Monitoramentos ativos", value: "1.284", icon: ShieldCheck, tone: "text-accent" },
  { label: "Alertas críticos", value: "7", icon: AlertTriangle, tone: "text-danger" },
  { label: "Novos processos", value: "18", icon: Scale, tone: "text-indigo-700" },
  { label: "Movimentações recentes", value: "96", icon: Clock3, tone: "text-cyan-700" },
  { label: "Risco médio", value: "38", icon: ArrowUpRight, tone: "text-amber-700" },
  { label: "Top tribunais", value: "TJSP", icon: BriefcaseBusiness, tone: "text-slate-700" }
];

const movements = [
  ["0001234-10.2024.8.26.0100", "Juntada de petição", "TJSP", "Média"],
  ["1005521-21.2023.5.02.0004", "Audiência designada", "TRT2", "Alta"],
  ["0800422-91.2022.4.03.6100", "Sentença publicada", "TRF3", "Crítica"]
];

export default function Page() {
  return (
    <Shell>
      <section className="mb-6 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-accent">
          <BadgeCheck size={17} />
          Privacy by design, auditoria imutável e decisão sempre humana
        </div>
        <h1 className="text-3xl font-semibold tracking-normal text-foreground">Dashboard executivo de risco e compliance</h1>
        <p className="max-w-3xl text-sm leading-6 text-slate-600">
          Plataforma interna para consultas justificadas, monitoramento processual, alertas e rastreabilidade completa com base legal LGPD.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded border border-border bg-white p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{card.label}</span>
              <card.icon className={card.tone} size={20} />
            </div>
            <div className="mt-3 text-3xl font-semibold">{card.value}</div>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded border border-border bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Timeline processual</h2>
            <button className="rounded bg-primary px-3 py-2 text-sm font-medium text-white">Nova consulta</button>
          </div>
          <div className="space-y-3">
            {movements.map(([caseNumber, title, court, severity]) => (
              <div key={caseNumber} className="grid gap-3 border-l-2 border-primary py-2 pl-4 md:grid-cols-[1fr_auto_auto]">
                <div>
                  <div className="font-medium">{title}</div>
                  <div className="text-sm text-slate-500">{caseNumber}</div>
                </div>
                <span className="text-sm text-slate-600">{court}</span>
                <span className="rounded bg-amber-50 px-2 py-1 text-sm text-amber-800">{severity}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded border border-border bg-white p-5 shadow-soft">
          <h2 className="text-lg font-semibold">Consulta com governança</h2>
          <div className="mt-4 space-y-3">
            <input className="h-10 w-full rounded border border-border px-3 text-sm" placeholder="CPF, CNPJ, nome ou processo" />
            <select className="h-10 w-full rounded border border-border px-3 text-sm">
              <option>Base legal LGPD</option>
              <option>Legítimo interesse</option>
              <option>Obrigação legal</option>
              <option>Execução de contrato</option>
            </select>
            <textarea className="min-h-24 w-full rounded border border-border p-3 text-sm" placeholder="Justificativa obrigatória e finalidade específica" />
            <button className="w-full rounded bg-accent px-3 py-2 text-sm font-medium text-white">Solicitar consulta auditável</button>
          </div>
        </div>
      </section>
    </Shell>
  );
}
