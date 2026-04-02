export async function errorMessageFromResponse(res: Response): Promise<string> {
  const text = await res.text();
  if (!text) return `Erro ${res.status}`;
  try {
    const j = JSON.parse(text) as { detail?: unknown };
    if (j.detail == null) return text;
    if (typeof j.detail === "string") return j.detail;
    if (Array.isArray(j.detail)) {
      return j.detail
        .map((x: { msg?: string }) => x.msg)
        .filter(Boolean)
        .join(" ");
    }
    return JSON.stringify(j.detail);
  } catch {
    return text;
  }
}
