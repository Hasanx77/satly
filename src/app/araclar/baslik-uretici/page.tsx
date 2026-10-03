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
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <nav className="mb-4 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-800">
            Ana sayfa
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800">Ücretsiz ürün başlığı üretici</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-slate-900">
          Ücretsiz Ürün Başlığı ve Açıklama Üretici
        </h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Ürün adını ve bilinen özelliklerini yazın; Trendyol, Hepsiburada, Amazon veya
          Shopify için <b>satışa hazır başlık, açıklama ve SEO anahtar kelimeleri</b>{" "}
          üretsin. Kayıt gerekmez, ilk 5 üretim ücretsizdir.
        </p>

        <div className="mt-8">
          <Generator />
        </div>
      </main>
    </div>
  );
}
