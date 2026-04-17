import { apiUrl } from "./apiBase";
import { errorMessageFromResponse } from "./apiErrors";
import type { GuardStatus, Incident } from "./types";

export async function fetchIncidents(options?: {
  /** When true, includes guard_status solved and canceled (e.g. history). */
  includeClosed?: boolean;
}): Promise<Incident[]> {
  const q = new URLSearchParams();
  if (options?.includeClosed) q.set("include_closed", "true");
  const suffix = q.toString() ? `?${q}` : "";
  const res = await fetch(apiUrl(`/incidents${suffix}`), { cache: "no-store" });
  if (!res.ok) throw new Error(await errorMessageFromResponse(res));
  return res.json();
}

export async function createIncident(body: {
  tipo: string;
  descricao?: string | null;
  lat: number;
  lng: number;
  guard_status?: GuardStatus;
}): Promise<Incident> {
  const res = await fetch(apiUrl("/incidents"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await errorMessageFromResponse(res));
  }
  return res.json();
}

export async function patchGuardStatus(
  id: number,
  status: GuardStatus,
): Promise<Incident> {
  const res = await fetch(apiUrl(`/incidents/${id}/guard`), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    throw new Error(await errorMessageFromResponse(res));
  }
  return res.json();
}

export async function deleteIncident(id: number): Promise<void> {
  const res = await fetch(apiUrl(`/incidents/${id}`), { method: "DELETE" });
  if (!res.ok) {
    throw new Error(await errorMessageFromResponse(res));
  }
}
