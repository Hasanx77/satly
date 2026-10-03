# Satly

E-ticaret satıcıları için **Türkçe yapay zekâ destekli ürün içeriği üreteci**. Ürün adını
yazarsın; **başlık varyantları, kısa/uzun açıklama, özellik listesi, SEO anahtar kelimeleri
ve sosyal medya metni** üretir. Trendyol, Hepsiburada, Amazon TR ve Shopify formatlarına
uygun çıktı verir.

> Durum: **Beta / doğrulama aşaması.** Ödeme altyapısı yok; üretim geçmişi tarayıcıda
> (localStorage) tutulur.

---

## Hızlı Başlangıç (yerel)

```bash
cd "satly"
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini aç.

- **OpenAI anahtarı yoksa** uygulama otomatik olarak **demo modu**nda çalışır ve örnek
  çıktı üretir. Yani anahtar olmadan da arayüzü test edebilirsin.
- Gerçek üretim için `.env.local` içine `OPENAI_API_KEY=sk-...` ekle ve sunucuyu yeniden başlat.

## Ortam Değişkenleri

| Değişken | Zorunlu mu? | Açıklama |
|---|---|---|
| `OPENAI_API_KEY` | Gerçek üretim için evet | Yoksa demo modu |
| `OPENAI_MODEL` | Hayır | Varsayılan: `gpt-4o-mini` |
| `NEXT_PUBLIC_SUPABASE_URL` | Hayır | Hesap/abonelik için (2. aşama) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Hayır | Yukarıdakiyle birlikte |
| `IYZICO_API_KEY` / `IYZICO_SECRET_KEY` | Hayır | Ödeme (3. aşama) |
| `NEXT_PUBLIC_SITE_URL` | Önerilir | Sitemap/robots ve ödeme dönüş URL'leri |

## Komutlar

| Komut | İş |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Üretim derlemesi |
| `npm run start` | Derlenmiş sürümü çalıştır |
| `npm run lint` | Kod denetimi |

## Proje Yapısı

```
satly/
├─ src/
│  ├─ app/
│  │  ├─ page.tsx                      # Ana sayfa (hero + üretici + fiyatlar)
│  │  ├─ layout.tsx / globals.css      # Kök yerleşim + stiller
│  │  ├─ panel/page.tsx                # Kullanıcı paneli (yerel geçmiş)
│  │  ├─ araclar/baslik-uretici/page.tsx  # SEO / ücretsiz araç sayfası
│  │  ├─ robots.ts / sitemap.ts        # SEO
│  │  └─ api/
│  │     ├─ generate/route.ts          # AI üretim ucu (hız sınırlı)
│  │     └─ health/route.ts            # Sağlık kontrolü
│  ├─ components/                      # Navbar, Generator, ResultCard
│  └─ lib/                             # prompts, plans, types, supabase, rate-limit
├─ supabase/schema.sql                 # Veritabanı + RLS şeması
├─ docs/                               # İş planı, GTM, devir raporu
└─ .env.example
```

## Vercel'e Dağıtım

1. [vercel.com](https://vercel.com) → New Project → bu klasörü GitHub'a push edip bağla
   (veya `npx vercel`).
2. Environment Variables: `OPENAI_API_KEY`, `NEXT_PUBLIC_SITE_URL` (vercel domain'in).
3. Deploy. Bitti.

> `.env.local` dosyasını **asla** GitHub'a gönderme (`.gitignore` hallediyor).

## Yol Haritası ve İş Planı

- `docs/HANDOVER.md` — bu projede ne yapıldı, sırada ne var (önce bunu oku)
- `docs/GTM.md` — pazara giriş / müşteri bulma planı
- `docs/PAZARLAMA-MESAJLARI.md` — hazır DM/e-posta/grup mesajları
- `docs/ICERIK-PLANI.md` — SEO içerik takvimi ve anahtar kelimeler
- `docs/ROADMAP.md` — teknik yol haritası (aşama aşama)

## Lisans / Sorumluluk

Beta yazılım. Üretilen metinleri yayınlamadan önce kontrol et. AI, kullanıcının vermediği
teknik özellikleri uydurmayacak şekilde yönlendirilmiştir; ancak yine de doğrula.
