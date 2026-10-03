# TEKNİK YOL HARİTASI (ROADMAP)

Her faz bir öncekinin üstüne çıkar. Faz 0 bitmiş durumda.

---

## Faz 0 — MVP ✅ (TAMAMLANDI)

- [x] Next.js + TypeScript + Tailwind iskeleti
- [x] AI üretim motoru (4 pazaryeri, 4 üslup)
- [x] Kopyala / CSV / TXT dışa aktarma
- [x] Yerel geçmiş + panel
- [x] Demo modu (anahtar olmadan çalışır)
- [x] Hız sınırı, girdi doğrulama
- [x] SEO (robots, sitemap, metadata) + ücretsiz araç sayfası
- [x] Build doğrulandı

## Faz 1 — Doğrulama (1–3 hafta)

- [ ] OpenAI anahtarı + Vercel deploy
- [ ] 10 beta kullanıcı, geri bildirim
- [ ] Analytics ekle (Vercel Analytics veya Plausible)
- [ ] Basit geri bildirim widget'ı
- [ ] Karakter/kelime sayacı göstergeleri

## Faz 2 — Hesaplar (3–6 hafta)

- [ ] Supabase auth (e-posta sihirli bağlantı)
- [ ] Üretimleri buluta kaydet (cihazlar arası senkron)
- [ ] Kredi sistemi sunucu tarafına taşı
- [ ] `supabase/schema.sql` canlıya al
- [ ] Blog altyapısı (`/blog`) + 4 makale

## Faz 3 — Ödeme (4–8 hafta, bürokrasiye bağlı)

- [ ] Şahıs şirketi kuruluşu
- [ ] iyzico / PayTR hesabı + abonelik
- [ ] Plan/kota zorlaması (free → ücretli)
- [ ] Faturalama akışı
- [ ] İade/mesafeli satış sözleşmesi

## Faz 4 — Ölçek (2–4 ay)

- [ ] Toplu üretim (CSV/Excel yükle → onlarca ürün)
- [ ] Trendyol / Hepsiburada resmi API entegrasyonu (scraping YOK)
- [ ] Görselden açıklama (vision)
- [ ] Marka sesi hafızası (ajanslar için)
- [ ] Ekip/seat yönetimi
- [ ] Genel API erişimi

---

## Kaçınılacaklar

- ❌ Pazaryerlerinden veri kazıma (ToS ihlali) — sadece resmi API veya manuel/CSV.
- ❌ OpenAI anahtarını istemciye (tarayıcıya) sızdırmak.
- ❌ Kullanıcının izni olmadan içerik uydurma (prompt bunu engelliyor).

## Ölçek notu

Bellek-içi hız sınırı tek sunucu içindir. Çok örnekli üretimde Upstash Redis'e taşınmalı.
Aynı şekilde kredi sayacı şu an tarayıcıda; Faz 2'de sunucuya (Supabase) alınmalı.
