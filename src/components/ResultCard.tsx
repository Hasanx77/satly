"use client";

import { useState } from "react";
import { TITLE_LIMITS } from "@/lib/prompts";
import type { GenerationResult, Marketplace } from "@/lib/types";

function CopyButton({ text, label = "Kopyala" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {

    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
    >
      {copied ? "Kopyalandı ✓" : label}
    </button>
  );
}

function download(filename: string, content: string, type = "text/plain;charset=utf-8") {
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

function csvEscape(value: string): string {
  const v = String(value ?? "");
  if (v.includes('"') || v.includes(",") || v.includes("\n")) {
    return '"' + v.replace(/"/g, '""') + '"';
  }
  return v;
}

function toTxt(result: GenerationResult): string {
  return [
    "=== BAŞLIK VARYANTLARI ===",
    ...result.titleOptions.map((t) => "- " + t),
    "",
    "=== KISA AÇIKLAMA ===",
    result.shortDescription,
    "",
    "=== DETAYLI AÇIKLAMA ===",
    result.longDescription,
    "",
    "=== ÖZELLİKLER ===",
    ...result.features.map((f) => "- " + f),
    "",
    "=== SEO ANAHTAR KELİMELER ===",
    result.keywords.join(", "),
    "",
    "=== SOSYAL MEDYA ===",
    result.socialCaption,
    "",
    "--- Satly ile üretildi ---",
  ].join("\n");
}

function toCsv(result: GenerationResult): string {
  const rows: [string, string][] = [
    ["Başlık 1", result.titleOptions[0] ?? ""],
    ["Başlık 2", result.titleOptions[1] ?? ""],
    ["Başlık 3", result.titleOptions[2] ?? ""],
    ["Kısa Açıklama", result.shortDescription],
    ["Detaylı Açıklama", result.longDescription],
    ["Özellikler", result.features.join(" | ")],
    ["Anahtar Kelimeler", result.keywords.join(", ")],
    ["Sosyal Medya", result.socialCaption],
  ];
  const body = rows.map(([k, v]) => `${csvEscape(k)},${csvEscape(v)}`).join("\n");
  return "\uFEFF" + "Alan,Değer\n" + body;
}

function Section({
  title,
  copyText,
  children,
}: {
  title: string;
  copyText: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-slate-200">{title}</h4>
        <CopyButton text={copyText} />
      </div>
      <div className="text-sm leading-relaxed text-slate-300">{children}</div>
    </div>
  );
}

export default function ResultCard({
  result,
  mock,
  marketplace = "trendyol",
}: {
  result: GenerationResult;
  mock: boolean;
  marketplace?: Marketplace;
}) {
  const allText = toTxt(result);
  const limit = TITLE_LIMITS[marketplace] ?? 100;
  const waText = `${result.titleOptions[0] ?? ""}\n\n${result.shortDescription}\n\n(Satly ile üretildi)`;

  const checks = [
    { label: "Başlık limitine uygun", ok: result.titleOptions.some((t) => t.length <= limit && t.length >= 30) },
    { label: "3 başlık varyantı", ok: result.titleOptions.length >= 3 },
    { label: "Zengin özellik listesi (4+)", ok: result.features.length >= 4 },
    { label: "Anahtar kelime (6+)", ok: result.keywords.length >= 6 },
    { label: "Detaylı açıklama (200+ karakter)", ok: result.longDescription.length >= 200 },
    { label: "Kısa açıklama dolu", ok: result.shortDescription.length >= 40 },
    { label: "Sosyal medya metni", ok: result.socialCaption.length >= 15 },
  ];
  const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);

  return (
    <div className="space-y-3">
      {mock && (
        <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-200">
          Demo modu: OpenAI anahtarı tanımlı olmadığı için örnek çıktı gösteriliyor.
        </div>
      )}

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-200">İçerik Kalite Skoru</h4>
          <span
            className={`rounded-full px-3 py-1 text-sm font-bold ${
              score >= 80
                ? "bg-emerald-500/15 text-emerald-300"
                : score >= 60
                  ? "bg-amber-500/15 text-amber-300"
                  : "bg-rose-500/15 text-rose-300"
            }`}
          >
            {score}/100
          </span>
        </div>
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {checks.map((c) => (
            <li key={c.label} className="flex items-center gap-2 text-xs">
              <span className={c.ok ? "text-emerald-400" : "text-rose-400"}>{c.ok ? "✓" : "✗"}</span>
              <span className={c.ok ? "text-slate-300" : "text-slate-500"}>{c.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <Section title="Başlık Varyantları" copyText={result.titleOptions.join("\n")}>
        <ul className="space-y-2">
          {result.titleOptions.map((t, i) => {
            const over = t.length > limit;
            return (
              <li key={i} className="flex items-start justify-between gap-3">
                <span className="flex-1">{t}</span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    over
                      ? "bg-rose-500/15 text-rose-300"
                      : "bg-emerald-500/10 text-emerald-300"
                  }`}
                  title={`Önerilen limit: ${limit} karakter`}
                >
                  {t.length}/{limit}
                </span>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section title="Kısa Açıklama" copyText={result.shortDescription}>
        <p>{result.shortDescription}</p>
      </Section>

      <Section title="Detaylı Açıklama" copyText={result.longDescription}>
        <p className="whitespace-pre-line">{result.longDescription}</p>
      </Section>

      <Section title="Özellikler" copyText={result.features.map((f) => `• ${f}`).join("\n")}>
        <ul className="list-disc space-y-1.5 pl-5 marker:text-brand-400">
          {result.features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </Section>

      <Section title="SEO Anahtar Kelimeler" copyText={result.keywords.join(", ")}>
        <div className="flex flex-wrap gap-2">
          {result.keywords.map((k, i) => (
            <span
              key={i}
              className="rounded-full border border-brand-400/20 bg-brand-500/15 px-3 py-1 text-xs font-medium text-brand-200"
            >
              {k}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Sosyal Medya Metni" copyText={result.socialCaption}>
        <p className="whitespace-pre-line">{result.socialCaption}</p>
      </Section>

      <div className="flex flex-wrap justify-end gap-2">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(waText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
        >
          WhatsApp
        </a>
        <button
          type="button"
          onClick={() => download("urun-icerigi.csv", toCsv(result), "text/csv;charset=utf-8")}
          className="btn-ghost"
        >
          ⬇ CSV
        </button>
        <button
          type="button"
          onClick={() => download("urun-icerigi.json", JSON.stringify(result, null, 2), "application/json")}
          className="btn-ghost"
        >
          ⬇ JSON
        </button>
        <button
          type="button"
          onClick={() => download("urun-icerigi.txt", toTxt(result))}
          className="btn-ghost"
        >
          ⬇ TXT
        </button>
        <CopyButton text={allText} label="Tümünü Kopyala" />
      </div>
    </div>
  );
}
