import type { GenerationInput, Marketplace, Tone } from "./types";

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

const BASE_RULES = `
Sen Türkiye'nin en iyi e-ticaret metin yazarı ve SEO uzmanısın.
Türkçe ürün metinleri üretiyorsun. Kurallar:

1. Tüm çıktı TÜRKÇE olacak ve akıcı, doğal Türkçe ile yazılacak.
2. ASLA uydurma teknik özellik, marka, sertifika, garanti süresi veya sayı ekleme.
   Kullanıcı bir özellik vermediyse onu yazma; onun yerine genel ve güvenli bir ifade kullan.
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
  "socialCaption": "Instagram için 1-2 cümle + 3-5 hashtag"
}
`.trim();

const MARKET_RULES: Record<Marketplace, string> = {
  trendyol: `
PAZARYERİ: Trendyol
- Başlık: 3 farklı varyant üret. Her biri 60-100 karakter arası, anahtar kelimeyle başlasın,
  gereksiz süsleme olmasın (Trendyol kullanıcısı hızlı tarar).
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
PAZARYERİ: Amazon TR
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

export function buildSystemPrompt(marketplace: Marketplace): string {
  return [BASE_RULES, MARKET_RULES[marketplace]].join("\n\n");
}

export function buildUserPrompt(input: GenerationInput): string {
  const tone = (input.tone || "profesyonel") as Tone;
  const lines = [
    "Aşağıdaki ürün için satışa hazır içerik üret.",
    "",
    `Ürün adı: ${input.name}`,
    `Kategori: ${input.category || "(belirtilmedi)"}`,
    `Bilinen özellikler: ${input.features || "(kullanıcı özellik vermedi - uydurma)"}`,
    "",
    TONE_RULES[tone] || TONE_RULES.profesyonel,
    "",
    "JSON çıktısını ver.",
  ];
  return lines.join("\n");
}
