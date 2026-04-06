"use client";

import { useEffect } from "react";
import { CircleMarker, MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { UFPB_MAP_ZOOM } from "@/lib/campus";

const PREVIEW_ZOOM = Math.min(UFPB_MAP_ZOOM + 1, 18);

function MapFollowPosition({
  lat,
  lng,
  zoom,
}: {
  lat: number;
  lng: number;
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], zoom);
  }, [map, lat, lng, zoom]);
  return null;
}

export default function ReportLocationPreview({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  return (
    <div
      className="mt-3 overflow-hidden rounded-lg border border-slate-200"
      role="img"
      aria-label={`Pré-visualização do mapa no ponto ${lat.toFixed(5)}, ${lng.toFixed(5)}`}
    >
      <MapContainer
        center={[lat, lng]}
        zoom={PREVIEW_ZOOM}
        className="z-0 h-[220px] w-full"
        scrollWheelZoom={false}
        attributionControl
      >
        <MapFollowPosition lat={lat} lng={lng} zoom={PREVIEW_ZOOM} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CircleMarker
          center={[lat, lng]}
          radius={22}
          pathOptions={{
            color: "#1d4ed8",
            fillColor: "#3b82f6",
            fillOpacity: 0.55,
            weight: 2,
          }}
        />
      </MapContainer>
    </div>
  );
}
