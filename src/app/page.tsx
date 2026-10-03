import Link from "next/link";
import Navbar from "@/components/Navbar";
import Generator from "@/components/Generator";
import ProductPreview from "@/components/ProductPreview";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";

const STATS = [
  { value: "30 sn", label: "ortalama içerik süresi" },
  { value: "4", label: "pazaryeri formatı" },
  { value: "2", label: "ücretsiz üretim hakkı" },
  { value: "%0", label: "uydurma özellik" },
];

const FEATURES = [
  {
    span: "md:col-span-2",
    title: "Pazaryerine özel akıllı format",
    text: "Trendyol'un kısa başlığı, Amazon'un 5 maddesi, Shopify'ın marka anlatımı — her kanala uygun çıktı, tek tıkla.",
    icon: (
      <path
        d="M4 7h16M4 12h10M4 17h7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    ),
  },
  {
    span: "md:col-span-2",
    title: "SEO anahtar kelimeleri",
    text: "Ürününüzün aramada bulunmasını sağlayan, doğal dilde anahtar kelimeleri otomatik üretir.",
    icon: (
      <path
        d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.35-4.35"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    ),
  },
  {
    span: "md:col-span-2",
    title: "Uydurma yok, güven var",
    text: "Bilmediği bir teknik özelliği yazmaz. Vermediğiniz detay için güvenli ifade kullanır.",
    icon: (
      <path
        d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    ),
  },
  {
    span: "md:col-span-3",
    title: "4 farklı üslup, tek tıkla",
    text: "Profesyonel, samimi, premium veya genç & enerjik. Markanızın sesini seçin, içerik ona göre yazılsın.",
    icon: (
      <path
        d="M5 12h.01M12 12h.01M19 12h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    ),
  },
  {
    span: "md:col-span-3",
    title: "Kopyala, indir, yayınla",
    text: "Tek tıkla kopyala ya da CSV/TXT olarak indir. Excel'de Türkçe karakterler bozulmaz.",
    icon: (
      <path
        d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

const STEPS = [
  {
    n: "01",
    title: "Ürünü yaz",
    text: "Ürün adını, kategorisini ve bildiğiniz özellikleri girin. 30 saniye sürer.",
  },
  {
    n: "02",
    title: "Pazaryerini seç",
    text: "Trendyol, Hepsiburada, Amazon veya Shopify. Yapay zekâ formatı ona göre ayarlar.",
  },
  {
    n: "03",
    title: "Kopyala & sat",
    text: "Başlık, açıklama, özellik ve SEO kelimeleri hazır. Kopyalayın, ilanınıza yapıştırın.",
  },
];

// NOT: Aşağıdaki yorum kartları ÖRNEKTİR (placeholder). Lansmandan önce gerçek
// müşteri yorumlarınızla değiştirin.
const TESTIMONIALS = [
  {
    quote:
      "Bir ürün açıklamasına 40 dakika harcıyordum. Şimdi 3 başlık varyantını ve açıklamayı 30 saniyede önümde görüyorum.",
    name: "Burak K.",
    role: "Trendyol mağaza sahibi",
  },
  {
    quote:
      "Ajans olarak altı mağaza yönetiyoruz. İçerik üretimi artık darboğaz değil; ekip asıl işe odaklanıyor.",
    name: "Elif A.",
    role: "E-ticaret ajansı kurucusu",
  },
  {
    quote:
      "SEO kelimeleri sayesinde ürünlerimiz arama sonuçlarında daha görünür oldu. Basit ama etkili.",
    name: "Mert D.",
    role: "Butik satıcı",
  },
];

function Background() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
      <div className="absolute left-1/2 top-[-12%] h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-brand-600/25 blur-[130px]" />
      <div className="absolute right-[-8%] top-[18%] h-[380px] w-[380px] rounded-full bg-fuchsia-600/20 blur-[120px] animate-pulseGlow" />
      <div className="absolute bottom-[-6%] left-[-8%] h-[380px] w-[380px] rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute inset-0 bg-noise opacity-[0.15]" />
    </div>
  );
}

export default function Home() {
  return (
    <div id="top" className="relative">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden pb-10 pt-20 sm:pt-24">
        <Background />
        <div className="container-x">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto flex w-fit animate-fadeUp items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.8)]" />
              E-ticaret satıcıları için Türkçe yapay zekâ
            </div>

            <h1 className="mt-6 animate-fadeUp font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-white [animation-delay:80ms] sm:text-6xl lg:text-7xl">
              Ürün açıklamanı
              <br />
              <span className="text-gradient-brand">30 saniyede</span> yaz.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl animate-fadeUp text-lg leading-relaxed text-slate-400 [animation-delay:160ms]">
              Trendyol, Hepsiburada, Amazon ve Shopify için satışa hazır başlık,
              açıklama, özellik listesi ve SEO anahtar kelimeleri — tek tıkla,
              Türkçe ve uydurma olmadan.
            </p>

            <div className="mt-9 flex animate-fadeUp flex-wrap items-center justify-center gap-3 [animation-delay:240ms]">
              <Link href="#uretelim" className="btn-primary px-6 py-3 text-base">
                Ücretsiz Dene — 2 hak
              </Link>
              <Link href="#nasil" className="btn-ghost px-6 py-3 text-base">
                Nasıl çalışır?
              </Link>
            </div>

            <p className="mt-4 animate-fadeUp text-xs text-slate-500 [animation-delay:300ms]">
              Kredi kartı gerekmez · Kayıt gerekmez · Türkçe
            </p>
          </div>

          <ProductPreview />
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-white/5 bg-white/[0.015]">
        <div className="container-x grid grid-cols-2 divide-white/5 py-8 md:grid-cols-4 md:divide-x">
          {STATS.map((s) => (
            <div key={s.label} className="px-4 py-4 text-center">
              <p className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="ozellikler" className="container-x py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label">Neden Satly</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            İlanlarınızı <span className="text-gradient-brand">satışa</span> dönüştürün
          </h2>
          <p className="mt-4 text-slate-400">
            Saatler süren metin yazarlığını saniyelere indirin. Daha iyi SEO, daha
            hızlı yayın, daha az emek.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={`card group relative overflow-hidden transition hover:border-white/20 ${f.span}`}
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/10 blur-2xl transition group-hover:bg-brand-500/20" />
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-brand-300">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  {f.icon}
                </svg>
              </div>
              <h3 className="font-display text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="nasil" className="relative overflow-hidden border-y border-white/5 py-24">
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[700px] -translate-x-1/2 rounded-full bg-brand-600/10 blur-[120px]" />
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-label">Akış</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Üç adımda yayına hazır
            </h2>
          </div>

          <div className="relative mt-16 grid gap-8 md:grid-cols-3">
            <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block" />
            {STEPS.map((s) => (
              <div key={s.n} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-ink-900 font-display text-lg font-bold text-brand-300 shadow-[0_0_40px_-12px_rgba(139,92,246,0.8)]">
                  {s.n}
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-400">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE DEMO */}
      <section id="uretelim" className="container-x py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label">Canlı dene</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            İlk içeriğini <span className="text-gradient-brand">şimdi</span> üret
          </h2>
          <p className="mt-4 text-slate-400">
            Kayıt yok, kart yok. Ürün adını yaz, sonucu gör.
          </p>
        </div>
        <div className="mt-12">
          <Generator />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-y border-white/5 bg-white/[0.015] py-24">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-label">Satıcılar ne diyor?</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Zaman kazandırır, satışı <span className="text-gradient-brand">büyütür</span>
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="card flex flex-col">
                <div className="mb-4 text-brand-300" aria-hidden>
                  ★★★★★
                </div>
                <blockquote className="flex-1 text-sm leading-relaxed text-slate-300">
                  <span className="sr-only">Örnek yorum. </span>
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-white/5 pt-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-fuchsia-500 text-xs font-bold text-white">
                    {t.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">
                      {t.name}
                    </span>
                    <span className="block text-xs text-slate-500">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="fiyat" className="container-x py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label">Fiyatlandırma</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Basit, şeffaf, ölçeklenebilir
          </h2>
          <p className="mt-4 text-slate-400">
            Bir ürün açıklamasını ajansa yazdırmak ~100 ₺. Burada ~2 ₺.
          </p>
        </div>
        <div className="mt-12">
          <Pricing />
        </div>
      </section>

      {/* FAQ */}
      <section id="sss" className="border-t border-white/5 py-24">
        <div className="container-x">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="section-label">SSS</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Merak edilenler
            </h2>
          </div>
          <Faq />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container-x pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-brand-600/20 to-fuchsia-600/5 px-6 py-16 text-center">
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[700px] -translate-x-1/2 rounded-full bg-brand-500/25 blur-[120px]" />
          <h2 className="relative font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            İlk 2 üretiminiz ücretsiz.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-slate-300">
            Ürününüzü yazın, satışa hazır içeriği saniyeler içinde görün. Beğenmezseniz
            hiçbir şey ödemezsiniz.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link href="#uretelim" className="btn-primary px-6 py-3 text-base">
              Hemen Ücretsiz Dene
            </Link>
            <Link href="/araclar/baslik-uretici" className="btn-ghost px-6 py-3 text-base">
              Ücretsiz aracı aç
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-ink-950">
        <div className="container-x grid gap-10 py-14 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-fuchsia-500 text-sm font-bold text-white">
                S
              </span>
              <span className="font-display text-lg font-bold text-white">
                Sat<span className="text-brand-300">ly</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
              E-ticaret satıcıları için Türkçe yapay zekâ destekli ürün içeriği üreteci.
              Daha az yaz, daha çok sat.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Ürün</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-500">
              <li>
                <Link href="#ozellikler" className="hover:text-slate-300">
                  Özellikler
                </Link>
              </li>
              <li>
                <Link href="#fiyat" className="hover:text-slate-300">
                  Fiyatlar
                </Link>
              </li>
              <li>
                <Link href="/araclar/baslik-uretici" className="hover:text-slate-300">
                  Ücretsiz araç
                </Link>
              </li>
              <li>
                <Link href="/panel" className="hover:text-slate-300">
                  Panelim
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Kurumsal</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-500">
              <li>
                <Link href="#sss" className="hover:text-slate-300">
                  SSS
                </Link>
              </li>
              <li>
                <a href="/api/health" className="hover:text-slate-300">
                  Sistem durumu
                </a>
              </li>
              <li>
                <span className="cursor-default">Gizlilik (yakında)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5">
          <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-600 sm:flex-row">
            <p>© 2026 Satly · Tüm hakları saklıdır.</p>
            <p>Beta sürüm · Üretilen içerikleri yayınlamadan önce kontrol edin.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
