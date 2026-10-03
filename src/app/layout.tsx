import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Satly — E-ticaret metnini yapay zekâya bırak",
  description:
    "Ürün adını yaz; 30 saniyede satışa hazır başlık, açıklama, özellik listesi ve SEO anahtar kelimelerini al. Trendyol, Hepsiburada, Amazon ve Shopify için Türkçe yapay zekâ.",
  keywords: [
    "trendyol ürün açıklaması",
    "ürün başlığı yazma",
    "e-ticaret seo",
    "yapay zeka ürün açıklaması",
    "hepsiburada açıklama",
    "amazon listing türkçe",
  ],
  openGraph: {
    title: "Satly — E-ticaret metnini yapay zekâya bırak",
    description:
      "Ürün adını yaz, 30 saniyede satışa hazır içerik al. Trendyol, Hepsiburada, Amazon ve Shopify için.",
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
    <html lang="tr" className={`${inter.variable} ${display.variable}`}>
      <body className="min-h-screen bg-ink-950 font-sans antialiased selection:bg-brand-500/40">
        {children}
      </body>
    </html>
  );
}
