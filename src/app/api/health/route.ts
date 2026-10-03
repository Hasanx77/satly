import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "satly",
    aiConfigured: Boolean(process.env.OPENAI_API_KEY),
    time: new Date().toISOString(),
  });
}
