"use client";

import { useMemo, useState } from "react";

interface Row {
  name: string;
  cost: number;
}

const DEFAULT_TEXT = `Kablosuz Kulaklık, 120
Yoga Matı, 90
Seramik Kupa, 45`;

function parseRows(text: string): Row[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/(\d+[.,]?\d*)\s*₺?\s*$/);
      if (m) {
        const cost = Number(m[1].replace(",", "."));
        const name = line.slice(0, m.index).replace(/[,;|]\s*$/, "").trim() || "Ürün";
        return { name, cost };
      }
      return { name: line, cost: 0 };
    })
    .filter((r) => r.cost > 0);
}

function tl(n: number): string {
  if (!isFinite(n) || n < 0) return "-";
  return n.toLocaleString("tr-TR", { maximumFractionDigits: 0 }) + " ₺";
}

export default function TopluFiyat() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [shipping, setShipping] = useState(30);
  const [commission, setCommission] = useState(20);
  const [kdv, setKdv] = useState(20);
  const [margin, setMargin] = useState(20);

  const rows = useMemo(() => parseRows(text), [text]);

  const computed = useMemo(() => {
    const c = commission / 100;
    const k = kdv / 100;
    const kdvShare = k / (1 + k);
    const m = margin / 100;
    const denom = 1 - c - kdvShare - m;
    return rows.map((r) => {
      const totalCost = r.cost + shipping;
      if (denom <= 0.02) return { ...r, totalCost, price: NaN, profit: NaN };
      const price = totalCost / denom;
      const profit = price - price * c - price * kdvShare - totalCost;
      return { ...r, totalCost, price, profit };
    });
  }, [rows, shipping, commission, kdv, margin]);

  function downloadCsv() {
    const header = "Urun,Maliyet,Onerilen Fiyat,Net Kar\n";
    const body = computed
      .map((r) =>
        [r.name, r.cost, isFinite(r.price) ? Math.round(r.price) : "", isFinite(r.profit) ? Math.round(r.profit) : ""]
          .join(",")
      )
      .join("\n");
    const blob = new Blob(["\uFEFF" + header + body], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "toplu-fiyat.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="glass space-y-5 rounded-2xl p-6">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">Ürün ve maliyet listesi</h3>
          <p className="mt-1 text-sm text-slate-400">
            Her satıra <code className="text-brand-300">Ürün adı, maliyet</code> yazın.
          </p>
        </div>
        <textarea
          aria-label="Ürün ve maliyet listesi"
          className="input-base min-h-[180px] font-mono text-xs"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          <Num label="Kargo (₺)" value={shipping} onChange={setShipping} />
          <Num label="Komisyon (%)" value={commission} onChange={setCommission} />
          <Num label="KDV (%)" value={kdv} onChange={setKdv} />
          <Num label="Hedef marj (%)" value={margin} onChange={setMargin} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">{computed.length} ürün</span>
          <button type="button" onClick={downloadCsv} disabled={computed.length === 0} className="btn-ghost py-1.5 text-xs">
            ⬇ CSV indir
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {computed.length === 0 ? (
          <div className="glass flex min-h-[240px] items-center justify-center rounded-2xl text-sm text-slate-400">
            Geçerli satır bulunamadı. Örn: “Kulaklık, 120”
          </div>
        ) : (
          <div className="glass rounded-2xl p-5">
            <h4 className="mb-3 text-sm font-semibold text-slate-200">Önerilen fiyatlar</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs text-slate-500">
                    <th className="py-2">Ürün</th>
                    <th className="py-2">Maliyet</th>
                    <th className="py-2 text-right">Önerilen</th>
                    <th className="py-2 text-right">Net kâr</th>
                  </tr>
                </thead>
                <tbody>
                  {computed.map((r, i) => (
                    <tr key={i} className="border-b border-white/5 last:border-0">
                      <td className="py-2 text-slate-200">{r.name}</td>
                      <td className="py-2 text-slate-400">{tl(r.totalCost)}</td>
                      <td className="py-2 text-right font-semibold text-white">
                        {isFinite(r.price) ? tl(r.price) : "—"}
                      </td>
                      <td className="py-2 text-right text-emerald-300">
                        {isFinite(r.profit) ? tl(r.profit) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <p className="text-center text-xs text-slate-500">
          Fiyatlar KDV dahil ve tahminîdir; kesin hesap için mali müşavirinize danışın.
        </p>
      </div>
    </div>
  );
}

function Num({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-300">{label}</label>
      <input
        type="number"
        min={0}
        className="input-base"
        value={Number.isNaN(value) ? "" : value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
