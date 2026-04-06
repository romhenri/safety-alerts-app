import { GuardLayoutShell } from "@/components/GuardLayoutShell";

export default function GuardRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GuardLayoutShell>{children}</GuardLayoutShell>;
}
