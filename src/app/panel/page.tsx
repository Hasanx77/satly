"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FREE_QUOTA } from "@/lib/plans";
import type { HistoryItem } from "@/lib/types";

const HISTORY_KEY = "satly_history_v1";
const USAGE_KEY = "satly_usage_v1";

function csvEscape(v: string): string {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function PanelPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [used, setUsed] = useState(0);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    try {
      const h = localStorage.getItem(HISTORY_KEY);
      if (h) setHistory(JSON.parse(h) as HistoryItem[]);
      const u = localStorage.getItem(USAGE_KEY);
      if (u) setUsed(Number(u) || 0);
    } catch {

    }
    setReady(true);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return history;
    return history.filter(
      (h) =>
        h.input.name.toLowerCase().includes(q) ||
        (h.input.category || "").toLowerCase().includes(q)
    );
  }, [history, query]);

  function clearAll() {
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(USAGE_KEY);
    setHistory([]);
    setUsed(0);
  }

  function exportCsv() {
    const header = "Tarih,Urun,Pazaryeri,Dil,Baslik\n";
    const body = history
      .map((h) =>
        [
          new Date(h.createdAt).toLocaleString("tr-TR"),
          h.input.name,
          h.input.marketplace,
          h.input.language || "tr",
          h.result.titleOptions[0] ?? "",
        ]
          .map(csvEscape)
          .join(",")
      )
      .join("\n");
    download("satly-gecmis.csv", "\uFEFF" + header + body, "text/csv;charset=utf-8");
  }

  function exportJson() {
    download("satly-gecmis.json", JSON.stringify(history, null, 2), "application/json");
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {

    }
  }

  const remaining = Math.max(0, FREE_QUOTA - used);

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="container-x py-12">
        <div className="mb-8">
          <p className="section-label">Hesabım</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white">
            Panelim
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Kullanımınız ve ürettiğiniz içeriklerin geçmişi.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="card">
            <p className="text-sm text-slate-400">Bu ay kullanılan</p>
            <p className="mt-1 font-display text-4xl font-extrabold text-white">{used}</p>
          </div>
          <div className="card">
            <p className="text-sm text-slate-400">Kalan ücretsiz hak</p>
            <p className="mt-1 font-display text-4xl font-extrabold text-brand-300">{remaining}</p>
          </div>
          <div className="card">
            <p className="text-sm text-slate-400">Kayıtlı içerik</p>
            <p className="mt-1 font-display text-4xl font-extrabold text-white">{history.length}</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-brand-400/20 bg-brand-500/10 px-5 py-4 text-sm text-brand-100">
          🔒 Verileriniz şu an yalnızca <b>bu tarayıcıda</b> (yerel) saklanıyor. Bulut
          hesap/abonelik özelliği yakında eklenecek. Ekip/cihaz senkronizasyonu için Supabase
          entegrasyonu hazır — <code className="text-brand-200">supabase/schema.sql</code>.
        </div>

        <div className="mt-10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold text-white">Geçmiş içerikler</h2>
            <div className="flex flex-wrap items-center gap-2">
              <input
                className="input-base w-48 py-1.5"
                placeholder="Ara…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Geçmişte ara"
              />
              {history.length > 0 && (
                <>
                  <button type="button" onClick={exportCsv} className="btn-ghost py-1.5 text-xs">
                    ⬇ CSV
                  </button>
                  <button type="button" onClick={exportJson} className="btn-ghost py-1.5 text-xs">
                    ⬇ JSON
                  </button>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-sm font-medium text-rose-400 transition hover:text-rose-300"
                  >
                    Tümünü sil
                  </button>
                </>
              )}
            </div>
          </div>

          {!ready ? (
            <p className="text-sm text-slate-500">Yükleniyor…</p>
          ) : filtered.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center text-slate-400">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xl">
                📝
              </div>
              <p className="text-sm">
                {history.length === 0 ? (
                  <>
                    Henüz içerik üretmediniz.{" "}
                    <Link href="/#uretelim" className="text-brand-300 hover:underline">
                      İlk içeriğinizi üretin
                    </Link>
                    .
                  </>
                ) : (
                  "Aramanızla eşleşen içerik yok."
                )}
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {filtered.map((h) => (
                <li key={h.id} className="card">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{h.input.name}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {h.input.marketplace}
                        {h.input.language === "en" ? " · EN" : ""} ·{" "}
                        {new Date(h.createdAt).toLocaleString("tr-TR")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copy(h.result.titleOptions.join("\n"))}
                      className="text-xs font-medium text-brand-300 transition hover:text-brand-200"
                    >
                      Başlıkları kopyala
                    </button>
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-slate-300">
                    <p className="font-medium text-slate-100">{h.result.titleOptions[0]}</p>
                    <p className="line-clamp-2 text-slate-400">{h.result.shortDescription}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
