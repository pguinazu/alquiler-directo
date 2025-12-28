import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  const base = process.env.N8N_BASE_URL;
  const webhookPath = process.env.N8N_WEBHOOK_PATH || "/webhook";

  if (!base) {
    return NextResponse.json(
      { ok: false, error: "Missing N8N_BASE_URL" },
      { status: 500 }
    );
  }

  const path = "/" + (params.path || []).join("/");
  const url = `${base}${webhookPath}${path}`;

  // forward body as-is
  const bodyText = await req.text();

  // forward request
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // opcional: si querés validar secreto en n8n, lo agregás acá:
      // "x-n8n-secret": process.env.N8N_SECRET ?? "",
    },
    body: bodyText,
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") || "application/json";
  const text = await res.text();

  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": contentType },
  });
}
