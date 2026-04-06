"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  History,
  LogOut,
  MapPinned,
  Shield,
  ShieldCheck,
  Siren,
} from "lucide-react";
import { clearSession, getSessionEmail } from "@/lib/auth";

const links = [
  { href: "/", label: "Mapa", icon: MapPinned },
  { href: "/report", label: "Reportar", icon: Siren },
  { href: "/history", label: "Histórico", icon: History },
  { href: "/guard", label: "Guarda", icon: ShieldCheck },
];

export function MainNav() {
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    setEmail(getSessionEmail());
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-blue-900/10 bg-[var(--brand-blue)] text-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-yellow)] text-[var(--brand-blue)]">
              <Shield className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-lg">UniShield</span>
          </Link>
          <nav
            className="hidden flex-1 flex-wrap items-center justify-center gap-1 sm:gap-2 md:flex"
            aria-label="Principal"
          >
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-white/15 text-[var(--brand-yellow)]"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            {email ? (
              <span
                className="hidden max-w-[200px] truncate text-xs text-white/80 md:inline"
                title={email}
              >
                {email}
              </span>
            ) : null}
            <button
              type="button"
              aria-label="Sair"
              onClick={() => {
                clearSession();
                window.location.href = "/login";
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/25 bg-white/5 p-2.5 text-sm font-medium text-white hover:bg-white/10 md:px-3 md:py-2"
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden md:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-blue-900/10 bg-[var(--brand-blue)] pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 text-white shadow-[0_-4px_12px_rgba(0,0,0,0.08)] md:hidden"
        aria-label="Principal"
      >
        <div className="mx-auto flex max-w-6xl items-stretch justify-around px-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center rounded-lg px-1 py-1 transition-colors ${
                  active
                    ? "text-[var(--brand-yellow)]"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                <Icon className="h-6 w-6 shrink-0" aria-hidden />
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
