"use client";

import { useEffect, useState } from "react";
import { CircleMarker, MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { colorForIncidentTipo } from "@/lib/incidentColors";

const PREVIEW_ZOOM = 17;

function parseCoord(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

type Props = {
  lat: number;
  lng: number;
  tipo: string;
  className?: string;
};

export default function IncidentMapPreview({
  lat,
  lng,
  tipo,
  className = "",
}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const latN = parseCoord(lat);
  const lngN = parseCoord(lng);
  const coordsOk =
    latN !== null &&
    lngN !== null &&
    latN >= -90 &&
    latN <= 90 &&
    lngN >= -180 &&
    lngN <= 180;

  const center: [number, number] =
    latN !== null && lngN !== null ? [latN, lngN] : [0, 0];
  const fill = colorForIncidentTipo(tipo);
  const mapKey = coordsOk ? `${latN}-${lngN}` : "invalid";

  const shellClass = `relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-inner ${className}`;

  if (!coordsOk) {
    return (
      <div className={shellClass}>
        <div className="flex h-44 w-full min-h-[176px] items-center justify-center px-3 text-center text-xs text-slate-500">
          Localização indisponível
        </div>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className={shellClass}>
        <div className="flex h-44 w-full min-h-[176px] items-center justify-center text-xs text-slate-500">
          Carregando mapa…
        </div>
      </div>
    );
  }

  return (
    <div className={shellClass}>
      <MapContainer
        key={mapKey}
        center={center}
        zoom={PREVIEW_ZOOM}
        className="z-0 h-44 w-full min-h-[176px]"
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        doubleClickZoom={false}
        boxZoom={false}
        keyboard={false}
        attributionControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CircleMarker
          center={center}
          radius={22}
          pathOptions={{
            color: fill,
            fillColor: fill,
            fillOpacity: 0.5,
            weight: 2,
          }}
        />
      </MapContainer>
    </div>
  );
}
