"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { getStudentUser } from "@/lib/auth";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const email = getStudentUser();
    if (!email) {
      router.replace("/login");
      return;
    }
    startTransition(() => {
      setAllowed(true);
    });
  }, [router]);

  if (!allowed) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center bg-background">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-(--brand-blue) border-t-transparent"
          aria-hidden
        />
      </div>
    );
  }

  return <>{children}</>;
}
