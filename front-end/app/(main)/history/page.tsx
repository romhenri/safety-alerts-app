"use client";

import { Clock, MapPin } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { fetchIncidents } from "@/lib/api";
import { shortLabelGuardStatus } from "@/lib/guardLabels";
import type { Incident } from "@/lib/types";

function labelTipo(t: string) {
  const m: Record<string, string> = {
    assalto: "Assalto",
    area_escura: "Área escura",
    suspeito: "Suspeito",
    outros: "Outros",
  };
  return m[t] ?? t;
}

export default function HistoryPage() {
  const [items, setItems] = useState<Incident[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await fetchIncidents();
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Histórico recente
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Ocorrências em ordem cronológica para a comunidade.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Carregando…</p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <ul className="flex flex-col gap-3">
        {items.map((i) => (
          <li
            key={i.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full bg-[var(--brand-blue)]/10 px-3 py-1 text-xs font-semibold text-[var(--brand-blue)]">
                  {labelTipo(i.tipo)}
                </span>
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  Guarda: {shortLabelGuardStatus(i.guard_status)}
                </span>
              </div>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {new Date(i.timestamp).toLocaleString()}
              </span>
            </div>
            {i.descricao ? (
              <p className="mt-2 text-sm text-slate-800">{i.descricao}</p>
            ) : (
              <p className="mt-2 text-sm italic text-slate-400">
                Sem descrição
              </p>
            )}
            <p className="mt-3 flex items-center gap-1.5 font-mono text-xs text-slate-500">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {i.lat.toFixed(5)}, {i.lng.toFixed(5)}
            </p>
          </li>
        ))}
      </ul>

      {!loading && items.length === 0 && !error ? (
        <p className="text-center text-sm text-slate-500">
          Nenhum alerta registrado ainda.
        </p>
      ) : null}
    </div>
  );
}
