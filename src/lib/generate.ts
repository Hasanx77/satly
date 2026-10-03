import OpenAI from "openai";
import { buildSystemPrompt, buildUserPrompt } from "./prompts";
import type { GenerationInput, GenerationResult } from "./types";

export interface GenerateUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}

export interface GenerateOutput {
  result: GenerationResult;
  mock: boolean;
  usage?: GenerateUsage;
}

/** Anahtar yokken uygulamanın çalışmaya devam etmesi için örnek çıktı. */
export function mockResult(input: GenerationInput, hasImage = false): GenerationResult {
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

/** Tek bir ürün için içerik üretir (OpenAI varsa gerçek, yoksa demo). */
export async function generateContent(
  input: GenerationInput,
  image?: string
): Promise<GenerateOutput> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { result: mockResult(input, Boolean(image)), mock: true };
  }

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
      { role: "system", content: buildSystemPrompt(input.marketplace, input.language || "tr") },
      { role: "user", content: userContent },
    ],
  });

  const raw = completion.choices[0]?.message?.content || "{}";
  return {
    result: JSON.parse(raw) as GenerationResult,
    mock: false,
    usage: completion.usage,
  };
}
