"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "İçerikleri yayına koymadan önce düzenlemem gerekir mi?",
    a: "Üretilen metinler yayına hazır kalitede tasarlanır. Yine de markanıza özel detayları (garanti, kargo, kampanya) eklemenizi öneririz. Amaç, sıfırdan yazma zahmetini ortadan kaldırmaktır.",
  },
  {
    q: "Yapay zekâ olmayan özellikleri uyduruyor mu?",
    a: "Hayır. Sistem, vermediğiniz teknik özellikleri uydurmaması için özel kurallarla yönlendirilmiştir. Bilmediği bir detayı yazmak yerine güvenli, genel ifadeler kullanır.",
  },
  {
    q: "Hangi pazaryerleri destekleniyor?",
    a: "Trendyol, Hepsiburada, Amazon TR ve Shopify / kendi siteniz. Her pazaryeri için başlık uzunluğu, madde yapısı ve ton farklı şekilde optimize edilir.",
  },
  {
    q: "Ücretsiz mi, kart bilgisi gerekiyor mu?",
    a: "İlk 2 üretim tamamen ücretsizdir ve kayıt istemez. Devam etmek isterseniz aylık planlar 200 ₺'den başlar; yıllık ödemede %50 indirim uygulanır.",
  },
  {
    q: "İngilizce veya başka dillerde de üretiyor mu?",
    a: "Şu an birincil dil Türkçe. İhracat yapan satıcılar için İngilizce çıktı desteği yol haritasında yer alıyor.",
  },
  {
    q: "Verilerim güvende mi?",
    a: "Üretim istekleri sunucu tarafında işlenir; API anahtarları tarayıcıya asla gönderilmez. Üretim geçmişiniz şu an kendi tarayıcınızda saklanır; bulut hesap desteği yakında geliyor.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className={`card overflow-hidden p-0 transition ${
                isOpen ? "border-brand-400/30 bg-white/[0.05]" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-medium text-slate-100">{f.q}</span>
                <span
                  className={`shrink-0 text-brand-300 transition-transform duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-slate-400">
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
