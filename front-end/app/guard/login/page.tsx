"use client";

import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getGuardUser, isGuardEmail, setGuardUser } from "@/lib/auth";

export default function GuardLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (getGuardUser()) {
      router.replace("/guard/hub");
    }
  }, [router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!isGuardEmail(email)) {
      setErr(
        "Use um e-mail de guarda: o domínio deve ser @guard (ex.: operador@guard ou nome@guard.edu.br).",
      );
      return;
    }
    setGuardUser(email);
    router.replace("/guard/hub");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-[var(--background)] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-emerald-200 bg-white p-8 shadow-lg">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 shadow-inner">
            <Shield className="h-8 w-8" aria-hidden />
          </span>
          <h1 className="text-xl font-bold text-slate-900">UniShield — Guarda</h1>
          <p className="mt-2 text-sm text-slate-600">
            Acesso exclusivo da equipe de segurança.
          </p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-800">
            E-mail de guarda
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operador@guard ou nome@guard.edu.br"
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
            className="mt-2 rounded-lg bg-emerald-700 py-3 text-sm font-semibold text-white shadow hover:bg-emerald-800"
          >
            Entrar como guarda
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-500">
          Conta separada do acesso de estudantes.
        </p>
      </div>
    </div>
  );
}
