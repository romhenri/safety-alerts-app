import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function backendBase(): string {
  return (process.env.BACKEND_PROXY_URL ?? "http://127.0.0.1:8000").replace(
    /\/$/,
    "",
  );
}

function backendUrl(req: NextRequest): string {
  const pathname = req.nextUrl.pathname;
  const rest = pathname.startsWith("/api/")
    ? pathname.slice(5)
    : pathname === "/api"
      ? ""
      : "";
  const base = backendBase();
  const path = rest ? `${base}/${rest}` : base;
  return `${path}${req.nextUrl.search}`;
}

function hopByHopStrip(h: Headers): Headers {
  const out = new Headers(h);
  out.delete("host");
  out.delete("connection");
  out.delete("keep-alive");
  out.delete("transfer-encoding");
  return out;
}

async function forward(req: NextRequest): Promise<NextResponse> {
  const url = backendUrl(req);
  const hasBody = !["GET", "HEAD"].includes(req.method);
  const body = hasBody ? await req.arrayBuffer() : undefined;
  const upstream = await fetch(url, {
    method: req.method,
    headers: hopByHopStrip(req.headers),
    body: body && body.byteLength > 0 ? body : undefined,
  });
  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: new Headers(upstream.headers),
  });
}

export async function GET(req: NextRequest) {
  return forward(req);
}

export async function POST(req: NextRequest) {
  return forward(req);
}

export async function PATCH(req: NextRequest) {
  return forward(req);
}

export async function PUT(req: NextRequest) {
  return forward(req);
}

export async function DELETE(req: NextRequest) {
  return forward(req);
}

export async function OPTIONS(req: NextRequest) {
  return forward(req);
}
