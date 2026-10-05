"use client";

import { useEffect, useRef, useState } from "react";
import { LANGUAGES, MARKETPLACES, TONES } from "@/lib/prompts";
import { FEATURE_SUGGESTIONS, SECTORS } from "@/lib/sectors";
import { FREE_QUOTA } from "@/lib/plans";
import type {
  BrandVoice,
  GenerateResponse,
  GenerationResult,
  HistoryItem,
  Language,
  Marketplace,
  Sector,
  Tone,
} from "@/lib/types";
import ResultCard from "./ResultCard";

const HISTORY_KEY = "satly_history_v1";
const USAGE_KEY = "satly_usage_v1";
const BRAND_KEY = "satly_brand_v1";

const EXAMPLES = [
  { name: "Kablosuz Bluetooth Kulaklık", category: "Elektronik", features: "20 saat pil, ANC, Type-C şarj" },
  { name: "Kaymaz Yoga Matı", category: "Spor", features: "6 mm kalınlık, taşıma askısı" },
  { name: "Seramik Kahve Kupası", category: "Mutfak", features: "350 ml, bulaşık makinesi uyumlu" },
];

function brandHasData(b: BrandVoice): boolean {
  return Boolean(b.name || b.toneNote || b.keywords || b.avoid);
}

async function downscaleImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const maxDim = 1024;
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas yok");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();
  return canvas.toDataURL("image/jpeg", 0.82);
}

