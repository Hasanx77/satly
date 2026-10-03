// =====================================================================
//  Satly - API & rota test betiği
//  Kullanım:  Sunucu çalışırken  ->  npm run test:api
//  Not: Hız sınırı testi en sonda çalışır (IP'yi geçici olarak kilitler).
// =====================================================================

const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";

let pass = 0;
let fail = 0;
const failures = [];

function check(name, cond, extra = "") {
  if (cond) {
    pass++;
    console.log(`  \u2713 ${name}`);
  } else {
    fail++;
    failures.push(name + (extra ? " \u2014 " + extra : ""));
    console.log(`  \u2717 ${name}${extra ? "  (" + extra + ")" : ""}`);
  }
}

async function req(path, opts) {
  const res = await fetch(BASE + path, opts);
  const ct = res.headers.get("content-type") || "";
  let body = null;
  try {
    body = ct.includes("application/json") ? await res.json() : await res.text();
  } catch {
    body = null;
  }
  return { status: res.status, body };
}

function postJson(path, obj) {
  return req(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof obj === "string" ? obj : JSON.stringify(obj),
  });
}

function validResult(r) {
  return (
    r &&
    Array.isArray(r.titleOptions) &&
    r.titleOptions.length >= 1 &&
    typeof r.shortDescription === "string" &&
    r.shortDescription.length > 0 &&
    typeof r.longDescription === "string" &&
    r.longDescription.length > 0 &&
    Array.isArray(r.features) &&
    r.features.length >= 1 &&
    Array.isArray(r.keywords) &&
    r.keywords.length >= 1 &&
    typeof r.socialCaption === "string" &&
    r.socialCaption.length > 0
  );
}

const MARKETS = ["trendyol", "hepsiburada", "amazon", "shopify"];

console.log("=== Satly test paketi ===");
console.log("Sunucu: " + BASE + "\n");

// --- 1) Sağlık ve rotalar ---
console.log("1) Saglik ve rotalar");
{
  const h = await req("/api/health");
  check("GET /api/health -> 200", h.status === 200, "durum=" + h.status);
  check("health.ok === true", !!(h.body && h.body.ok === true));

  for (const p of ["/", "/araclar/baslik-uretici", "/panel", "/robots.txt", "/sitemap.xml"]) {
    const r = await req(p);
    check(`GET ${p} -> 200`, r.status === 200, "durum=" + r.status);
  }
}

// --- 2) Girdi doğrulama ---
console.log("\n2) Girdi dogrulama (hatali girdiler)");
{
  const r1 = await postJson("/api/generate", { name: "" });
  check("Bos isim -> 400", r1.status === 400, "durum=" + r1.status);

  const r2 = await postJson("/api/generate", { name: "Test Urun", marketplace: "gecersiz" });
  check("Gecersiz pazaryeri -> 400", r2.status === 400, "durum=" + r2.status);

  const r3 = await postJson("/api/generate", "bozuk-json");
  check("Bozuk JSON -> 400", r3.status === 400, "durum=" + r3.status);

  const r4 = await postJson("/api/generate", { name: "A".repeat(300), marketplace: "trendyol" });
  check("Asiri uzun isim -> 400", r4.status === 400, "durum=" + r4.status);
}

// --- 3) Üretim (her pazaryeri) ---
console.log("\n3) Icerik uretimi (4 pazaryeri)");
for (const m of MARKETS) {
  const r = await postJson("/api/generate", {
    name: "Kablosuz Kulaklik",
    category: "Elektronik",
    features: "ANC, 20 saat pil",
    marketplace: m,
    tone: "profesyonel",
  });
  const result = r.body && r.body.result;
  check(`${m}: 200 + gecerli sonuc`, r.status === 200 && validResult(result), "durum=" + r.status);
}

// --- 4) Farklı üslup ---
console.log("\n4) Ustup secenekleri");
for (const tone of ["samimi", "premium", "genc", "profesyonel"]) {
  const r = await postJson("/api/generate", { name: "Test", marketplace: "amazon", tone });
  check(`ton=${tone}: 200`, r.status === 200, "durum=" + r.status);
}

// --- 5) Dil ve görsel ---
console.log("\n5) Dil ve gorsel");
{
  const en = await postJson("/api/generate", {
    name: "Wireless Earbuds",
    marketplace: "amazon",
    language: "en",
  });
  check("Ingilizce uretim -> 200 + gecerli sonuc", en.status === 200 && validResult(en.body && en.body.result), "durum=" + en.status);

  const badImg = await postJson("/api/generate", { name: "Test", marketplace: "trendyol", image: "bozuk" });
  check("Gecersiz gorsel -> 400", badImg.status === 400, "durum=" + badImg.status);

  const goodImg = await postJson("/api/generate", {
    name: "Test",
    marketplace: "trendyol",
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M8AAAMBAQDJ/pLvAAAAAElFTkSuQmCC",
  });
  check("Gecerli gorsel -> 200", goodImg.status === 200, "durum=" + goodImg.status);
}

// --- 6) Hız sınırı (EN SON) ---
console.log("\n6) Hiz siniri (dakikada 20)");
{
  let got429 = false;
  for (let i = 0; i < 30; i++) {
    const r = await postJson("/api/generate", { name: "Limit Test", marketplace: "trendyol" });
    if (r.status === 429) {
      got429 = true;
      break;
    }
  }
  check("Asiri istekte 429 doner", got429);
}

console.log("\n===============================");
console.log(`SONUC: ${pass} gecti, ${fail} basarisiz`);
if (failures.length) {
  console.log("Basarisizlar:");
  failures.forEach((f) => console.log(" - " + f));
}
process.exit(fail === 0 ? 0 : 1);
