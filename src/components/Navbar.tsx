import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            S
          </span>
          <span>
            Satıcı<span className="text-brand-600">Asistan</span>
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
          <Link href="/#nasil" className="hidden hover:text-slate-900 sm:block">
            Nasıl Çalışır
          </Link>
          <Link href="/araclar/baslik-uretici" className="hidden hover:text-slate-900 md:block">
            Ücretsiz Araç
          </Link>
          <Link href="/panel" className="hidden hover:text-slate-900 sm:block">
            Panelim
          </Link>
          <Link href="/#uretelim" className="btn-primary">
            Ücretsiz Dene
          </Link>
        </nav>
      </div>
    </header>
  );
}
