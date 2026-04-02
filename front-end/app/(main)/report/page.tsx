"use client";

import { AlertTriangle, LocateFixed, Send } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { createIncident } from "@/lib/api";
import { campusPosition } from "@/lib/campus";
import { INCIDENT_CATEGORIES } from "@/lib/types";

export default function ReportPage() {
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
    setGeoStatus("Obtendo localização…");
    window.setTimeout(() => {
      setPosition(campusPosition());
      setGeoStatus(null);
    }, 350);
  }, []);

  const onEmergency = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    captureLocation();
  }, [captureLocation]);

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
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Reportar incidente
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Envie sua posição com o alerta para o mapa da comunidade.
        </p>
      </div>

      <button
        type="button"
        onClick={onEmergency}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[var(--brand-yellow)] px-6 py-5 text-lg font-bold text-[var(--brand-blue)] shadow-lg transition hover:brightness-95 active:scale-[0.99]"
      >
        <AlertTriangle className="h-8 w-8 shrink-0" aria-hidden />
        Emergência: ajustar ponto e reportar
      </button>

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
          <p className="mt-2 font-mono text-sm text-slate-800">
            {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
          </p>
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
