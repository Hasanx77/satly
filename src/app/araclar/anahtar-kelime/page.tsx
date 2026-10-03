import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import KeywordAnaliz from "@/components/KeywordAnaliz";

export const metadata: Metadata = {
  title: "Ücretsiz Anahtar Kelime Analizi — Satly",
  description:
    "Rakip ürün başlıklarını yapıştırın; en sık geçen anahtar kelimeleri ve ikili ifadeleri çıkarın. Trendyol ve Hepsiburada SEO için ücretsiz araç.",
  keywords: ["anahtar kelime analizi", "trendyol seo", "rakip analizi", "e-ticaret seo"],
  alternates: { canonical: "/araclar/anahtar-kelime" },
};

export default function AnahtarKelimePage() {
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
          <span className="text-slate-300">Anahtar kelime analizi</span>
        </nav>
        <div className="max-w-3xl">
          <span className="chip">Ücretsiz araç · Kayıt gerekmez</span>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Anahtar Kelime Analizi
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-400">
            Rakip ilanlarını analiz edin, <b className="text-slate-200">en çok aranan kelimeleri</b>{" "}
            bulun ve kendi başlığınızda kullanın.
          </p>
        </div>
        <div className="mt-10">
          <KeywordAnaliz />
        </div>
      </main>
    </div>
  );
}
