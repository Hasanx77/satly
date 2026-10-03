export interface Plan {
  id: string;
  name: string;
  price: number; // aylık fiyat
  priceYearly: number; // yıllık toplam fiyat
  period: string;
  quota: string;
  highlight?: boolean;
  features: string[];
}

export const FREE_QUOTA = 2;

// Fiyat oranı: Başlangıç 200 ₺/ay temel alınarak oranlı yükseltildi.
//   Başlangıç 200/ay  ·  Pro 400/ay  ·  Ajans 1.000/ay
//   Yıllık = aylık × 6 (yani %50 indirim).
export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Ücretsiz",
    price: 0,
    priceYearly: 0,
    period: "",
    quota: "2 üretim / ay",
    features: ["2 ürün içeriği / ay", "Tek pazaryeri", "Kopyala & indir"],
  },
  {
    id: "starter",
    name: "Başlangıç",
    price: 200,
    priceYearly: 1200,
    period: "/ay",
    quota: "100 üretim / ay",
    highlight: true,
    features: [
      "100 ürün içeriği / ay",
      "Tüm pazaryerleri",
      "SEO anahtar kelimeleri",
      "Üretim geçmişi",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 400,
    priceYearly: 2400,
    period: "/ay",
    quota: "500 üretim / ay",
    features: [
      "500 ürün içeriği / ay",
      "Tüm pazaryerleri + sosyal medya",
      "Öncelikli destek",
      "Marka sesi ayarı",
    ],
  },
  {
    id: "agency",
    name: "Ajans",
    price: 1000,
    priceYearly: 6000,
    period: "/ay",
    quota: "2.000 üretim / ay",
    features: [
      "2.000 ürün içeriği / ay",
      "5 kullanıcı",
      "Toplu üretim (yakında)",
      "API erişimi (yakında)",
    ],
  },
];
