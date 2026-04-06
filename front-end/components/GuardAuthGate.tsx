"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getGuardUser } from "@/lib/auth";

export function GuardAuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const email = getGuardUser();
    if (!email) {
      router.replace("/guard/login");
      return;
    }
    setAllowed(true);
  }, [router]);

  if (!allowed) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center bg-[var(--background)]">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent"
          aria-hidden
        />
      </div>
    );
  }

  return <>{children}</>;
}
