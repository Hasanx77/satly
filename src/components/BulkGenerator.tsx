"use client";

import { useRef, useState } from "react";
import { LANGUAGES, MARKETPLACES, TONES } from "@/lib/prompts";
import type { GenerationResult, Language, Marketplace, Tone } from "@/lib/types";

interface BulkRow {
  name: string;
  result?: GenerationResult;
  error?: string;
}

const MAX_ITEMS = 25;

function csvEscape(v: string): string {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

export default function BulkGenerator() {
  const [text, setText] = useState("");
  const [marketplace, setMarketplace] = useState<Marketplace>("trendyol");
  const [tone, setTone] = useState<Tone>("profesyonel");
  const [language, setLanguage] = useState<Language>("tr");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<BulkRow[]>([]);
  const [mock, setMock] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const raw = await file.text();
    const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const start = /^(urun|ürün|name|ad|başlık|baslik|product|title)/i.test(lines[0] || "") ? 1 : 0;
    const formatted = lines
      .slice(start)
      .map((line) => (line.includes("|") ? line : line.split(/[\t;]/).map((s) => s.trim()).join(" | ")))
      .slice(0, MAX_ITEMS)
      .join("\n");
    setText(formatted);
  }

  const parsedCount = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean).length;

  async function handleGenerate() {
    if (loading) return;
    const items = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, MAX_ITEMS)
      .map((line) => {
        const [name, category, features] = line.split("|").map((s) => s.trim());
        return { name, category: category || "", features: features || "", marketplace, tone, language };
      })
      .filter((i) => i.name && i.name.length >= 2);

    if (items.length === 0) {
      setError("En az bir ürün adı girin.");
      return;
    }

    setLoading(true);
    setError(null);
    setRows([]);

    try {
      const res = await fetch("/api/generate-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Toplu üretim başarısız.");
      setRows(data.rows as BulkRow[]);
      setMock(Boolean(data.mock));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  }

  function downloadCsv() {
    const header = "Urun,Baslik 1,Baslik 2,Baslik 3,Kisa Aciklama,Anahtar Kelimeler,Durum\n";
    const body = rows
      .map((r) => {
        const t = r.result?.titleOptions ?? [];
        return [
          r.name,
          t[0] ?? "",
          t[1] ?? "",
          t[2] ?? "",
          r.result?.shortDescription ?? "",
          r.result?.keywords?.join(", ") ?? "",
          r.error ? "HATA: " + r.error : "OK",
        ]
          .map(csvEscape)
          .join(",");
      })
      .join("\n");
    const blob = new Blob(["\uFEFF" + header + body], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "toplu-icerik.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {

    }
  }

  const okCount = rows.filter((r) => r.result).length;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {}
      <div className="glass space-y-5 rounded-2xl p-6">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">Ürün listesi</h3>
          <p className="mt-1 text-sm text-slate-400">
            Her satıra bir ürün yaz. İstersen <code className="text-brand-300">Ad | Kategori | Özellikler</code>{" "}
            biçiminde ayır. (En fazla {MAX_ITEMS} ürün)
          </p>
        </div>

        <textarea
          aria-label="Ürün listesi"
          className="input-base min-h-[200px] font-mono text-xs"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"Kablosuz Bluetooth Kulaklık | Elektronik | ANC, 20 saat pil\nKaymaz Yoga Matı | Spor | 6 mm kalınlık\nSeramik Kahve Kupası | Mutfak | 350 ml"}
        />
        <p className="text-xs text-slate-500">
          {parsedCount} satır algılandı · en fazla {MAX_ITEMS} işlenir.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.txt,text/csv,text/plain"
            onChange={handleFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-xs font-medium text-brand-300 transition hover:text-brand-200"
          >
            ⬆ CSV/TXT dosyasından yükle
          </button>
          <span className="text-xs text-slate-600">
            (sütunlar: ürün; kategori; özellikler)
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Pazaryeri</label>
            <select
              className="input-base"
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
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Dil</label>
            <select
              className="input-base"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
            >
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id} className="bg-ink-800">
                  {l.label}
                </option>
              ))}
            </select>
          </div>
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

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || parsedCount === 0}
          className="btn-primary w-full py-3"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Üretiliyor… (bu biraz sürebilir)
            </>
          ) : (
            `Toplu Üret (${Math.min(parsedCount, MAX_ITEMS)})`
          )}
        </button>

        {error && (
          <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-300">
            {error}
          </div>
        )}
      </div>

      {}
      <div className="space-y-4">
        {rows.length === 0 ? (
          <div className="glass flex min-h-[360px] flex-col items-center justify-center rounded-2xl text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-2xl">
              🗂️
            </div>
            <p className="text-sm text-slate-400">
              Ürün listesini gir ve &ldquo;Toplu Üret&rdquo;e bas.
              <br />
              Sonuçlar burada tablo halinde çıkacak.
            </p>
          </div>
        ) : (
          <>
            {mock && (
              <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-200">
                Demo modu: örnek çıktılar gösteriliyor.
              </div>
            )}
            <div className="glass rounded-2xl p-5">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-200">
                  Sonuçlar ({okCount}/{rows.length})
                </h4>
                <button
                  type="button"
                  onClick={downloadCsv}
                  className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-slate-300 transition hover:bg-white/[0.07]"
                >
                  ⬇ CSV indir
                </button>
              </div>
              <ul className="space-y-2">
                {rows.map((r, i) => (
                  <li key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{r.name}</p>
                        {r.error ? (
                          <p className="text-xs text-rose-300">Hata: {r.error}</p>
                        ) : (
                          <p className="mt-1 text-xs text-slate-300">{r.result?.titleOptions?.[0]}</p>
                        )}
                      </div>
                      {r.result && (
                        <button
                          type="button"
                          onClick={() => copy((r.result?.titleOptions ?? []).join("\n"))}
                          className="shrink-0 rounded-md border border-white/10 px-2.5 py-1 text-xs text-slate-300 transition hover:bg-white/[0.07]"
                        >
                          Kopyala
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
