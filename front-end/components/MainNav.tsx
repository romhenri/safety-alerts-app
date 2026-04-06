"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  History,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Shield,
  Siren,
} from "lucide-react";
import {
  clearGuardUser,
  clearStudentUser,
  getGuardUser,
  getStudentUser,
} from "@/lib/auth";

const studentLinks = [
  { href: "/", label: "Mapa", icon: MapPinned },
  { href: "/report", label: "Reportar", icon: Siren },
  { href: "/history", label: "Histórico", icon: History },
];

const guardLinks = [
  { href: "/guard/map", label: "Mapa", icon: MapPinned },
  { href: "/guard/hub", label: "Central", icon: LayoutDashboard },
  { href: "/guard/history", label: "Histórico", icon: History },
];

type MainNavVariant = "student" | "guard";

export function MainNav({ variant }: { variant: MainNavVariant }) {
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);
  const isGuardNav = variant === "guard";
  const links = isGuardNav ? guardLinks : studentLinks;
  const homeHref = isGuardNav ? "/guard/hub" : "/";

  useEffect(() => {
    setEmail(isGuardNav ? getGuardUser() : getStudentUser());
  }, [isGuardNav]);

  const headerClass = isGuardNav
    ? "sticky top-0 z-50 border-b border-emerald-950/25 bg-emerald-800 text-white shadow-sm"
    : "sticky top-0 z-50 border-b border-blue-900/10 bg-[var(--brand-blue)] text-white shadow-sm";

  const mobileNavClass = isGuardNav
    ? "fixed inset-x-0 bottom-0 z-40 border-t border-emerald-950/25 bg-emerald-800 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 text-white shadow-[0_-4px_12px_rgba(0,0,0,0.08)] md:hidden"
    : "fixed inset-x-0 bottom-0 z-40 border-t border-blue-900/10 bg-[var(--brand-blue)] pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 text-white shadow-[0_-4px_12px_rgba(0,0,0,0.08)] md:hidden";

  function linkIsActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function onLogout() {
    if (isGuardNav) {
      clearGuardUser();
      window.location.href = "/guard/login";
    } else {
      clearStudentUser();
      window.location.href = "/login";
    }
  }

  return (
    <>
      <header className={headerClass}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link
            href={homeHref}
            className="flex shrink-0 items-center gap-2 font-semibold tracking-tight"
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-[var(--brand-blue)] ${
                isGuardNav ? "bg-emerald-100" : "bg-[var(--brand-yellow)]"
              }`}
            >
              <Shield className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-lg">UniShield</span>
          </Link>
          <nav
            className="hidden flex-1 flex-wrap items-center justify-center gap-1 sm:gap-2 md:flex"
            aria-label="Principal"
          >
            {links.map(({ href, label, icon: Icon }) => {
              const active = linkIsActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? isGuardNav
                        ? "bg-white/20 text-[var(--brand-yellow)]"
                        : "bg-white/15 text-[var(--brand-yellow)]"
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
              onClick={onLogout}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/25 bg-white/5 p-2.5 text-sm font-medium text-white hover:bg-white/10 md:px-3 md:py-2"
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden md:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>
      <nav className={mobileNavClass} aria-label="Principal">
        <div className="mx-auto flex max-w-6xl items-stretch justify-around px-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = linkIsActive(href);
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
