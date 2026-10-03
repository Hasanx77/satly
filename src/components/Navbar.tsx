"use client";

import Link from "next/link";
import { useState } from "react";

const LINKS = [
  { href: "/#ozellikler", label: "Özellikler" },
  { href: "/toplu", label: "Toplu Üretim" },
  { href: "/#fiyat", label: "Fiyatlar" },
  { href: "/#sss", label: "SSS" },
];

function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 via-brand-500 to-fuchsia-500 shadow-[0_0_24px_-4px_rgba(139,92,246,0.9)]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13l0-8Z"
            fill="white"
            fillOpacity="0.95"
          />
        </svg>
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-white">
        Sat<span className="text-brand-300">ly</span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-white/5 bg-ink-950/70 backdrop-blur-xl">
        <div className="container-x flex h-16 items-center justify-between">
          <Logo />

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="transition hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/panel" className="transition hover:text-white">
              Panelim
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/#uretelim" className="btn-primary hidden sm:inline-flex">
              Ücretsiz Dene
            </Link>
            <button
              type="button"
              aria-label="Menü"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-200 md:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-white/5 bg-ink-950/95 md:hidden">
            <div className="container-x flex flex-col py-3">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-3 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/panel"
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
              >
                Panelim
              </Link>
              <Link
                href="/#uretelim"
                onClick={() => setOpen(false)}
                className="btn-primary mt-2"
              >
                Ücretsiz Dene
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
