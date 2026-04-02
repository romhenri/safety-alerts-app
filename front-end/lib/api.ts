import { apiUrl } from "./apiBase";
import { errorMessageFromResponse } from "./apiErrors";
import type { GuardStatus, Incident } from "./types";

export async function fetchIncidents(): Promise<Incident[]> {
  const res = await fetch(apiUrl("/incidents"), { cache: "no-store" });
  if (!res.ok) throw new Error(await errorMessageFromResponse(res));
  return res.json();
}

export async function createIncident(body: {
  tipo: string;
  descricao?: string | null;
  lat: number;
  lng: number;
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
  status: Exclude<GuardStatus, "pending">,
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
