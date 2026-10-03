"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FREE_QUOTA } from "@/lib/plans";
import type { HistoryItem } from "@/lib/types";

const HISTORY_KEY = "sa_history_v1";
const USAGE_KEY = "sa_usage_v1";

export default function PanelPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [used, setUsed] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const h = localStorage.getItem(HISTORY_KEY);
      if (h) setHistory(JSON.parse(h) as HistoryItem[]);
      const u = localStorage.getItem(USAGE_KEY);
      if (u) setUsed(Number(u) || 0);
    } catch {
      /* yoksay */
    }
    setReady(true);
  }, []);

  function clearAll() {
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(USAGE_KEY);
    setHistory([]);
    setUsed(0);
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* yoksay */
    }
  }

  const remaining = Math.max(0, FREE_QUOTA - used);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Panelim</h1>
        <Link href="/" className="btn-ghost">
          ← Ana sayfa
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card">
          <p className="text-sm text-slate-500">Bu ay kullanılan</p>
          <p className="mt-1 text-3xl font-extrabold text-slate-900">{used}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Kalan ücretsiz hak</p>
          <p className="mt-1 text-3xl font-extrabold text-brand-600">{remaining}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Kayıtlı içerik</p>
          <p className="mt-1 text-3xl font-extrabold text-slate-900">{history.length}</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">
        🔒 Verileriniz şu an yalnızca <b>bu tarayıcıda</b> (yerel) saklanıyor. Bulut
        hesap/abonelik özelliği yakında eklenecek. Ekip/cihaz senkronizasyonu için Supabase
        entegrasyonu hazır — <code>supabase/schema.sql</code> dosyasına bakın.
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Geçmiş içerikler</h2>
          {history.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-sm font-medium text-rose-600 hover:underline"
            >
              Tümünü sil
            </button>
          )}
        </div>

        {!ready ? (
          <p className="text-sm text-slate-500">Yükleniyor…</p>
        ) : history.length === 0 ? (
          <div className="card text-center text-slate-500">
            <p className="text-sm">
              Henüz içerik üretmediniz.{" "}
              <Link href="/#uretelim" className="text-brand-600 hover:underline">
                İlk içeriğinizi üretin
              </Link>
              .
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {history.map((h) => (
              <li key={h.id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{h.input.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {h.input.marketplace} · {new Date(h.createdAt).toLocaleString("tr-TR")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copy(h.result.titleOptions.join("\n"))}
                    className="text-xs font-medium text-brand-600 hover:underline"
                  >
                    Başlıkları kopyala
                  </button>
                </div>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <p className="font-medium text-slate-800">
                    {h.result.titleOptions[0]}
                  </p>
                  <p className="line-clamp-2 text-slate-600">{h.result.shortDescription}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
