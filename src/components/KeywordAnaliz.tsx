"use client";

import { useState } from "react";
import { analyzeKeywords, type KeywordAnalysis } from "@/lib/analysis";

export default function KeywordAnaliz() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<KeywordAnalysis | null>(null);

  function analyze() {
    if (!text.trim()) return;
    setResult(analyzeKeywords(text));
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {

    }
  }

  const allKeywords = result
    ? [...result.phrases.map((p) => p.term), ...result.words.map((w) => w.term)].join(", ")
    : "";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="glass space-y-4 rounded-2xl p-6">
        <h3 className="font-display text-lg font-semibold text-white">Metni yapıştır</h3>
        <p className="text-sm text-slate-400">
          Rakip ürün başlıklarını veya açıklamalarını yapıştırın; en sık geçen kelimeleri ve
          ikili ifadeleri çıkaralım.
        </p>
        <textarea
          aria-label="Analiz edilecek metin"
          className="input-base min-h-[240px]"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Rakip ürün başlıklarını buraya yapıştırın (her satıra bir başlık)…"
        />
        <button type="button" onClick={analyze} disabled={!text.trim()} className="btn-primary w-full py-3">
          Analiz Et
        </button>
      </div>

      <div className="space-y-4">
        {!result ? (
          <div className="glass flex min-h-[300px] flex-col items-center justify-center rounded-2xl text-center">
            <div className="mb-3 text-3xl">🔍</div>
            <p className="text-sm text-slate-400">Sonuçlar burada görünecek.</p>
          </div>
        ) : (
          <>
            <div className="glass rounded-2xl p-5">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-200">
                  Anahtar Kelimeler ({result.totalWords} kelime tarandı)
                </h4>
                <button
                  type="button"
                  onClick={() => copy(allKeywords)}
                  className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/[0.07]"
                >
                  Tümünü kopyala
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.words.map((w) => (
                  <span
                    key={w.term}
                    className="rounded-full border border-brand-400/20 bg-brand-500/15 px-2.5 py-1 text-xs text-brand-100"
                  >
                    {w.term} <span className="text-brand-300/70">×{w.count}</span>
                  </span>
                ))}
                {result.words.length === 0 && (
                  <p className="text-sm text-slate-500">Yeterli kelime bulunamadı.</p>
                )}
              </div>
            </div>

            {result.phrases.length > 0 && (
              <div className="glass rounded-2xl p-5">
                <h4 className="mb-3 text-sm font-semibold text-slate-200">İkili İfadeler (öneri)</h4>
                <ul className="space-y-1.5">
                  {result.phrases.map((p) => (
                    <li key={p.term} className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{p.term}</span>
                      <span className="text-xs text-slate-500">×{p.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