export default function Generator() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [features, setFeatures] = useState("");
  const [marketplace, setMarketplace] = useState<Marketplace>("trendyol");
  const [tone, setTone] = useState<Tone>("profesyonel");
  const [language, setLanguage] = useState<Language>("tr");
  const [sector, setSector] = useState<Sector>("genel");
  const [brand, setBrand] = useState<BrandVoice>({});

  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [imageBusy, setImageBusy] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [mock, setMock] = useState(false);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [used, setUsed] = useState(0);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const h = localStorage.getItem(HISTORY_KEY);
      if (h) setHistory(JSON.parse(h) as HistoryItem[]);
      const u = localStorage.getItem(USAGE_KEY);
      if (u) setUsed(Number(u) || 0);
      const b = localStorage.getItem(BRAND_KEY);
      if (b) setBrand(JSON.parse(b) as BrandVoice);
    } catch {

    }
  }, []);

  const remaining = Math.max(0, FREE_QUOTA - used);

  function updateBrand(patch: Partial<BrandVoice>) {
    const next = { ...brand, ...patch };
    setBrand(next);
    try {
      localStorage.setItem(BRAND_KEY, JSON.stringify(next));
    } catch {

    }
  }

  function addSuggestion(s: string) {
    setFeatures((prev) => {
      const parts = prev.split(",").map((p) => p.trim()).filter(Boolean);
      if (parts.some((p) => p.toLowerCase() === s.toLowerCase())) return prev;
      return [...parts, s].join(", ");
    });
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Lütfen bir görsel dosyası seçin (JPG/PNG).");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setError("Görsel çok büyük (en fazla 12 MB).");
      return;
    }
    try {
      setImageBusy(true);
      setError(null);
      const dataUrl = await downscaleImage(file);
      setImage(dataUrl);
      setImageName(file.name);
    } catch {
      setError("Görsel işlenemedi. Başka bir dosya deneyin.");
    } finally {
      setImageBusy(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload: Record<string, unknown> = {
        name,
        category,
        features,
        marketplace,
        tone,
        language,
        sector,
      };
      if (brandHasData(brand)) payload.brand = brand;
      if (image) payload.image = image;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        input: { name, category, features, marketplace, tone, language, sector },
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

  function handleFormKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.requestSubmit();
    }
  }

  function applyExample(ex: (typeof EXAMPLES)[number]) {
    setName(ex.name);
    setCategory(ex.category);
    setFeatures(ex.features);
  }

  function loadHistory(item: HistoryItem) {
    setName(item.input.name);
    setCategory(item.input.category || "");
    setFeatures(item.input.features || "");
    setMarketplace(item.input.marketplace);
    setTone((item.input.tone as Tone) || "profesyonel");
    if (item.input.language) setLanguage(item.input.language);
    if (item.input.sector) setSector(item.input.sector);
    setResult(item.result);
    setMock(false);
    setError(null);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }

  return (
    <div id="uretelim" className="grid gap-8 lg:grid-cols-2">
      {}
      <form
        onSubmit={handleSubmit}
        onKeyDown={handleFormKeyDown}
        className="glass space-y-5 rounded-2xl p-6 shadow-[0_0_60px_-30px_rgba(139,92,246,0.9)]"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-white">Ürün bilgilerini gir</h3>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              remaining > 0
                ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                : "border-rose-400/20 bg-rose-500/10 text-rose-300"
            }`}
          >
            {remaining > 0 ? `${remaining} ücretsiz üretim hakkı` : "Ücretsiz hak bitti"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500">Örnek doldur:</span>
          {EXAMPLES.map((ex) => (
            <button
              type="button"
              key={ex.name}
              onClick={() => applyExample(ex)}
              className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-slate-300 transition hover:border-brand-400/40 hover:text-white"
            >
              {ex.name}
            </button>
          ))}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Ürün adı *</label>
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
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Kategori</label>
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
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Sektör</label>
            <select
              className="input-base"
              aria-label="Sektör"
              value={sector}
              onChange={(e) => setSector(e.target.value as Sector)}
            >
              {SECTORS.map((s) => (
                <option key={s.id} value={s.id} className="bg-ink-800">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Pazaryeri</label>
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
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Çıktı dili</label>
            <select
              className="input-base"
              aria-label="Çıktı dili"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
            >
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id} className="bg-ink-800">
                  {l.flag} {l.label}
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
            className="input-base min-h-[84px]"
            aria-label="Özellikler"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            placeholder="Örn: 20 saat pil ömrü, aktif gürültü engelleme, Type-C şarj"
            maxLength={1000}
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="text-xs text-slate-500">Hızlı ekle:</span>
            {(FEATURE_SUGGESTIONS[sector] || []).map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => addSuggestion(s)}
                className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-xs text-slate-400 transition hover:border-brand-400/40 hover:text-slate-100"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Ürün görseli{" "}
            <span className="font-normal text-slate-500">(isteğe bağlı · yapay zekâ analiz eder)</span>
          </label>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          {image ? (
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
              {}
              <img src={image} alt="Ürün görseli" className="h-14 w-14 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-slate-200">{imageName || "görsel"}</p>
                <p className="text-xs text-slate-500">Analiz edilecek</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setImageName("");
                }}
                className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-slate-300 transition hover:border-rose-400/40 hover:text-rose-300"
              >
                Kaldır
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={imageBusy}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-4 text-sm text-slate-400 transition hover:border-brand-400/40 hover:text-slate-200 disabled:opacity-60"
            >
              {imageBusy ? "Görsel işleniyor…" : "📷 Görsel yükle (JPG/PNG)"}
            </button>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Üslup</label>
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

        {}
        <details className="rounded-xl border border-white/10 bg-white/[0.02]">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-slate-300">
            🎙️ Marka Sesi{" "}
            <span className="text-xs font-normal text-slate-500">
              {brandHasData(brand) ? "· kayıtlı" : "(isteğe bağlı)"}
            </span>
          </summary>
          <div className="space-y-3 border-t border-white/5 px-4 py-3">
            <p className="text-xs text-slate-500">
              Markanızın sesini bir kez tanımlayın; tüm üretimlerde otomatik uygulanır.
            </p>
            <input
              className="input-base"
              placeholder="Marka adı (örn. Aurora)"
              value={brand.name || ""}
              onChange={(e) => updateBrand({ name: e.target.value })}
            />
            <input
              className="input-base"
              placeholder="Ton notu (örn. sıcak ama profesyonel, abartısız)"
              value={brand.toneNote || ""}
              onChange={(e) => updateBrand({ toneNote: e.target.value })}
            />
            <input
              className="input-base"
              placeholder="Mutlaka kullanılacak kelimeler (örn. el yapımı, %100 doğal)"
              value={brand.keywords || ""}
              onChange={(e) => updateBrand({ keywords: e.target.value })}
            />
            <input
              className="input-base"
              placeholder="Kaçınılacak ifadeler (örn. ucuz, indirim, garanti)"
              value={brand.avoid || ""}
              onChange={(e) => updateBrand({ avoid: e.target.value })}
            />
          </div>
        </details>

        <button type="submit" className="btn-primary w-full py-3" disabled={loading || !name.trim()}>
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Üretiliyor…
            </>
          ) : (
            "İçerik Üret"
          )}
        </button>
        <p className="text-center text-[11px] text-slate-500">
          İpucu: <kbd className="rounded border border-white/10 bg-white/[0.05] px-1">Ctrl</kbd> +{" "}
          <kbd className="rounded border border-white/10 bg-white/[0.05] px-1">Enter</kbd> ile hızlı üret
        </p>

        {error && (
          <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-300">
            {error}
          </div>
        )}
      </form>

      {}
      <div className="space-y-4">
        {result ? (
          <ResultCard result={result} mock={mock} marketplace={marketplace} />
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
              <h4 className="text-sm font-semibold text-slate-200">Geçmiş ({history.length})</h4>
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
                      {h.input.language && h.input.language !== "tr" ? ` · ${h.input.language.toUpperCase()}` : ""}
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
