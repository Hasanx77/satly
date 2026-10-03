import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Satly — E-ticaret içerik üreteci",
    short_name: "Satly",
    description:
      "Ürün adından veya görselden satışa hazır başlık, açıklama ve SEO anahtar kelimeleri üretir.",
    start_url: "/",
    display: "standalone",
    background_color: "#05060b",
    theme_color: "#7c3aed",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon.svg", sizes: "192x192", type: "image/svg+xml" },
      { src: "/icon.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
  };
}
