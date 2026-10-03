import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import BulkGenerator from "@/components/BulkGenerator";

export const metadata: Metadata = {
  title: "Toplu Ürün İçeriği Üret — Satly",
  description:
    "Onlarca ürünün başlık ve açıklamasını tek seferde üretin. Trendyol, Hepsiburada, Amazon ve Shopify için toplu içerik üreteci.",
  alternates: { canonical: "/toplu" },
};

export default function TopluPage() {
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
          <span className="text-slate-300">Toplu üretim</span>
        </nav>

        <div className="max-w-3xl">
          <span className="chip">Ajanslar & büyük mağazalar için</span>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Toplu Ürün İçeriği Üretimi
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-400">
            Ürün listenizi yapıştırın; başlık, açıklama ve SEO anahtar kelimelerini tek
            seferde onlarca ürün için üretin. Sonuçları CSV olarak indirin.
          </p>
        </div>

        <div className="mt-10">
          <BulkGenerator />
        </div>
      </main>
    </div>
  );
}
