"use client";

import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getSessionEmail,
  isInstitutionalEmail,
  setSessionEmail,
} from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (getSessionEmail()) {
      router.replace("/");
    }
  }, [router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!isInstitutionalEmail(email)) {
      setErr("Use um e-mail institucional (.edu, .edu.br ou .ac.uk).");
      return;
    }
    setSessionEmail(email);
    router.replace("/");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-[var(--background)] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-yellow)] text-[var(--brand-blue)] shadow-inner">
            <Shield className="h-8 w-8" aria-hidden />
          </span>
          <h1 className="text-xl font-bold text-slate-900">UniShield</h1>
          <p className="mt-2 text-sm text-slate-600">
            Entre com seu e-mail institucional.
          </p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-800">
            E-mail
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@universidade.edu.br"
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 placeholder:text-slate-400"
            />
          </label>
          {err ? (
            <p className="text-sm text-red-600" role="alert">
              {err}
            </p>
          ) : null}
          <button
            type="submit"
            className="mt-2 rounded-lg bg-[var(--brand-blue)] py-3 text-sm font-semibold text-white shadow hover:opacity-95"
          >
            Entrar
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-500">
          Acesso com validação de domínio institucional.
        </p>
      </div>
    </div>
  );
}
