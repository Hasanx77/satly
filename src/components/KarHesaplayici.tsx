"use client";

import { useMemo, useState } from "react";

const PRESETS = [
  { id: "trendyol", label: "Trendyol", commission: 20 },
  { id: "hepsiburada", label: "Hepsiburada", commission: 15 },
  { id: "amazon", label: "Amazon", commission: 15 },
  { id: "etsy", label: "Etsy", commission: 9 },
  { id: "shopify", label: "Kendi site (Shopify)", commission: 3 },
  { id: "custom", label: "Diğer / elle gir", commission: 10 },
];

function tl(n: number): string {
  if (!isFinite(n) || n < 0) return "-";
  return n.toLocaleString("tr-TR", { maximumFractionDigits: 2 }) + " ₺";
}

export default function KarHesaplayici() {
  const [cost, setCost] = useState(100);
  const [shipping, setShipping] = useState(30);
  const [sellerPaysShipping, setSellerPaysShipping] = useState(true);
  const [commission, setCommission] = useState(20);
  const [kdv, setKdv] = useState(20);
  const [targetMargin, setTargetMargin] = useState(20);

  const result = useMemo(() => {
    const totalCost = cost + (sellerPaysShipping ? shipping : 0);
    const c = commission / 100;
    const k = kdv / 100;
    const kdvShare = k / (1 + k); // KDV dahil fiyatın vergiye giden oranı
    const m = targetMargin / 100;
    const denominator = 1 - c - kdvShare - m;

    if (denominator <= 0.02) {
      return { possible: false as const };
    }

    const price = totalCost / denominator;
    const commissionAmount = price * c;
    const kdvAmount = price * kdvShare;
    const netProfit = price - commissionAmount - kdvAmount - totalCost;
    const marginPct = (netProfit / price) * 100;
    return {
      possible: true as const,
      price,
      commissionAmount,
      kdvAmount,
      netProfit,
      marginPct,
      totalCost,
    };
  }, [cost, shipping, sellerPaysShipping, commission, kdv, targetMargin]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* INPUTS */}
      <div className="glass space-y-5 rounded-2xl p-6">
        <h3 className="font-display text-lg font-semibold text-white">Girdiler</h3>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Pazaryeri komisyonu
          </label>
          <select
            className="input-base mb-2"
            onChange={(e) => {
              const p = PRESETS.find((x) => x.id === e.target.value);
              if (p) setCommission(p.commission);
            }}
            defaultValue="trendyol"
          >
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id} className="bg-ink-800">
                {p.label} (%{p.commission})
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500">
            Oranlar tahminîdir; kategorinize göre aşağıdan güncelleyin.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField label="Ürün maliyeti (₺)" value={cost} onChange={setCost} />
          <NumberField label="Kargo (₺)" value={shipping} onChange={setShipping} />
          <NumberField label="Komisyon (%)" value={commission} onChange={setCommission} />
          <NumberField label="KDV (%)" value={kdv} onChange={setKdv} />
          <NumberField label="Hedef kâr marjı (%)" value={targetMargin} onChange={setTargetMargin} />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={sellerPaysShipping}
            onChange={(e) => setSellerPaysShipping(e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-white/5"
          />
          Kargoyu satıcı ödüyor (maliyete eklenir)
        </label>
      </div>

      {/* RESULT */}
      <div className="space-y-4">
        {result.possible ? (
          <>
            <div className="glass rounded-2xl p-6 text-center shadow-[0_0_60px_-30px_rgba(139,92,246,0.9)]">
              <p className="text-sm text-slate-400">Önerilen satış fiyatı (KDV dahil)</p>
              <p className="mt-2 font-display text-5xl font-extrabold text-white">
                {tl(result.price)}
              </p>
              <p className="mt-2 text-sm text-emerald-300">
                Hedef marj: %{targetMargin.toFixed(0)} · Net kâr: {tl(result.netProfit)}
              </p>
            </div>

            <div className="glass rounded-2xl p-5">
              <h4 className="mb-3 text-sm font-semibold text-slate-200">Kırılım</h4>
              <ul className="space-y-2 text-sm">
                <Row label="Toplam maliyet" value={tl(result.totalCost)} />
                <Row label={`Komisyon (%${commission})`} value={"- " + tl(result.commissionAmount)} />
                <Row label={`KDV (%${kdv})`} value={"- " + tl(result.kdvAmount)} />
                <Row label="Net kâr" value={tl(result.netProfit)} strong />
                <Row label="Gerçek marj" value={"%" + result.marginPct.toFixed(1)} />
              </ul>
            </div>
          </>
        ) : (
          <div className="glass flex min-h-[240px] flex-col items-center justify-center rounded-2xl p-6 text-center">
            <p className="text-2xl">⚠️</p>
            <p className="mt-3 max-w-xs text-sm text-slate-400">
              Komisyon + KDV + hedef marj toplamı %100'e ulaşıyor. Bu koşullarda kârlı fiyat
              hesaplanamaz; marjı veya komisyonu düşürün.
            </p>
          </div>
        )}
        <p className="text-center text-xs text-slate-500">
          Bu araç tahminî sonuç verir; kesin hesap için mali müşavirinize danışın.
        </p>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
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

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <li className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className={strong ? "font-semibold text-emerald-300" : "text-slate-200"}>{value}</span>
    </li>
  );
}
