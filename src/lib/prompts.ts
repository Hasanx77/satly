import type { BrandVoice, GenerationInput, Language, Marketplace, Sector, Tone } from "./types";
import { SECTOR_RULES } from "./sectors";

export const MARKETPLACES: {
  id: Marketplace;
  label: string;
  note: string;
}[] = [
  { id: "trendyol", label: "Trendyol", note: "Kısa, anahtar kelime odaklı başlık" },
  { id: "hepsiburada", label: "Hepsiburada", note: "Güven veren ton + net teknik özellikler" },
  { id: "amazon", label: "Amazon", note: "5 madde + soru-cevap odaklı açıklama" },
  { id: "shopify", label: "Shopify / Kendi siten", note: "Marka odaklı, uzun ve SEO uyumlu" },
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
  { id: "de", label: "Deutsch", flag: "🇩🇪" },
  { id: "fr", label: "Français", flag: "🇫🇷" },
  { id: "es", label: "Español", flag: "🇪🇸" },
  { id: "ar", label: "العربية", flag: "🇸🇦" },
  { id: "ru", label: "Русский", flag: "🇷🇺" },
];

export const TITLE_LIMITS: Record<Marketplace, number> = {
  trendyol: 100,
  hepsiburada: 120,
  amazon: 150,
  shopify: 70,
};

const BASE_RULES = `
Sen dünyanın en iyi e-ticaret metin yazarı ve SEO uzmanısın.
Kurallar:

1. Akıcı, doğal ve satış odaklı metin yaz.
2. ASLA uydurma teknik özellik, marka, sertifika, garanti süresi veya sayı ekleme.
   Kullanıcı bir özellik vermediyse onu yazma; güvenli ve genel bir ifade kullan.
   Görsel verildiyse SADECE görselde gerçekten görünen özellikleri (renk, biçim, tür, malzeme
   izlenimi) betimleyebilirsin; görünmeyen teknik detayı uydurma.
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
  tr: "DİL: Tüm çıktı (başlık, açıklama, özellik, kelimeler, sosyal metin) TÜRKÇE olacak.",
  en: "LANGUAGE: All output must be in ENGLISH.",
  de: "SPRACHE: Die gesamte Ausgabe muss auf DEUTSCH sein.",
  fr: "LANGUE : Toute la sortie doit être en FRANÇAIS.",
  es: "IDIOMA: Toda la salida debe estar en ESPAÑOL.",
  ar: "اللغة: يجب أن يكون كل الناتج باللغة العربية.",
  ru: "ЯЗЫК: Весь вывод должен быть на РУССКОМ языке.",
};

const MARKET_RULES: Record<Marketplace, string> = {
  trendyol: `
PAZARYERİ: Trendyol
- Başlık: 3 varyant, 60-100 karakter, anahtar kelimeyle başlasın.
- Özellikler: 5-8 madde. Anahtar kelimeler: 8-12 doğal arama.`,
  hepsiburada: `
PAZARYERİ: Hepsiburada
- Başlık: 3 varyant, marka/model + temel özellik + kullanım amacı.
- Ton: güven veren, kurumsal. Özellikler: teknik tablo mantığında 6-10 madde.`,
  amazon: `
PAZARYERİ: Amazon
- Başlık: 3 varyant, 150 karakteri geçmesin.
- Özellikler: TAM 5 madde, fayda odaklı. Açıklama müşteri sorularını yanıtlasın.`,
  shopify: `
PAZARYERİ: Shopify / kendi site
- Başlık: 3 varyant, SEO başlığı (60-70 karakter). Ton: hikâyeleştirici, marka odaklı.
- Uzun açıklama: 3-4 paragraf. Kelimeler: Google aramalarına uygun 8-12 adet.`,
};

const TONE_RULES: Record<Tone, string> = {
  profesyonel: "Ton: net, güvenilir, gereksiz süslemesiz.",
  samimi: "Ton: sıcak, samimi, bir arkadaş öneriyormuş gibi.",
  premium: "Ton: sofistike, seçkin, kalite vurgusu yapan.",
  genc: "Ton: enerjik, genç, kısa cümleli, güncel.",
};

function brandBlock(brand?: BrandVoice): string {
  if (!brand) return "";
  const parts: string[] = [];
  if (brand.name?.trim()) parts.push(`- Marka adı: ${brand.name.trim()}`);
  if (brand.toneNote?.trim()) parts.push(`- Marka tonu: ${brand.toneNote.trim()}`);
  if (brand.keywords?.trim()) parts.push(`- Mutlaka kullanılacak kelimeler: ${brand.keywords.trim()}`);
  if (brand.avoid?.trim()) parts.push(`- ASLA kullanılmayacak ifadeler: ${brand.avoid.trim()}`);
  if (parts.length === 0) return "";
  return "MARKA SESİ (buna kesinlikle uy):\n" + parts.join("\n");
}

export function buildSystemPrompt(
  marketplace: Marketplace,
  language: Language = "tr",
  sector: Sector = "genel",
  brand?: BrandVoice
): string {
  return [
    BASE_RULES,
    LANGUAGE_RULES[language] || LANGUAGE_RULES.tr,
    SECTOR_RULES[sector] || SECTOR_RULES.genel,
    MARKET_RULES[marketplace],
    brandBlock(brand),
  ]
    .filter(Boolean)
    .join("\n\n");
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
      "Ek olarak bir ürün görseli verildi. Görselde GÖRÜNEN özellikleri (renk, biçim, tür, malzeme izlenimi) katabilirsin; görünmeyeni uydurma."
    );
  }
  lines.push("", TONE_RULES[tone] || TONE_RULES.profesyonel, "", "JSON çıktısını ver.");
  return lines.join("\n");
}
