"use client";

import { useEffect } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { UFPB_MAP_CENTER, UFPB_MAP_ZOOM } from "@/lib/campus";
import { shortLabelGuardStatus } from "@/lib/guardLabels";
import type { Incident } from "@/lib/types";

const colorByType: Record<string, string> = {
  assalto: "#dc2626",
  area_escura: "#4c1d95",
  suspeito: "#ea580c",
  outros: "#64748b",
};

function MapRecenter({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

function labelForTipo(t: string) {
  const map: Record<string, string> = {
    assalto: "Assalto",
    area_escura: "Área escura",
    suspeito: "Suspeito",
    outros: "Outros",
  };
  return map[t] ?? t;
}

export default function IncidentMap({ incidents }: { incidents: Incident[] }) {
  const center = UFPB_MAP_CENTER;
  const zoom = UFPB_MAP_ZOOM;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full min-h-[320px] w-full rounded-xl"
      scrollWheelZoom
    >
      <MapRecenter center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {incidents.map((i) => {
        const fill = colorByType[i.tipo] ?? "#2563eb";
        return (
          <CircleMarker
            key={i.id}
            center={[i.lat, i.lng]}
            radius={28}
            pathOptions={{
              color: fill,
              fillColor: fill,
              fillOpacity: 0.45,
              weight: 2,
            }}
          >
            <Popup>
              <div className="min-w-[180px] text-sm">
                <p className="font-semibold text-slate-900">
                  {labelForTipo(i.tipo)}
                </p>
                {i.descricao ? (
                  <p className="mt-1 text-slate-600">{i.descricao}</p>
                ) : null}
                <p className="mt-2 text-xs text-slate-500">
                  {new Date(i.timestamp).toLocaleString()}
                </p>
                <p className="mt-2 text-xs font-medium text-slate-700">
                  Guarda: {shortLabelGuardStatus(i.guard_status)}
                </p>
                <p className="mt-1 font-mono text-xs text-slate-400">
                  {i.lat.toFixed(5)}, {i.lng.toFixed(5)}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
