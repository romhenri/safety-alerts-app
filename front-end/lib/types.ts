export type GuardStatus =
  | "pending"
  | "going"
  | "not_going"
  | "canceled"
  | "solved";

export type Incident = {
  id: number;
  tipo: string;
  descricao: string | null;
  lat: number;
  lng: number;
  timestamp: string;
  guard_status: GuardStatus;
};

export const INCIDENT_CATEGORIES = [
  { value: "assalto", label: "Assalto" },
  { value: "area_escura", label: "Área escura" },
  { value: "suspeito", label: "Suspeito" },
  { value: "outros", label: "Outros" },
] as const;
