import { Shell } from "../../components/shell";

export default function ProcessosPage() {
  return (
    <Shell>
      <h1 className="text-2xl font-semibold">Processos</h1>
      <div className="mt-5 rounded border border-border bg-white shadow-soft">
        {["0001234-10.2024.8.26.0100", "1005521-21.2023.5.02.0004", "0800422-91.2022.4.03.6100"].map((item) => (
          <div key={item} className="grid gap-3 border-b border-border p-4 md:grid-cols-[1fr_160px_120px]">
            <div>
              <div className="font-medium">{item}</div>
              <div className="text-sm text-slate-500">Partes e detalhes sensíveis seguem política de perfil e segredo de justiça.</div>
            </div>
            <span className="text-sm text-slate-600">Monitorado</span>
            <span className="rounded bg-emerald-50 px-2 py-1 text-center text-sm text-emerald-700">Ativo</span>
          </div>
        ))}
      </div>
    </Shell>
  );
}
