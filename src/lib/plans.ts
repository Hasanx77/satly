export interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  quota: string;
  highlight?: boolean;
  features: string[];
}

export const FREE_QUOTA = 2;

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Ücretsiz",
    price: 0,
    period: "",
    quota: "2 üretim / ay",
    features: [
      "2 ürün içeriği / ay",
      "Tek pazaryeri",
      "Kopyala & indir",
    ],
  },
  {
    id: "starter",
    name: "Başlangıç",
    price: 245,
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
    price: 495,
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
    price: 1250,
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
