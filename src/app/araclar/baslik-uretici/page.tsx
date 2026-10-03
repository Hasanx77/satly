import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Generator from "@/components/Generator";

export const metadata: Metadata = {
  title: "Ücretsiz Ürün Başlığı Üretici — Trendyol & Amazon",
  description:
    "Ürün adını yaz, Trendyol, Hepsiburada, Amazon ve Shopify için satışa hazır ürün başlığı, açıklama ve SEO anahtar kelimeleri üret. Ücretsiz dene.",
  keywords: [
    "ücretsiz ürün başlığı üretici",
    "trendyol başlık yazma",
    "ürün açıklaması üretici",
    "e-ticaret metin üreteci",
  ],
  alternates: { canonical: "/araclar/baslik-uretici" },
};

export default function BaslikUreticiPage() {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px]">
        <div className="absolute left-1/2 top-[-20%] h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-brand-600/20 blur-[130px]" />
      </div>

      <Navbar />
      <main className="container-x py-12">
        <nav className="mb-5 text-sm text-slate-500">
          <Link href="/" className="transition hover:text-slate-300">
            Ana sayfa
          </Link>
          <span className="mx-2 text-slate-700">/</span>
          <span className="text-slate-300">Ücretsiz ürün başlığı üretici</span>
        </nav>

        <div className="max-w-3xl">
          <span className="chip">Ücretsiz araç · Kayıt gerekmez</span>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Ücretsiz Ürün Başlığı ve Açıklama Üretici
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-400">
            Ürün adını ve bilinen özelliklerini yazın; Trendyol, Hepsiburada, Amazon veya
            Shopify için <b className="text-slate-200">satışa hazır başlık, açıklama ve SEO
            anahtar kelimeleri</b> üretsin. İlk 2 üretim ücretsizdir.
          </p>
        </div>

        <div className="mt-10">
          <Generator />
        </div>
      </main>
    </div>
  );
}
