"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { fetchIncidents } from "@/lib/api";
import type { Incident } from "@/lib/types";

const IncidentMap = dynamic(() => import("@/components/IncidentMap"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

function MapSkeleton() {
  return (
    <div className="flex h-[min(70vh,560px)] w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-500">
      Carregando mapa…
    </div>
  );
}

export default function MapPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await fetchIncidents();
      setIncidents(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, [load]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Mapa de alertas
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Incidentes ativos da comunidade em tempo real.
          </p>
        </div>
        <button
          type="button"
          onClick={() => load()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            aria-hidden
          />
          Atualizar
        </button>
      </div>
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}
      <div className="relative h-[min(70vh,560px)] w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <IncidentMap incidents={incidents} />
      </div>
      <Link
        href="/report?emergency=1"
        className="flex w-full max-w-md items-center justify-center gap-3 self-center rounded-2xl bg-[var(--brand-yellow)] px-5 py-4 text-base font-bold text-[var(--brand-blue)] shadow-lg transition hover:brightness-95 active:scale-[0.99] sm:text-lg"
      >
        <AlertTriangle className="h-7 w-7 shrink-0" aria-hidden />
        Emergência: ajustar ponto e reportar
      </Link>
      <p className="text-center text-xs text-slate-500">
        Círculos indicam densidade de alertas na região.
      </p>
    </div>
  );
}
