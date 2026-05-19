import { Shell } from "../../components/shell";

export default function AuditoriaPage() {
  return (
    <Shell>
      <h1 className="text-2xl font-semibold">Auditoria</h1>
      <div className="mt-5 overflow-hidden rounded border border-border bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-3">Ação</th>
              <th className="p-3">Entidade</th>
              <th className="p-3">Hash</th>
              <th className="p-3">Data</th>
            </tr>
          </thead>
          <tbody>
            {["SEARCH_COMPLETED", "REPORT_GENERATED", "SENSITIVE_VIEW"].map((action, index) => (
              <tr key={action} className="border-t border-border">
                <td className="p-3 font-medium">{action}</td>
                <td className="p-3">COMPLIANCE</td>
                <td className="p-3 font-mono text-xs">sha256:{index}9a4e...bc21</td>
                <td className="p-3">2026-05-19 10:{index}4</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
