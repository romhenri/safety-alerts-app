"use client";

import dynamic from "next/dynamic";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createIncident, fetchIncidents } from "@/lib/api";
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

type Props = {
  title: string;
  subtitle: string;
  showEmergencyCta?: boolean;
};

export function IncidentMapScreen({
  title,
  subtitle,
  showEmergencyCta = false,
}: Props) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [emergencySending, setEmergencySending] = useState(false);
  const [emergencyNotice, setEmergencyNotice] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  const submitEmergencyReport = useCallback(async () => {
    setEmergencyNotice(null);
    if (!("geolocation" in navigator)) {
      setEmergencyNotice({
        ok: false,
        text: "Geolocalização não suportada neste navegador.",
      });
      return;
    }

    setEmergencySending(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10_000,
          maximumAge: 0,
        });
      });

      await createIncident({
        tipo: "emergencia",
        descricao: "Alerta de emergência (um toque).",
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });

      setEmergencyNotice({
        ok: true,
        text: "Emergência registrada. O mapa foi atualizado com seu alerta.",
      });
      const data = await fetchIncidents();
      setIncidents(data);
    } catch (e) {
      if (e instanceof GeolocationPositionError) {
        if (e.code === e.PERMISSION_DENIED) {
          setEmergencyNotice({
            ok: false,
            text: "Permissão de localização negada. Ative para enviar o alerta de emergência.",
          });
          return;
        }
        if (e.code === e.TIMEOUT) {
          setEmergencyNotice({
            ok: false,
            text: "Tempo esgotado ao obter localização. Tente de novo.",
          });
          return;
        }
      }
      setEmergencyNotice({
        ok: false,
        text:
          e instanceof Error ? e.message : "Não foi possível enviar o alerta.",
      });
    } finally {
      setEmergencySending(false);
    }
  }, []);

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
            {title}
          </h1>
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
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
      {showEmergencyCta ? (
        <div className="mx-auto flex w-full max-w-md flex-col gap-2">
          <button
            type="button"
            onClick={() => void submitEmergencyReport()}
            disabled={emergencySending}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[var(--brand-yellow)] px-5 py-4 text-base font-bold text-[var(--brand-blue)] shadow-lg transition hover:brightness-95 active:scale-[0.99] disabled:opacity-60 sm:text-lg"
          >
            <AlertTriangle className="h-7 w-7 shrink-0" aria-hidden />
            {emergencySending ? "Enviando emergência…" : "Emergência: reportar agora"}
          </button>
          {emergencyNotice ? (
            <p
              className={`rounded-lg px-3 py-2 text-center text-sm ${
                emergencyNotice.ok
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border border-red-200 bg-red-50 text-red-900"
              }`}
              role="status"
            >
              {emergencyNotice.text}
            </p>
          ) : null}
        </div>
      ) : null}
      <p className="text-center text-xs text-slate-500">
        Círculos indicam densidade de alertas na região.
      </p>
    </div>
  );
}
