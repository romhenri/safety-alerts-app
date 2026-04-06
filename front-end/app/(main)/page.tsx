import { IncidentMapScreen } from "@/components/IncidentMapScreen";

export default function MapPage() {
  return (
    <IncidentMapScreen
      title="Mapa de alertas"
      subtitle="Incidentes ativos da comunidade em tempo real."
      showEmergencyCta
    />
  );
}
