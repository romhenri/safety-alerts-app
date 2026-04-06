export const incidentTypeColor: Record<string, string> = {
  assalto: "#dc2626",
  area_escura: "#4c1d95",
  suspeito: "#ea580c",
  outros: "#64748b",
};

export function colorForIncidentTipo(tipo: string): string {
  return incidentTypeColor[tipo] ?? "#2563eb";
}
