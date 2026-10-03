import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import TopluFiyat from "@/components/TopluFiyat";

export const metadata: Metadata = {
  title: "Toplu Satış Fiyatı Hesaplayıcı — Satly",
  description:
    "Ürün maliyet listenizi yapıştırın; komisyon, KDV, kargo ve kâr marjına göre tüm ürünler için önerilen satış fiyatlarını tek seferde hesaplayın. CSV indirin.",
  keywords: ["toplu fiyat hesaplama", "trendyol komisyon", "e-ticaret fiyatlandırma", "kâr marjı"],
  alternates: { canonical: "/araclar/toplu-fiyat" },
};

export default function TopluFiyatPage() {
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
          <span className="text-slate-300">Toplu fiyat hesaplayıcı</span>
        </nav>
        <div className="max-w-3xl">
          <span className="chip">Ücretsiz araç · Kayıt gerekmez</span>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Toplu Satış Fiyatı Hesaplayıcı
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-400">
            Tüm ürün listeniz için <b className="text-slate-200">komisyon, KDV ve marja göre</b>{" "}
            önerilen satış fiyatlarını saniyeler içinde hesaplayın.
          </p>
        </div>
        <div className="mt-10">
          <TopluFiyat />
        </div>
      </main>
    </div>
  );
}
