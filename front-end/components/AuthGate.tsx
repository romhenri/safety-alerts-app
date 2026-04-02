"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSessionEmail } from "@/lib/auth";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const email = getSessionEmail();
    if (!email) {
      router.replace("/login");
      return;
    }
    setAllowed(true);
  }, [router]);

  if (!allowed) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center bg-[var(--background)]">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--brand-blue)] border-t-transparent"
          aria-hidden
        />
      </div>
    );
  }

  return <>{children}</>;
}
