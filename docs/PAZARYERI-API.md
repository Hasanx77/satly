# PAZARYERİ API ENTEGRASYON PLANI

> Durum: **PLANLANDI (henüz uygulanmadı).** Rakiplerin (Sopyo, Qsup, Celer) en güçlü
> farkı budur: ürünü kopyala-yapıştır yerine **doğrudan mağazaya yazmak**.

## Neden kritik?
Kopyala-yapıştır "yardımcı araç"tır; API entegrasyonu **iş akışının parçası** olur ve
müşteriyi bağlar (churn'ü düşürür). Satın alma sebebi yaratır.

## Kapsam (fazlar)
1. **Okuma:** Satıcının mevcut ürünlerini çek → eksik açıklamaları toplu zenginleştir.
2. **Yazma:** Üretilen başlık/açıklama/özellikleri ürüne geri yaz (güncelle).
3. **Toplu işlem:** Tüm katalog için toplu zenginleştirme + fiyat kuralları.

## Ön koşullar (kullanıcıdan)
- Satıcının **Trendyol API key + secret + supplierId** (Satıcı Paneli → Entegrasyon).
- (Opsiyonel) Hepsiburada (merchantId + API bilgileri).
- Sunucu tarafı güvenli saklama (Supabase şifreli alan veya env) — **asla git'e girmez**.

## Trendyol API (özet)
- **Ürün çekme:** `GET /integration/product/sellers/{sellerId}/products` (sayfalı).
- **Ürün güncelleme:** `POST/PUT /integration/product/sellers/{sellerId}/products` (batch).
- **Kategori özellikleri:** `GET /integration/product/product-categories/{categoryId}/attributes`.
- Kimlik doğrulama: HTTP Basic (apiKey:apiSecret), Trendyol'a özel `User-Agent` zorunlu.
- Rate limit vardır; toplu işlemlerde kuyruk (queue) gerekir.

## Teknik tasarım (taslak)
```
src/lib/marketplace/
  types.ts          # MarketplaceClient arayüzü
  trendyol.ts       # TrendyolClient (getProducts, updateProduct, getAttributes)
  hepsiburada.ts    # (opsiyonel) HepsiburadaClient
  index.ts          # getClient(marketplace, credentials)
```
- İstemci tarafı asla API anahtarı görmez; yalnızca sunucu (API route) kullanır.
- `POST /api/marketplace/sync` → ürünleri çeker, üretir, geri yazar (kuyruklu, işlenir).
- Hata yönetimi + loglanabilir işlem geçmişi.

## Yasal / dikkat
- **Scraping YASAK.** Yalnızca resmi API + kullanıcının kendi verisi kullanılır.
- API sözleşmeleri ve Trendyol satıcı kurallarına uyum zorunlu.

## Yol haritası
1. Credentials ayarları ekranı (yerel test).
2. TrendyolClient + ürün çekme (salt okuma) + demo veriyle doğrulama.
3. Üretilen içeriği kullanıcı onayıyla geri yazma.
4. Hepsiburada ekleme.
5. Kuyruk + toplu işlem + işlem geçmişi.
