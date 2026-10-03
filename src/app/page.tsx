import Navbar from "@/components/Navbar";
import Generator from "@/components/Generator";
import { PLANS } from "@/lib/plans";

const STEPS = [
  {
    icon: "1",
    title: "Ürünü yaz",
    text: "Ürün adını, kategorisini ve bilinen özelliklerini gir.",
  },
  {
    icon: "2",
    title: "Pazaryerini seç",
    text: "Trendyol, Hepsiburada, Amazon veya Shopify formatına göre üretim.",
  },
  {
    icon: "3",
    title: "Kopyala & yayınla",
    text: "Başlık, açıklama ve SEO kelimelerini kopyala, ilanına yapıştır.",
  },
];

const BENEFITS = [
  { icon: "⏱️", title: "Saatler değil saniyeler", text: "Tek ürün içeriği ~30 saniyede hazır." },
  { icon: "🔍", title: "SEO optimizasyonu", text: "Pazaryeri aramasında bulunmanı sağlayan anahtar kelimeler." },
  { icon: "🇹🇷", title: "Türkçe'ye özel", text: "Yabancı araçların yapamadığı doğal Türkçe metin." },
  { icon: "🛡️", title: "Uydurma yok", text: "AI bilmediği özelliği uydurmaz; güvenli ifade kullanır." },
];

export default function Home() {
  return (
    <div id="top">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-50 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-16 text-center">
          <span className="inline-block rounded-full bg-brand-100 px-4 py-1 text-xs font-semibold text-brand-700">
            E-ticaret satıcıları için Türkçe yapay zekâ
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Ürün açıklamanı <span className="text-brand-600">30 saniyede</span> yaz
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Ürün adını yaz; satışa hazır başlık, açıklama, özellik listesi ve SEO
            anahtar kelimelerini al. Trendyol, Hepsiburada, Amazon ve Shopify için.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#uretelim" className="btn-primary text-base">
              Ücretsiz Dene — 5 hak
            </a>
            <a href="#fiyat" className="btn-ghost text-base">
              Fiyatları Gör
            </a>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Kredi kartı gerekmez · Kayıt gerekmez
          </p>
        </div>
      </section>

      {/* GENERATOR */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <Generator />
      </section>

      {/* NASIL ÇALIŞIR */}
      <section id="nasil" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-slate-900">Nasıl çalışır?</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.title} className="card text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 font-bold text-white">
                {s.icon}
              </div>
              <h3 className="font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAYDALAR */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold text-slate-900">
            Neden SatıcıAsistan?
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b) => (
              <div key={b.title} className="card">
                <div className="mb-2 text-2xl">{b.icon}</div>
                <h3 className="font-semibold text-slate-900">{b.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FİYATLAR */}
      <section id="fiyat" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-slate-900">
          Basit, şeffaf fiyatlandırma
        </h2>
        <p className="mt-2 text-center text-slate-600">
          Bir ürün açıklamasını ajansa yazdırmak ~100 ₺. Burada ~2 ₺.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={`card flex flex-col ${
                p.highlight ? "ring-2 ring-brand-500" : ""
              }`}
            >
              {p.highlight && (
                <span className="mb-2 w-fit rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                  Popüler
                </span>
              )}
              <h3 className="font-semibold text-slate-900">{p.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900">
                  {p.price === 0 ? "0" : p.price.toLocaleString("tr-TR")} ₺
                </span>
                <span className="text-sm text-slate-500">{p.period}</span>
              </div>
              <p className="mt-1 text-sm text-brand-700">{p.quota}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-600">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-emerald-500">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={p.highlight ? "btn-primary mt-5 w-full" : "btn-ghost mt-5 w-full"}
              >
                {p.price === 0 ? "Ücretsiz Başla" : "Planı Seç"}
              </button>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
          * Ödeme altyapısı henüz devrede değil. Şu an ürün doğrulama (beta) aşamasındadır.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-slate-500">
          <p className="font-semibold text-slate-700">
            Satıcı<span className="text-brand-600">Asistan</span>
          </p>
          <p className="mt-2">
            E-ticaret satıcıları için Türkçe AI içerik üreteci · 2026
          </p>
          <p className="mt-2 text-xs">
            Bu ürün beta aşamasındadır. Üretilen içerikleri yayınlamadan önce kontrol edin.
          </p>
        </div>
      </footer>
    </div>
  );
}
