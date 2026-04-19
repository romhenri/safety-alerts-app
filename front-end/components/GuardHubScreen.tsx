"use client";

import dynamic from "next/dynamic";
import { BadgeCheck, CheckCircle2, RefreshCw, XCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { deleteIncident, fetchIncidents, patchGuardStatus } from "@/lib/api";
import { labelGuardStatus, shortLabelGuardStatus } from "@/lib/guardLabels";
import { labelIncidentTipo } from "@/lib/incidentLabels";
import type { Incident } from "@/lib/types";

const IncidentMapPreview = dynamic(
  () => import("@/components/IncidentMapPreview"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-44 w-full items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-xs text-slate-500">
        Carregando mapa…
      </div>
    ),
  },
);

export function GuardHubScreen() {
  const [items, setItems] = useState<Incident[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<number | null>(null);
  const actingRef = useRef(false);

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
    const id = setInterval(() => {
      if (!actingRef.current) load();
    }, 5000);
    return () => clearInterval(id);
  }, [load]);

  async function onGoing(id: number) {
    actingRef.current = true;
    setActingId(id);
    setError(null);
    try {
      const updated = await patchGuardStatus(id, "going");
      setItems((prev) => prev.map((x) => (x.id === id ? updated : x)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao atualizar");
    } finally {
      actingRef.current = false;
      setActingId(null);
    }
  }

  async function onNotGoing(id: number) {
    actingRef.current = true;
    setActingId(id);
    setError(null);
    try {
      const updated = await patchGuardStatus(id, "not_going");
      setItems((prev) => prev.map((x) => (x.id === id ? updated : x)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao atualizar");
    } finally {
      actingRef.current = false;
      setActingId(null);
    }
  }

  async function onSolved(id: number) {
    actingRef.current = true;
    setActingId(id);
    setError(null);
    try {
      await deleteIncident(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao remover");
    } finally {
      actingRef.current = false;
      setActingId(null);
    }
  }

  const orderedItems = [...items].sort((a, b) => {
    if (a.guard_status === "pending" && b.guard_status !== "pending") return -1;
    if (a.guard_status !== "pending" && b.guard_status === "pending") return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Central do guarda
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Alertas recebidos: confirme se vai ao local.
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

      {loading && items.length === 0 ? (
        <p className="text-sm text-slate-500">Carregando alertas…</p>
      ) : null}

      <ul className="flex flex-col gap-4">
        {orderedItems.map((i) => (
          <li
            key={i.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <span className="font-semibold text-slate-900">
                  {labelIncidentTipo(i.tipo)}
                </span>
                <p className="mt-1 text-xs text-slate-500">
                  {new Date(i.timestamp).toLocaleString()}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  i.guard_status === "pending"
                    ? "bg-amber-100 text-amber-900"
                    : i.guard_status === "going"
                      ? "bg-emerald-100 text-emerald-900"
                      : "bg-slate-200 text-slate-800"
                }`}
              >
                {shortLabelGuardStatus(i.guard_status)}
              </span>
            </div>
            <div className="mt-3">
              <p className="mb-1.5 text-xs font-medium text-slate-600">
                Local do alerta
              </p>
              <IncidentMapPreview lat={i.lat} lng={i.lng} tipo={i.tipo} />
              <p className="mt-1.5 font-mono text-xs text-slate-500">
                {i.lat.toFixed(5)}, {i.lng.toFixed(5)}
              </p>
            </div>
            {i.descricao ? (
              <p className="mt-3 text-sm text-slate-800">{i.descricao}</p>
            ) : null}
            <p className="mt-3 text-sm text-slate-600">
              {labelGuardStatus(i.guard_status)}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <button
                type="button"
                disabled={actingId === i.id}
                onClick={() => onGoing(i.id)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 disabled:opacity-60"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
                {actingId === i.id ? "…" : "Going"}
              </button>
              <button
                type="button"
                disabled={actingId === i.id}
                onClick={() => onNotGoing(i.id)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 disabled:opacity-60"
              >
                <XCircle className="h-4 w-4 shrink-0" aria-hidden />
                {actingId === i.id ? "…" : "Not Going"}
              </button>
              <button
                type="button"
                disabled={actingId === i.id}
                onClick={() => onSolved(i.id)}
                className="col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 sm:col-span-1"
              >
                <BadgeCheck className="h-4 w-4 shrink-0" aria-hidden />
                {actingId === i.id ? "…" : "Solved"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {!loading && orderedItems.length === 0 && !error ? (
        <p className="text-center text-sm text-slate-500">
          Nenhum alerta no momento.
        </p>
      ) : null}
    </div>
  );
}
