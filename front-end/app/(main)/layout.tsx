import { AuthGate } from "@/components/AuthGate";
import { MainNav } from "@/components/MainNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate>
      <div className="flex min-h-full flex-1 flex-col">
        <MainNav />
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </AuthGate>
  );
}
