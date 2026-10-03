import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts";
import { rateLimit } from "@/lib/rate-limit";
import type { GenerationInput, GenerationResult, Language } from "@/lib/types";

export const runtime = "nodejs";

const requestSchema = z.object({
  name: z.string().min(2, "Ürün adı en az 2 karakter olmalı").max(200),
  category: z.string().max(120).optional().default(""),
  features: z.string().max(1000).optional().default(""),
  marketplace: z.enum(["trendyol", "hepsiburada", "amazon", "shopify"]),
  tone: z.enum(["profesyonel", "samimi", "premium", "genc"]).optional().default("profesyonel"),
  language: z.enum(["tr", "en"]).optional().default("tr"),
  // Base64 data URL (istemci tarafında küçültülmüş). Boyut güvenlik sınırı:
  image: z
    .string()
    .max(7_000_000)
    .refine((v) => v.startsWith("data:image/"), "Geçersiz görsel formatı")
    .optional(),
});

/** Anahtar yokken uygulamanın çalışmaya devam etmesi için örnek çıktı. */
function mockResult(input: GenerationInput, hasImage: boolean): GenerationResult {
  if (input.language === "en") {
    return {
      titleOptions: [
        `${input.name} - Practical and High Quality`,
        `${input.name} | Perfect for Everyday Use`,
        `${input.name} - Modern Design, Easy to Use`,
      ],
      shortDescription: `${input.name} is designed to meet your everyday needs with ease, featuring quality materials and a user-friendly design.`,
      longDescription: `${input.name} makes your daily routine easier.\n\nBuilt with durability and ease of use in mind. ${input.features || "Its clean, practical design fits any setting."}${hasImage ? " The visible details in the photo match the product." : ""}\n\nEasy to use and made for long-lasting performance.`,
      features: [
        "Easy and practical design",
        "Suitable for everyday use",
        input.features ? `Key feature: ${input.features}` : "Clean, modern look",
        "Durable materials",
        "Easy to carry and store",
      ],
      keywords: [
        input.name,
        `${input.name} price`,
        `${input.name} buy`,
        "best price",
        "high quality",
        "fast shipping",
      ],
      socialCaption: `✨ ${input.name} is now available! Easy to use, high quality and affordable. #ecommerce #new #sale #${input.marketplace}`,
    };
  }

  const brandHint = input.category ? `${input.category} ` : "";
  return {
    titleOptions: [
      `${input.name} - ${brandHint}Pratik ve Kaliteli Kullanım`,
      `${input.name} | Günlük Kullanıma Uygun ${brandHint}Ürün`,
      `${input.name} - Modern Tasarım, Kolay Kullanım`,
    ],
    shortDescription: `${input.name}, günlük ihtiyaçlarınızı kolayca karşılamak için tasarlandı. Kaliteli malzeme ve kullanıcı dostu yapısıyla öne çıkar.`,
    longDescription: `${input.name} ile günlük yaşamınızı kolaylaştırın.\n\nÜrün, kullanım kolaylığı ve dayanıklılık gözetilerek üretilmiştir. ${input.features || "Sade ve kullanışlı tasarımıyla her ortama uyum sağlar."}${hasImage ? " Fotoğrafta görünen detaylar ürünle uyumludur." : ""}\n\nKullanımı kolaydır ve uzun ömürlü bir kullanım sunmak üzere tasarlanmıştır.`,
    features: [
      "Kullanımı kolay ve pratik tasarım",
      "Günlük kullanıma uygun yapı",
      input.features ? `Öne çıkan özellik: ${input.features}` : "Sade ve modern görünüm",
      "Dayanıklı malzeme",
      "Kolay taşınabilir / saklanabilir",
    ],
    keywords: [
      input.name,
      `${input.name} fiyat`,
      `${brandHint}${input.name}`.trim(),
      `${input.name} yorumları`,
      `${input.name} satın al`,
      "uygun fiyat",
      "kaliteli ürün",
      "hızlı kargo",
    ],
    socialCaption: `✨ ${input.name} şimdi satışta! Kullanımı kolay, kaliteli ve uygun fiyatlı. #eticaret #yenigelen #indirim #${input.marketplace}`,
  };
}

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "local";
}

export async function POST(req: Request) {
  // Hız sınırı
  const ip = getClientIp(req);
  const rl = rateLimit(`generate:${ip}`);
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
  const language = (input.language || "tr") as Language;
  const apiKey = process.env.OPENAI_API_KEY;

  // Anahtar yoksa demo modu
  if (!apiKey) {
    return NextResponse.json(
      { result: mockResult(input, Boolean(image)), mock: true },
      { headers: { "X-RateLimit-Remaining": String(rl.remaining) } }
    );
  }

  try {
    const openai = new OpenAI({ apiKey });

    const userContent: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [
      { type: "text", text: buildUserPrompt(input, Boolean(image)) },
    ];
    if (image) {
      userContent.push({ type: "image_url", image_url: { url: image, detail: "low" } });
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500,
      messages: [
        { role: "system", content: buildSystemPrompt(input.marketplace, language) },
        { role: "user", content: userContent },
      ],
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const parsedResult = JSON.parse(raw) as GenerationResult;

    return NextResponse.json(
      { result: parsedResult, mock: false, usage: completion.usage },
      { headers: { "X-RateLimit-Remaining": String(rl.remaining) } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    return NextResponse.json(
      { error: `AI servisi hatası: ${message}` },
      { status: 502 }
    );
  }
}
