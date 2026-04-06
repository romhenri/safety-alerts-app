export function labelIncidentTipo(t: string) {
  const m: Record<string, string> = {
    assalto: "Assalto",
    area_escura: "Área escura",
    suspeito: "Suspeito",
    outros: "Outros",
    emergencia: "Emergência",
  };
  return m[t] ?? t;
}
