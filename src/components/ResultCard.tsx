"use client";

import { useState } from "react";
import type { GenerationResult } from "@/lib/types";

function CopyButton({ text, label = "Kopyala" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard izni yoksa sessiz geç */
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
  const header = "Alan,Değer\n";
  const body = rows.map(([k, v]) => `${csvEscape(k)},${csvEscape(v)}`).join("\n");
  return "\uFEFF" + header + body; // BOM: Excel'de Türkçe karakterler doğru görünsün
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
}: {
  result: GenerationResult;
  mock: boolean;
}) {
  const allText = toTxt(result);

  return (
    <div className="space-y-3">
      {mock && (
        <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-200">
          Demo modu: OpenAI anahtarı tanımlı olmadığı için örnek çıktı gösteriliyor.
        </div>
      )}

      <Section title="Başlık Varyantları" copyText={result.titleOptions.join("\n")}>
        <ul className="list-disc space-y-1.5 pl-5 marker:text-brand-400">
          {result.titleOptions.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </Section>

      <Section title="Kısa Açıklama" copyText={result.shortDescription}>
        <p>{result.shortDescription}</p>
      </Section>

      <Section title="Detaylı Açıklama" copyText={result.longDescription}>
        <p className="whitespace-pre-line">{result.longDescription}</p>
      </Section>

      <Section
        title="Özellikler"
        copyText={result.features.map((f) => `• ${f}`).join("\n")}
      >
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
        <button
          type="button"
          onClick={() => download("urun-icerigi.csv", toCsv(result), "text/csv;charset=utf-8")}
          className="btn-ghost"
        >
          ⬇ CSV indir
        </button>
        <button
          type="button"
          onClick={() => download("urun-icerigi.txt", toTxt(result))}
          className="btn-ghost"
        >
          ⬇ TXT indir
        </button>
        <CopyButton text={allText} label="Tümünü Kopyala" />
      </div>
    </div>
  );
}
