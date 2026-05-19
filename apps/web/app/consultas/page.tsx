import { Shell } from "../../components/shell";

export default function ConsultasPage() {
  return (
    <Shell>
      <h1 className="text-2xl font-semibold">Consulta detalhada</h1>
      <div className="mt-5 grid gap-4 xl:grid-cols-[380px_1fr]">
        <form className="rounded border border-border bg-white p-5 shadow-soft">
          <label className="text-sm font-medium">Provider oficial</label>
          <select className="mt-2 h-10 w-full rounded border border-border px-3 text-sm">
            <option>Escavador API</option>
            <option>BrasilAPI</option>
            <option>ReceitaWS</option>
            <option>CNJ DataJud</option>
          </select>
          <label className="mt-4 block text-sm font-medium">Consulta</label>
          <input className="mt-2 h-10 w-full rounded border border-border px-3 text-sm" />
          <label className="mt-4 block text-sm font-medium">Finalidade</label>
          <textarea className="mt-2 min-h-24 w-full rounded border border-border p-3 text-sm" />
          <button className="mt-4 w-full rounded bg-primary px-3 py-2 text-sm font-medium text-white">Executar com auditoria</button>
        </form>
        <div className="rounded border border-border bg-white p-5 shadow-soft">
          <h2 className="text-lg font-semibold">Resultado normalizado</h2>
          <pre className="mt-4 overflow-auto rounded bg-slate-950 p-4 text-xs text-slate-100">{`{
  "provider": "ESCAVADOR",
  "decision": "human_review_required",
  "auditTrail": "enabled",
  "lgpd": "purpose-bound"
}`}</pre>
        </div>
      </div>
    </Shell>
  );
}
