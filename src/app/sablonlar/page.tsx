import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Sablonlar from "@/components/Sablonlar";

export const metadata: Metadata = {
  title: "Ürün Başlığı ve Açıklama Şablonları — Satly",
  description:
    "Elektronik, giyim, kozmetik, ev, spor ve gıda için hazır ürün başlığı kalıpları, özellik fikirleri ve sosyal medya şablonları. Kopyala, kullan.",
  keywords: ["ürün başlığı şablonları", "ürün açıklaması örnekleri", "trendyol başlık örnekleri"],
  alternates: { canonical: "/sablonlar" },
};

export default function SablonlarPage() {
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
          <span className="text-slate-300">Şablonlar</span>
        </nav>
        <div className="max-w-3xl">
          <span className="chip">Ücretsiz kütüphane</span>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Ürün Başlığı ve Açıklama Şablonları
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-400">
            Kategorilere göre hazır başlık kalıpları, özellik fikirleri ve sosyal medya
            şablonları. Kopyalayın, ürününüze uyarlayın.
          </p>
        </div>
        <div className="mt-10">
          <Sablonlar />
        </div>
      </main>
    </div>
  );
}
