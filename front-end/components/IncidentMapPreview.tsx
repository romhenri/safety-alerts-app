"use client";

import { useEffect } from "react";
import { CircleMarker, MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { colorForIncidentTipo } from "@/lib/incidentColors";

const PREVIEW_ZOOM = 17;

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
  const center: [number, number] = [lat, lng];
  const fill = colorForIncidentTipo(tipo);

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-inner ${className}`}
    >
      <MapContainer
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
        <MapRecenter center={center} zoom={PREVIEW_ZOOM} />
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
