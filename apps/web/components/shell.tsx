import { Bell, Building2, FileSearch, Gauge, History, Landmark, LockKeyhole, Search, Settings, ShieldCheck, Users } from "lucide-react";

const nav = [
  { label: "Dashboard", icon: Gauge },
  { label: "Pessoas", icon: Users },
  { label: "Empresas", icon: Building2 },
  { label: "Consultas", icon: FileSearch },
  { label: "Processos", icon: Landmark },
  { label: "Alertas", icon: Bell },
  { label: "Auditoria", icon: History },
  { label: "Compliance", icon: ShieldCheck },
  { label: "Configurações", icon: Settings }
];

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-border bg-white px-4 py-5 lg:block">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-primary text-white">
            <LockKeyhole size={20} />
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-primary">LegalOps</div>
            <div className="text-xs text-slate-500">RH & Compliance</div>
          </div>
        </div>
        <nav className="mt-8 space-y-1">
          {nav.map((item) => (
            <button key={item.label} className="flex w-full items-center gap-3 rounded px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-border bg-white/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-2xl">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input className="h-10 w-full rounded border border-border bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-primary" placeholder="Busca global por pessoa, empresa, processo ou protocolo" />
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="rounded bg-emerald-50 px-2 py-1 text-emerald-700">LGPD ativo</span>
              <span className="hidden text-slate-500 sm:inline">Admin Compliance</span>
            </div>
          </div>
        </header>
        <div className="p-5">{children}</div>
      </main>
    </div>
  );
}
