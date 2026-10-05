"use client";

import { useState } from "react";

interface TemplateGroup {
  sector: string;
  titles: string[];
  features: string[];
  opening: string;
  social: string;
}

const TEMPLATES: TemplateGroup[] = [
  {
    sector: "Elektronik",
    titles: [
      "[Marka] [Ürün] — [Ana Özellik] | Şarjlı / Kablosuz",
      "[Ürün], [Kapasite/Pil] ile Uzun Kullanım — [Renk]",
      "[Marka] [Ürün] | [Kullanım Alanı] İçin İdeal",
    ],
    features: [
      "Uzun pil ömrü",
      "Hızlı şarj (Type-C)",
      "Bluetooth 5.3 / stabil bağlantı",
      "Hafif ve taşınabilir",
      "Kutudan çıkan aksesuarlar",
    ],
    opening:
      "[Ürün], günlük kullanımda konfor ve performansı bir arada sunar. Kolay kullanımı ve dayanıklı yapısıyla öne çıkar.",
    social: "⚡ [Ürün] şimdi satışta! Kaliteli, pratik ve uygun fiyatlı. #elektronik #yenigelen #indirim",
  },
  {
    sector: "Giyim & Moda",
    titles: [
      "[Ürün] — [Kumaş] Kumaş, Rahat Kalıp",
      "Kadın/Erkek [Ürün] | Günlük & Şık",
      "[Renk] [Ürün], Mevsimlik Kullanım",
    ],
    features: ["Pamuklu / nefes alabilir kumaş", "Rahat kalıp", "Kolay yıkanır", "Solmaya dayanıklı", "Beden aralığı: S-XL"],
    opening:
      "[Ürün], gün boyu rahatlık için tasarlandı. Nefes alabilir kumaşı ve modern kalıbıyla her kombine uyum sağlar.",
    social: "👗 [Ürün] ile şıklık ve rahatlık bir arada! #moda #kombin #yenigelen",
  },
  {
    sector: "Kozmetik & Bakım",
    titles: [
      "[Ürün] — [Cilt Tipi] Uygun | [Hacim] ml",
      "[Marka] [Ürün], [İçerik] İçeren Formül",
      "Günlük Bakım [Ürün] | Kolay Uygulama",
    ],
    features: ["Tüm cilt tiplerine uygun", "Hafif ve emici doku", "Pratik ambalaj", "Günlük kullanım", "Temiz içerik"],
    opening:
      "[Ürün], günlük bakım rutininize kolayca eklenir. Hafif dokusu ve pratik kullanımı ile cildinizi yormaz.",
    social: "✨ Bakım rutinine [Ürün] ekle! #bakım #ciltbakımı #yenigelen",
  },
  {
    sector: "Ev & Yaşam",
    titles: [
      "[Ürün] — [Ölçü] cm | Çok Amaçlı",
      "[Malzeme] [Ürün], Kolay Temizlik",
      "[Renk] [Ürün] | Modern Tasarım",
    ],
    features: ["Kolay montaj", "Yıkanabilir / kolay temizlik", "Dayanıklı malzeme", "Çok amaçlı kullanım", "Şık tasarım"],
    opening:
      "[Ürün], evinizde düzen ve şıklığı bir araya getirir. Pratik kullanımı ve dayanıklı yapısıyla uzun ömürlüdür.",
    social: "🏠 Evine [Ürün] ile düzen kat! #evdekorasyon #yenigelen",
  },
  {
    sector: "Spor & Outdoor",
    titles: [
      "[Ürün] — Kaymaz Taban | [Ölçü]",
      "[Marka] [Ürün], Antrenman İçin İdeal",
      "Hafif [Ürün] | Taşıma Çantalı",
    ],
    features: ["Kaymaz taban", "Su dirençli", "Hafif ve taşınabilir", "Nefes alabilir", "Uzun ömürlü malzeme"],
    opening:
      "[Ürün], antrenmandan günlük kullanıma kadar yanınızda. Kaymaz yüzeyi ve hafif yapısıyla konfor sunar.",
    social: "💪 Hedeflerine [Ürün] ile ulaş! #spor #fitness #yenigelen",
  },
  {
    sector: "Gıda",
    titles: [
      "[Ürün] — [Gramaj] g | Doğal",
      "[Marka] [Ürün], Katkısız",
      "Pratik [Ürün] | Uzun Raf Ömrü",
    ],
    features: ["Doğal içerikler", "Katkısız", "Pratik ambalaj", "Alerjen bilgisi etikette", "Uygun saklama koşulları"],
    opening:
      "[Ürün], sofralarınıza doğal lezzet katar. Pratik ambalajı ve tazeliğini koruyan yapısıyla her zaman yanınızda.",
    social: "🍯 Doğal lezzet [Ürün] şimdi satışta! #gıda #doğal #yenigelen",
  },
];

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {

    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 rounded-md border border-white/10 px-2 py-0.5 text-[11px] text-slate-400 transition hover:bg-white/[0.07] hover:text-white"
    >
      {copied ? "✓" : "Kopyala"}
    </button>
  );
}

export default function Sablonlar() {
  return (
    <div className="space-y-6">
      {TEMPLATES.map((t) => (
        <div key={t.sector} className="glass rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold text-white">{t.sector}</h3>

          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-300">
                Başlık kalıpları
              </p>
              <ul className="space-y-2">
                {t.titles.map((title) => (
                  <li key={title} className="flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
                    <span className="text-sm text-slate-300">{title}</span>
                    <CopyBtn text={title} />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-300">
                Özellik fikirleri
              </p>
              <div className="flex flex-wrap gap-1.5">
                {t.features.map((f) => (
                  <span
                    key={f}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-slate-300"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <div className="flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
              <span className="text-sm text-slate-400">{t.opening}</span>
              <CopyBtn text={t.opening} />
            </div>
            <div className="flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
              <span className="text-sm text-slate-400">{t.social}</span>
              <CopyBtn text={t.social} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
