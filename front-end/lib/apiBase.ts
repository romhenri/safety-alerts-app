export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const direct =
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
      : "";
  if (direct) {
    return `${direct}${p}`;
  }
  return `/api${p}`;
}
