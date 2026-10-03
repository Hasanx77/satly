import type { Sector } from "./types";

export const SECTORS: { id: Sector; label: string }[] = [
  { id: "genel", label: "Genel" },
  { id: "giyim", label: "Giyim & Moda" },
  { id: "elektronik", label: "Elektronik" },
  { id: "kozmetik", label: "Kozmetik & Bakım" },
  { id: "ev_yasam", label: "Ev & Yaşam" },
  { id: "spor", label: "Spor & Outdoor" },
  { id: "gida", label: "Gıda" },
  { id: "anne_bebek", label: "Anne & Bebek" },
  { id: "evcil_hayvan", label: "Evcil Hayvan" },
  { id: "oto", label: "Otomotiv & Aksesuar" },
];

/** Sektöre özel yönergeler (Qsup/Celer'in "sektöre özel prompt" avantajına karşılık). */
export const SECTOR_RULES: Record<Sector, string> = {
  genel: "SEKTÖR: Genel. Fayda odaklı, sade ve güven veren bir anlatım kullan.",
  giyim:
    "SEKTÖR: Giyim & Moda. Beden, kumaş, kalıp, mevsim ve kombin uyumu vurgula. 'Beden tablosunu kontrol edin' gibi güvenli ifade kullan; ölçü uydurma.",
  elektronik:
    "SEKTÖR: Elektronik. Teknik özellikleri net ve maddeli ver; uyumluluk (şarj tipi, giriş/çıkış), kullanım senaryosu. Garanti süresi/sertifika uydurma.",
  kozmetik:
    "SEKTÖR: Kozmetik & Kişisel Bakım. Cilt tipi, içerik, kullanım şekli, hacim. SAĞLIK İDDİASI KURMA ('tedavi eder', 'geçirir' yasak). 'Dermatolojik olarak test edilmiştir' gibi iddiaları uydurma.",
  ev_yasam:
    "SEKTÖR: Ev & Yaşam. Ölçü, malzeme, montaj, temizlik/bakım ve kullanım alanı bilgisi ver.",
  spor:
    "SEKTÖR: Spor & Outdoor. Kullanım amacı, malzeme, dayanıklılık, hareket özgürlüğü ve taşınabilirlik vurgusu.",
  gida:
    "SEKTÖR: Gıda. İçindekiler, alerjen uyarısı, saklama koşulları, porsiyon. Son tüketim tarihi veya besin değeri uydurma.",
  anne_bebek:
    "SEKTÖR: Anne & Bebek. Yaş aralığı, güvenlik (BPA'sız vb. uydurma), hijyen ve kolay temizlik. Sağlık/güvenlik iddiası uydurma.",
  evcil_hayvan:
    "SEKTÖR: Evcil Hayvan. Tür/boy uygunluğu, malzeme, güvenlik ve kullanım kolaylığı.",
  oto:
    "SEKTÖR: Otomotiv & Aksesuar. Uyumluluk (marka/model), ölçü, montaj kolaylığı ve malzeme. Uyumluluk uydurma; 'uyumluluğu kontrol edin' ifadesi kullan.",
};

/** Seçilen sektöre göre hızlı eklenebilecek özellik önerileri (UI çipleri). */
export const FEATURE_SUGGESTIONS: Record<Sector, string[]> = {
  genel: ["Yüksek kaliteli malzeme", "Kolay kullanım", "Uzun ömürlü", "Modern tasarım"],
  giyim: ["Pamuklu kumaş", "Esnek yapı", "Nefes alabilir", "Kolay yıkanır", "Beden aralığı: S-XL"],
  elektronik: ["Hızlı şarj (Type-C)", "Uzun pil ömrü", "Bluetooth 5.3", "Hafif tasarım"],
  kozmetik: ["Vegan içerik", "Paraben içermez", "Tüm cilt tipleri", "Dermatolojik test"],
  ev_yasam: ["Kolay montaj", "Yıkanabilir", "Katlanabilir", "Çok amaçlı kullanım"],
  spor: ["Kaymaz taban", "Su dirençli", "Nefes alabilir", "Hafif ve taşınabilir"],
  gida: ["Doğal içerikler", "Katkısız", "Pratik ambalaj", "Uzun raf ömrü"],
  anne_bebek: ["BPA içermez", "Yumuşak doku", "Kolay temizlenir", "Yaşa uygun"],
  evcil_hayvan: ["Kaymaz taban", "Yıkanabilir", "Dayanıklı", "Çiğnemeye dayanıklı"],
  oto: ["Kolay montaj", "Su geçirmez", "Dayanıklı ABS", "Üniversal uyum"],
};
