import { NextResponse } from "next/server";
import { z } from "zod";
import { generateContent } from "@/lib/generate";
import { rateLimit } from "@/lib/rate-limit";
import type { GenerationInput, Language } from "@/lib/types";

export const runtime = "nodejs";

const requestSchema = z.object({
  name: z.string().min(2, "Ürün adı en az 2 karakter olmalı").max(200),
  category: z.string().max(120).optional().default(""),
  features: z.string().max(1000).optional().default(""),
  marketplace: z.enum(["trendyol", "hepsiburada", "amazon", "shopify"]),
  tone: z.enum(["profesyonel", "samimi", "premium", "genc"]).optional().default("profesyonel"),
  language: z.enum(["tr", "en"]).optional().default("tr"),
  image: z
    .string()
    .max(7_000_000)
    .refine((v) => v.startsWith("data:image/"), "Geçersiz görsel formatı")
    .optional(),
});

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "local";
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = rateLimit(`generate:${ip}`, 20);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Çok fazla istek gönderdiniz. Lütfen bir dakika sonra tekrar deneyin." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.reset - Date.now()) / 1000)),
          "X-RateLimit-Limit": String(rl.limit),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Geçersiz istek gövdesi (JSON bekleniyor)." },
      { status: 400 }
    );
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Doğrulama hatası", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { image, ...input } = parsed.data;
  // Dil tipini garantiye al
  const typedInput: GenerationInput = { ...input, language: input.language as Language };

  try {
    const out = await generateContent(typedInput, image);
    return NextResponse.json(
      { result: out.result, mock: out.mock, usage: out.usage },
      { headers: { "X-RateLimit-Remaining": String(rl.remaining) } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    return NextResponse.json({ error: `AI servisi hatası: ${message}` }, { status: 502 });
  }
}
