"use client";

import { useState } from "react";
import { PLANS } from "@/lib/plans";

export default function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <div>
      {/* Toggle */}
      <div className="mx-auto mb-10 flex w-fit items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
        <button
          type="button"
          onClick={() => setYearly(false)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            !yearly ? "bg-white text-ink-900" : "text-slate-400 hover:text-white"
          }`}
        >
          Aylık
        </button>
        <button
          type="button"
          onClick={() => setYearly(true)}
          className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition ${
            yearly ? "bg-white text-ink-900" : "text-slate-400 hover:text-white"
          }`}
        >
          Yıllık
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
            %20 indirim
          </span>
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((p) => {
          const price = p.price === 0 ? 0 : yearly ? Math.round(p.price * 0.8) : p.price;
          const isHighlight = p.highlight;
          return (
            <div
              key={p.id}
              className={`relative flex flex-col rounded-2xl border p-6 transition ${
                isHighlight
                  ? "border-brand-400/40 bg-gradient-to-b from-brand-500/[0.14] to-white/[0.02] shadow-[0_0_60px_-24px_rgba(139,92,246,0.9)]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              }`}
            >
              {isHighlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 px-3 py-1 text-[11px] font-semibold text-white shadow-lg">
                  En çok tercih edilen
                </span>
              )}

              <h3 className="font-display text-lg font-bold text-white">{p.name}</h3>
              <p className="mt-1 text-xs text-brand-300">{p.quota}</p>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-4xl font-extrabold tracking-tight text-white">
                  {price === 0 ? "0" : price.toLocaleString("tr-TR")}
                </span>
                <span className="text-lg font-semibold text-slate-400">₺</span>
                <span className="text-sm text-slate-500">
                  {p.price === 0 ? "" : yearly ? "/ay · yıllık" : "/ay"}
                </span>
              </div>

              <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-300">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-[10px] text-brand-300">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#uretelim"
                className={isHighlight ? "btn-primary mt-6 w-full" : "btn-ghost mt-6 w-full"}
              >
                {p.price === 0 ? "Ücretsiz Başla" : "Planı Seç"}
              </a>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-slate-500">
        Kart bilgisi şimdilik alınmıyor — beta aşamasındayız. İlk 5 üretim her zaman ücretsiz.
      </p>
    </div>
  );
}
