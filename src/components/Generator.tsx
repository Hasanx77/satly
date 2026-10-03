"use client";

import { useEffect, useState } from "react";
import { MARKETPLACES, TONES } from "@/lib/prompts";
import { FREE_QUOTA } from "@/lib/plans";
import type {
  GenerateResponse,
  GenerationResult,
  HistoryItem,
  Marketplace,
  Tone,
} from "@/lib/types";
import ResultCard from "./ResultCard";

const HISTORY_KEY = "satly_history_v1";
const USAGE_KEY = "satly_usage_v1";

export default function Generator() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [features, setFeatures] = useState("");
  const [marketplace, setMarketplace] = useState<Marketplace>("trendyol");
  const [tone, setTone] = useState<Tone>("profesyonel");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [mock, setMock] = useState(false);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [used, setUsed] = useState(0);

  useEffect(() => {
    try {
      const h = localStorage.getItem(HISTORY_KEY);
      if (h) setHistory(JSON.parse(h) as HistoryItem[]);
      const u = localStorage.getItem(USAGE_KEY);
      if (u) setUsed(Number(u) || 0);
    } catch {
      /* localStorage erişilemezse geç */
    }
  }, []);

  const remaining = Math.max(0, FREE_QUOTA - used);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, features, marketplace, tone }),
      });
      const data = (await res.json()) as GenerateResponse;

      if (!res.ok || !data.result) {
        throw new Error(data.error || "Üretim sırasında bir hata oluştu.");
      }

      setResult(data.result);
      setMock(Boolean(data.mock));

      const item: HistoryItem = {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : String(Date.now()),
        createdAt: new Date().toISOString(),
        input: { name, category, features, marketplace, tone },
        result: data.result,
      };
      const next = [item, ...history].slice(0, 20);
      setHistory(next);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));

      const nextUsed = used + 1;
      setUsed(nextUsed);
      localStorage.setItem(USAGE_KEY, String(nextUsed));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  }

  function loadHistory(item: HistoryItem) {
    setName(item.input.name);
    setCategory(item.input.category || "");
    setFeatures(item.input.features || "");
    setMarketplace(item.input.marketplace);
    setTone((item.input.tone as Tone) || "profesyonel");
    setResult(item.result);
    setMock(false);
    setError(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }

  return (
    <div id="uretelim" className="grid gap-8 lg:grid-cols-2">
      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="glass space-y-5 rounded-2xl p-6 shadow-[0_0_60px_-30px_rgba(139,92,246,0.9)]"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-white">
            Ürün bilgilerini gir
          </h3>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              remaining > 0
                ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                : "border-rose-400/20 bg-rose-500/10 text-rose-300"
            }`}
          >
            {remaining > 0
              ? `${remaining} ücretsiz üretim hakkı`
              : "Ücretsiz hak bitti"}
          </span>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Ürün adı *
          </label>
          <input
            className="input-base"
            aria-label="Ürün adı"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Örn: Kablosuz Bluetooth Kulaklık"
            maxLength={200}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Kategori
            </label>
            <input
              className="input-base"
              aria-label="Kategori"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Örn: Elektronik"
              maxLength={120}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Pazaryeri
            </label>
            <select
              className="input-base"
              aria-label="Pazaryeri"
              value={marketplace}
              onChange={(e) => setMarketplace(e.target.value as Marketplace)}
            >
              {MARKETPLACES.map((m) => (
                <option key={m.id} value={m.id} className="bg-ink-800">
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Özellikler (virgülle ayır)
          </label>
          <textarea
            className="input-base min-h-[96px]"
            aria-label="Özellikler"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            placeholder="Örn: 20 saat pil ömrü, aktif gürültü engelleme, Type-C şarj"
            maxLength={1000}
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Boş bırakırsan AI uydurma özellik eklemez, güvenli genel ifadeler kullanır.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Üslup
          </label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => setTone(t.id)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                  tone === t.id
                    ? "border-brand-400/50 bg-brand-500/20 text-brand-100"
                    : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary w-full py-3"
          disabled={loading || !name.trim()}
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Üretiliyor…
            </>
          ) : (
            "İçerik Üret"
          )}
        </button>

        {error && (
          <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-300">
            {error}
          </div>
        )}
      </form>

      {/* SONUÇ */}
      <div className="space-y-4">
        {result ? (
          <ResultCard result={result} mock={mock} />
        ) : (
          <div className="glass flex min-h-[360px] flex-col items-center justify-center rounded-2xl text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-2xl">
              📝
            </div>
            <p className="text-sm text-slate-400">
              Sonuçlar burada görünecek.
              <br />
              Soldaki formu doldur ve &ldquo;İçerik Üret&rdquo;e bas.
            </p>
          </div>
        )}

        {history.length > 0 && (
          <div className="glass rounded-2xl p-5">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-200">
                Geçmiş ({history.length})
              </h4>
              <button
                type="button"
                onClick={clearHistory}
                className="text-xs font-medium text-slate-500 transition hover:text-rose-400"
              >
                Temizle
              </button>
            </div>
            <ul className="space-y-2">
              {history.slice(0, 5).map((h) => (
                <li key={h.id}>
                  <button
                    type="button"
                    onClick={() => loadHistory(h)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2.5 text-left text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/[0.05]"
                  >
                    <span className="font-medium text-slate-100">{h.input.name}</span>
                    <span className="ml-2 text-xs text-slate-500">
                      {h.input.marketplace}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
