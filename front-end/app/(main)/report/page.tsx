"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { LocateFixed, Send } from "lucide-react";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { createIncident } from "@/lib/api";
import { campusPosition } from "@/lib/campus";
import { INCIDENT_CATEGORIES } from "@/lib/types";

const ReportLocationPreview = dynamic(
  () => import("@/components/ReportLocationPreview"),
  {
    ssr: false,
    loading: () => (
      <div className="mt-3 flex h-[220px] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-100 text-sm text-slate-500">
        Carregando mapa…
      </div>
    ),
  },
);

function ReportPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const [tipo, setTipo] = useState<string>("suspeito");
  const [descricao, setDescricao] = useState("");
  const [position, setPosition] = useState(() => campusPosition());
  const [geoStatus, setGeoStatus] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  const captureLocation = useCallback(() => {
    setMessage(null);
    if (!("geolocation" in navigator)) {
      setGeoStatus("Geolocalização não suportada neste navegador.");
      return;
    }

    setGeoStatus("Obtendo localização real…");
    navigator.geolocation.getCurrentPosition(
      (coords) => {
        setPosition({
          lat: coords.coords.latitude,
          lng: coords.coords.longitude,
        });
        setGeoStatus(null);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setGeoStatus("Permissão negada para acessar sua localização.");
          return;
        }
        if (error.code === error.TIMEOUT) {
          setGeoStatus("Tempo esgotado ao obter localização.");
          return;
        }
        setGeoStatus("Não foi possível obter sua localização atual.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 0,
      },
    );
  }, []);

  useEffect(() => {
    if (searchParams.get("emergency") !== "1") return;
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    captureLocation();
    router.replace("/report", { scroll: false });
  }, [searchParams, captureLocation, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSending(true);
    try {
      await createIncident({
        tipo,
        descricao: descricao.trim() || null,
        lat: position.lat,
        lng: position.lng,
      });
      setMessage({
        ok: true,
        text: "Alerta enviado. A comunidade foi notificada no mapa.",
      });
      setDescricao("");
    } catch (err) {
      setMessage({
        ok: false,
        text: err instanceof Error ? err.message : "Falha ao enviar",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-2 px-4 py-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Reportar incidente
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Envie sua posição com o alerta para o mapa da comunidade.
        </p>
      </div>

      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-800">
          Categoria
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900"
          >
            {INCIDENT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-800">
          Descrição (opcional)
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="Detalhes que ajudem outros estudantes…"
            className="resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 placeholder:text-slate-400"
          />
        </label>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Sua localização
          </p>
          <p className="mt-1 text-sm text-slate-600">
          </p>
          <ReportLocationPreview lat={position.lat} lng={position.lng} />
          {geoStatus ? (
            <p className="mt-2 text-sm text-[var(--brand-blue)]">{geoStatus}</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={captureLocation}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--brand-blue)] bg-white px-4 py-3 text-sm font-semibold text-[var(--brand-blue)] hover:bg-blue-50"
        >
          <LocateFixed className="h-5 w-5" aria-hidden />
          Capturar localização atual
        </button>

        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-yellow)] px-4 py-3 text-sm font-bold text-[var(--brand-blue)] shadow hover:brightness-95 disabled:opacity-60"
        >
          <Send className="h-5 w-5" aria-hidden />
          {sending ? "Enviando…" : "Enviar alerta"}
        </button>
      </form>

      {message ? (
        <p
          className={`rounded-lg px-3 py-2 text-sm ${
            message.ok
              ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border border-red-200 bg-red-50 text-red-900"
          }`}
          role="status"
        >
          {message.text}
        </p>
      ) : null}
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-4">
          <p className="text-sm text-slate-600">Carregando…</p>
        </div>
      }
    >
      <ReportPageInner />
    </Suspense>
  );
}
