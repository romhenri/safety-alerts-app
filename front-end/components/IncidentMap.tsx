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
import { colorForIncidentTipo } from "@/lib/incidentColors";
import { labelIncidentTipo } from "@/lib/incidentLabels";
import type { Incident } from "@/lib/types";

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

export default function IncidentMap({ incidents }: { incidents: Incident[] }) {
  const center = UFPB_MAP_CENTER;
  const zoom = UFPB_MAP_ZOOM;
  const mapIncidents = incidents.filter(
    (i) => i.guard_status !== "solved" && i.guard_status !== "canceled",
  );

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
      {mapIncidents.map((i) => {
        const fill = colorForIncidentTipo(i.tipo);
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
                  {labelIncidentTipo(i.tipo)}
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
