const KEYWORDS = ["bluetooth kulaklık", "anc kulaklık", "kablosuz kulaklık", "type-c"];

const TITLES = [
  "Anker Soundcore Kablosuz Bluetooth Kulaklık — Aktif Gürültü Engelleme",
  "ANC Bluetooth Kulaklık, 20 Saat Pil Ömrü, Type-C Şarj",
  "Kablosuz Kulaklık | Aktif Gürültü Engelleme + Şeffaf Mod",
];

export default function ProductPreview() {
  return (
    <div className="relative mx-auto mt-14 max-w-4xl">
      {/* Glow under the window */}
      <div className="pointer-events-none absolute inset-x-8 -top-6 bottom-0 -z-10 rounded-[2rem] bg-brand-600/25 blur-[80px]" />

      {/* Floating badges */}
      <div className="absolute -left-4 top-16 z-20 hidden animate-float sm:block">
        <div className="glass rounded-xl px-3 py-2 text-xs shadow-xl">
          <p className="font-semibold text-white">⚡ 30 saniye</p>
          <p className="text-slate-400">tek ürün içeriği</p>
        </div>
      </div>
      <div className="absolute -right-4 bottom-20 z-20 hidden animate-float [animation-delay:1.5s] sm:block">
        <div className="glass rounded-xl px-3 py-2 text-xs shadow-xl">
          <p className="font-semibold text-emerald-300">↑ Görünürlük</p>
          <p className="text-slate-400">SEO anahtar kelimeler</p>
        </div>
      </div>

      {/* Window */}
      <div className="glass glow-ring overflow-hidden rounded-2xl p-1.5">
        <div className="overflow-hidden rounded-[0.9rem] border border-white/10 bg-ink-900">
          {/* Top bar */}
          <div className="flex items-center gap-3 border-b border-white/5 bg-white/[0.02] px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            </div>
            <div className="mx-auto flex items-center gap-2 rounded-md border border-white/5 bg-black/30 px-3 py-1 text-[11px] text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              satly.app
            </div>
          </div>

          {/* Body */}
          <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-5">
            {/* Form */}
            <div className="md:col-span-2">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Ürün bilgileri
              </p>
              <div className="space-y-2.5">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-200">
                  Anker Soundcore Bluetooth Kulaklık
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-400">
                    Elektronik
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-300">
                    Trendyol
                    <span className="text-slate-500">▾</span>
                  </div>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-400">
                  20 saat pil, ANC, Type-C şarj
                </div>
                <div className="btn-primary w-full">
                  <span className="shimmer-text">İçerik Üret</span>
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="md:col-span-3">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Satışa hazır içerik
              </p>
              <div className="space-y-2.5">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                  <p className="mb-2 text-[11px] font-semibold text-brand-300">
                    Başlık varyantları
                  </p>
                  <div className="space-y-1.5">
                    {TITLES.map((t, i) => (
                      <p key={i} className="line-clamp-1 text-xs text-slate-300">
                        {t}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                  <p className="mb-2 text-[11px] font-semibold text-brand-300">
                    SEO anahtar kelimeler
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {KEYWORDS.map((k) => (
                      <span
                        key={k}
                        className="rounded-full border border-brand-400/20 bg-brand-500/15 px-2.5 py-1 text-[11px] text-brand-200"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-emerald-400/20 bg-emerald-500/10 px-3 py-2">
                  <span className="text-[11px] text-emerald-200">
                    Açıklama + özellik listesi hazır
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-300">
                    Kopyala ✓
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
