export function labelIncidentTipo(t: string) {
  const m: Record<string, string> = {
    assalto: "Assalto",
    area_escura: "Área escura",
    suspeito: "Suspeito",
    outros: "Outros",
  };
  return m[t] ?? t;
}
