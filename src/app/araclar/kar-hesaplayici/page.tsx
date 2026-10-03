import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import KarHesaplayici from "@/components/KarHesaplayici";

export const metadata: Metadata = {
  title: "Ücretsiz Kâr & Satış Fiyatı Hesaplayıcı — Satly",
  description:
    "E-ticaret için komisyon, KDV, kargo ve kâr marjını hesaplayıp ideal satış fiyatını bulun. Trendyol, Hepsiburada, Amazon ve Shopify için ücretsiz araç.",
  keywords: [
    "trendyol komisyon hesaplama",
    "e-ticaret kâr hesaplayıcı",
    "satış fiyatı hesaplama",
    "kâr marjı hesaplama",
  ],
  alternates: { canonical: "/araclar/kar-hesaplayici" },
};

export default function KarHesaplayiciPage() {
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
          <span className="text-slate-300">Kâr hesaplayıcı</span>
        </nav>

        <div className="max-w-3xl">
          <span className="chip">Ücretsiz araç · Kayıt gerekmez</span>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Kâr &amp; Satış Fiyatı Hesaplayıcı
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-400">
            Maliyet, kargo, komisyon ve KDV'yi girin; hedeflediğiniz kâr marjına göre{" "}
            <b className="text-slate-200">ideal satış fiyatını</b> görün.
          </p>
        </div>

        <div className="mt-10">
          <KarHesaplayici />
        </div>
      </main>
    </div>
  );
}
