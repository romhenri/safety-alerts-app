"use client";

import { usePathname } from "next/navigation";
import { GuardAuthGate } from "@/components/GuardAuthGate";
import { MainNav } from "@/components/MainNav";

export function GuardLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/guard/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <GuardAuthGate>
      <div className="flex min-h-full flex-1 flex-col">
        <MainNav variant="guard" />
        <main className="flex flex-1 flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </main>
      </div>
    </GuardAuthGate>
  );
}
