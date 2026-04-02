const KEY = "unishield_email";

export function isInstitutionalEmail(email: string): boolean {
  const t = email.trim().toLowerCase();
  const at = t.lastIndexOf("@");
  if (at < 1) return false;
  const host = t.slice(at + 1);
  return (
    host.endsWith(".edu") ||
    host.endsWith(".edu.br") ||
    host.endsWith(".ac.uk")
  );
}

export function getSessionEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY);
}

export function setSessionEmail(email: string): void {
  localStorage.setItem(KEY, email.trim());
}

export function clearSession(): void {
  localStorage.removeItem(KEY);
}
