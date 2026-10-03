import { NextResponse } from "next/server";
import { z } from "zod";
import { generateContent } from "@/lib/generate";
import { rateLimit } from "@/lib/rate-limit";
import type { GenerationInput, GenerationResult } from "@/lib/types";

export const runtime = "nodejs";

const itemSchema = z.object({
  name: z.string().min(2).max(200),
  category: z.string().max(120).optional().default(""),
  features: z.string().max(1000).optional().default(""),
  marketplace: z.enum(["trendyol", "hepsiburada", "amazon", "shopify"]),
  tone: z.enum(["profesyonel", "samimi", "premium", "genc"]).optional().default("profesyonel"),
  language: z.enum(["tr", "en"]).optional().default("tr"),
});

const bulkSchema = z.object({
  items: z.array(itemSchema).min(1).max(25),
});

export interface BulkResultRow {
  name: string;
  result?: GenerationResult;
  error?: string;
}

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "local";
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = rateLimit(`bulk:${ip}`, 5);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Çok fazla toplu istek. Lütfen bir dakika sonra tekrar deneyin." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.reset - Date.now()) / 1000)) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const parsed = bulkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Doğrulama hatası", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { items } = parsed.data;
  const rows: BulkResultRow[] = [];
  let anyReal = false;

  for (const item of items) {
    const input = item as GenerationInput;
    try {
      const out = await generateContent(input);
      if (!out.mock) anyReal = true;
      rows.push({ name: item.name, result: out.result });
    } catch (err) {
      rows.push({
        name: item.name,
        error: err instanceof Error ? err.message : "Bilinmeyen hata",
      });
    }
  }

  return NextResponse.json({ rows, mock: !anyReal });
}
