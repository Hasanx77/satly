import type { GenerationInput, Language, Marketplace, Tone } from "./types";

export const MARKETPLACES: {
  id: Marketplace;
  label: string;
  note: string;
}[] = [
  {
    id: "trendyol",
    label: "Trendyol",
    note: "Kısa, anahtar kelime odaklı başlık (max ~100 karakter)",
  },
  {
    id: "hepsiburada",
    label: "Hepsiburada",
    note: "Güven veren ton + net teknik özellikler",
  },
  {
    id: "amazon",
    label: "Amazon TR",
    note: "5 madde (bullet point) + soru-cevap odaklı açıklama",
  },
  {
    id: "shopify",
    label: "Shopify / Kendi siten",
    note: "Marka odaklı, uzun ve SEO uyumlu açıklama",
  },
];

export const TONES: { id: Tone; label: string }[] = [
  { id: "profesyonel", label: "Profesyonel" },
  { id: "samimi", label: "Samimi" },
  { id: "premium", label: "Premium / lüks" },
  { id: "genc", label: "Genç & enerjik" },
];

export const LANGUAGES: { id: Language; label: string; flag: string }[] = [
  { id: "tr", label: "Türkçe", flag: "🇹🇷" },
  { id: "en", label: "English", flag: "🇬🇧" },
];

const BASE_RULES = `
Sen dünyanın en iyi e-ticaret metin yazarı ve SEO uzmanısın.
Kurallar:

1. Akıcı, doğal ve satış odaklı metin yaz.
2. ASLA uydurma teknik özellik, marka, sertifika, garanti süresi veya sayı ekleme.
   Kullanıcı bir özellik vermediyse onu yazma; onun yerine genel ve güvenli bir ifade kullan.
   Bir görsel verildiyse, SADECE görselde gerçekten görünen özellikleri (renk, biçim, tür, adet,
   malzeme izlenimi) betimleyebilirsin; görünmeyen teknik detayı uydurma.
3. Abartılı ve yanıltıcı ifadeler ("dünyanın en iyisi", "%100 garanti") kullanma.
4. Anahtar kelimeleri doğal biçimde metne yerleştir, keyword stuffing yapma.
5. Çıktıyı SADECE aşağıdaki JSON şemasına uygun ver, başka açıklama yazma.

JSON ŞEMASI:
{
  "titleOptions": ["başlık 1", "başlık 2", "başlık 3"],
  "shortDescription": "1-2 cümlelik kısa açıklama",
  "longDescription": "paragraflara ayrılmış detaylı açıklama",
  "features": ["özellik 1", "özellik 2", "özellik 3"],
  "keywords": ["anahtar kelime 1", "anahtar kelime 2"],
  "socialCaption": "sosyal medya için 1-2 cümle + 3-5 hashtag"
}
`.trim();

const LANGUAGE_RULES: Record<Language, string> = {
  tr: "DİL: Tüm çıktı, başlıklar ve anahtar kelimeler dahil, TÜRKÇE olacak.",
  en: "LANGUAGE: All output — titles, descriptions, features, keywords and social caption — must be in ENGLISH.",
};

const MARKET_RULES: Record<Marketplace, string> = {
  trendyol: `
PAZARYERİ: Trendyol
- Başlık: 3 farklı varyant üret. Her biri 60-100 karakter arası, anahtar kelimeyle başlasın.
- Kısa açıklama: Trendyol ürün kartı için 1-2 cümle.
- Uzun açıklama: Madde madde okunabilir, kategoriye uygun.
- Özellikler: 5-8 madde, satın alma kararını kolaylaştıracak şekilde.
- Anahtar kelimeler: Trendyol arama kutusunda kullanılan doğal aramalar (8-12 adet).`,
  hepsiburada: `
PAZARYERİ: Hepsiburada
- Başlık: 3 varyant, marka/model + temel özellik + kullanım amacı kalıbında.
- Ton: güven veren, kurumsal, net.
- Özellikler: teknik tablo mantığında (materyal, ölçü, renk, uyumluluk) 6-10 madde.
- Uzun açıklama: garanti/iade/kullanım bilgisi vurgusu (uydurma süre verme).
- Anahtar kelimeler: 8-12 adet.`,
  amazon: `
PAZARYERİ: Amazon
- Başlık: 3 varyant, 150 karakteri geçmesin; marka + ürün + özellik + boyut/renk.
- Özellikler: TAM 5 madde, her biri fayda odaklı (bullet point).
- Uzun açıklama: müşteri sorularını yanıtlar nitelikte (neden almalı, nasıl kullanılır).
- Anahtar kelimeler: Amazon arama terimleri 10-15 adet.
- Kısa açıklama: 1 cümle.`,
  shopify: `
PAZARYERİ: Shopify / kendi web sitesi
- Başlık: 3 varyant, marka sesi güçlü, SEO başlığı gibi (60-70 karakter ideal).
- Ton: hikâyeleştirici, marka odaklı.
- Uzun açıklama: 3-4 paragraf; ürünün çözdüğü problemi ve deneyimi anlatsın.
- Özellikler: 6-8 madde.
- Anahtar kelimeler: Google aramalarına uygun 8-12 adet (SEO).
- Kısa açıklama: 2 cümle.`,
};

const TONE_RULES: Record<Tone, string> = {
  profesyonel: "Ton: net, güvenilir, gereksiz süslemesiz.",
  samimi: "Ton: sıcak, samimi, sanki bir arkadaş öneriyormuş gibi.",
  premium: "Ton: sofistike, seçkin, kalite vurgusu yapan.",
  genc: "Ton: enerjik, genç, kısa cümleli, güncel.",
};

export function buildSystemPrompt(marketplace: Marketplace, language: Language = "tr"): string {
  return [
    BASE_RULES,
    LANGUAGE_RULES[language] || LANGUAGE_RULES.tr,
    MARKET_RULES[marketplace],
  ].join("\n\n");
}

export function buildUserPrompt(input: GenerationInput, withImage = false): string {
  const tone = (input.tone || "profesyonel") as Tone;
  const lines = [
    "Aşağıdaki ürün için satışa hazır içerik üret.",
    "",
    `Ürün adı: ${input.name}`,
    `Kategori: ${input.category || "(belirtilmedi)"}`,
    `Bilinen özellikler: ${input.features || "(kullanıcı özellik vermedi - uydurma)"}`,
  ];
  if (withImage) {
    lines.push(
      "Ek olarak bir ürün görseli verildi. Görselde GÖRÜNEN özellikleri (renk, biçim, tür, malzeme izlenimi) açıklamana katabilirsin; görünmeyen teknik detayı uydurma."
    );
  }
  lines.push("", TONE_RULES[tone] || TONE_RULES.profesyonel, "", "JSON çıktısını ver.");
  return lines.join("\n");
}
