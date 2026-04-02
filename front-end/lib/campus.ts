export const UFPB_MAP_CENTER: [number, number] = [-7.13565, -34.84585];

export const UFPB_MAP_ZOOM = 16;

export const UFPB_ORIGIN = {
  lat: -7.13565,
  lng: -34.84585,
} as const;

export function campusPosition(): { lat: number; lng: number } {
  const spread = 0.001;
  return {
    lat: UFPB_ORIGIN.lat + (Math.random() - 0.5) * spread,
    lng: UFPB_ORIGIN.lng + (Math.random() - 0.5) * spread,
  };
}
