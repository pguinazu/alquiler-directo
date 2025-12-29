import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: Request, context: { params: Promise<{ path: string[] }> }) {
  console.log("[v0] n8n proxy route handler START")

  try {
    const params = await context.params
    console.log("[v0] Path params:", params.path)

    const base = process.env.N8N_BASE_URL
    const webhookPath = process.env.N8N_WEBHOOK_PATH || "/webhook"

    console.log("[v0] N8N_BASE_URL:", base)
    console.log("[v0] N8N_WEBHOOK_PATH:", webhookPath)

    if (!base) {
      console.log("[v0] ERROR: Missing N8N_BASE_URL environment variable")
      return NextResponse.json(
        {
          ok: false,
          error: "Missing N8N_BASE_URL environment variable",
        },
        { status: 500 },
      )
    }

    const authHeader = req.headers.get("authorization") || ""
    console.log("[v0] Auth header present:", authHeader ? "YES" : "NO")

    // Build the n8n URL
    const path = "/" + (params.path || []).join("/")
    const url = `${base}${webhookPath}${path}`
    console.log("[v0] Forwarding to n8n URL:", url)

    // Get request body
    const bodyText = await req.text()
    console.log("[v0] Request body:", bodyText)

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    // Forward authorization header to n8n
    if (authHeader) {
      headers["Authorization"] = authHeader
    }

    console.log("[v0] Making request to n8n...")
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: bodyText,
      cache: "no-store",
    })

    console.log("[v0] n8n response status:", res.status)

    const responseText = await res.text()
    console.log("[v0] n8n response body:", responseText)

    const contentType = res.headers.get("content-type") || "application/json"

    return new NextResponse(responseText, {
      status: res.status,
      headers: { "Content-Type": contentType },
    })
  } catch (err: any) {
    console.log("[v0] ERROR in n8n proxy:", err?.message)
    console.log("[v0] ERROR stack:", err?.stack)
    return NextResponse.json(
      {
        ok: false,
        error: "PROXY_ERROR",
        message: err?.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
