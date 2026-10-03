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

const HISTORY_KEY = "sa_history_v1";
const USAGE_KEY = "sa_usage_v1";

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
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Ürün bilgilerini gir</h3>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              remaining > 0
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {remaining > 0
              ? `${remaining} ücretsiz üretim hakkı`
              : "Ücretsiz hak bitti"}
          </span>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Ürün adı *
          </label>
          <input
            className="input-base"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Örn: Kablosuz Bluetooth Kulaklık"
            maxLength={200}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Kategori
            </label>
            <input
              className="input-base"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Örn: Elektronik"
              maxLength={120}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Pazaryeri
            </label>
            <select
              className="input-base"
              value={marketplace}
              onChange={(e) => setMarketplace(e.target.value as Marketplace)}
            >
              {MARKETPLACES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Özellikler (virgülle ayır)
          </label>
          <textarea
            className="input-base min-h-[90px]"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            placeholder="Örn: 20 saat pil ömrü, aktif gürültü engelleme, Type-C şarj"
            maxLength={1000}
          />
          <p className="mt-1 text-xs text-slate-500">
            Boş bırakırsan AI uydurma özellik eklemez, güvenli genel ifadeler kullanır.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Üslup
          </label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => setTone(t.id)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  tone === t.id
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading || !name.trim()}>
          {loading ? "Üretiliyor..." : "İçerik Üret"}
        </button>

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}
      </form>

      {/* SONUÇ */}
      <div className="space-y-4">
        {result ? (
          <ResultCard result={result} mock={mock} />
        ) : (
          <div className="card flex min-h-[300px] flex-col items-center justify-center text-center text-slate-400">
            <div className="mb-3 text-4xl">📝</div>
            <p className="text-sm">
              Sonuçlar burada görünecek.
              <br />
              Soldaki formu doldur ve &ldquo;İçerik Üret&rdquo;e bas.
            </p>
          </div>
        )}

        {history.length > 0 && (
          <div className="card">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-800">
                Geçmiş ({history.length})
              </h4>
              <button
                type="button"
                onClick={clearHistory}
                className="text-xs font-medium text-slate-500 hover:text-rose-600"
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
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <span className="font-medium">{h.input.name}</span>
                    <span className="ml-2 text-xs text-slate-400">
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
