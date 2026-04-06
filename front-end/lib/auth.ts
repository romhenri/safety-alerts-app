const STUDENT_KEY = "student_user";
const GUARD_KEY = "guard_user";
/** Legacy key from single-session builds; migrated into `student_user` on read */
const LEGACY_KEY = "unishield_email";

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

/** Guard accounts use a host named `guard` or starting with `guard.` (e.g. nome@guard, nome@guard.edu.br). */
export function isGuardEmail(email: string): boolean {
  const t = email.trim().toLowerCase();
  const at = t.lastIndexOf("@");
  if (at < 1) return false;
  const host = t.slice(at + 1);
  return host === "guard" || host.startsWith("guard.");
}

export function isStudentEmail(email: string): boolean {
  return isInstitutionalEmail(email) && !isGuardEmail(email);
}

export function getStudentUser(): string | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(STUDENT_KEY);
  if (v) return v;
  const legacy = localStorage.getItem(LEGACY_KEY);
  if (legacy) {
    localStorage.setItem(STUDENT_KEY, legacy);
    localStorage.removeItem(LEGACY_KEY);
    return legacy;
  }
  return null;
}

export function setStudentUser(email: string): void {
  localStorage.setItem(STUDENT_KEY, email.trim());
}

export function clearStudentUser(): void {
  localStorage.removeItem(STUDENT_KEY);
  localStorage.removeItem(LEGACY_KEY);
}

export function getGuardUser(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(GUARD_KEY);
}

export function setGuardUser(email: string): void {
  localStorage.setItem(GUARD_KEY, email.trim());
}

export function clearGuardUser(): void {
  localStorage.removeItem(GUARD_KEY);
}
