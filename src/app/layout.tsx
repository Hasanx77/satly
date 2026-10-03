import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SatıcıAsistan — AI ile ürün açıklaması ve SEO",
  description:
    "Ürün adını yaz, 30 saniyede satışa hazır başlık, açıklama ve SEO anahtar kelimelerini al. Trendyol, Hepsiburada, Amazon ve Shopify için Türkçe AI ürün metni üreteci.",
  keywords: [
    "trendyol ürün açıklaması",
    "ürün başlığı yazma",
    "e-ticaret seo",
    "yapay zeka ürün açıklaması",
    "hepsiburada açıklama",
  ],
  openGraph: {
    title: "SatıcıAsistan — AI ile ürün açıklaması",
    description:
      "E-ticaret satıcıları için Türkçe AI ürün içeriği üreteci.",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-slate-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
