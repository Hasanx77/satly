

const STOPWORDS = new Set<string>([

  "ve", "ile", "için", "bir", "bu", "da", "de", "ki", "mi", "mı", "mu", "mü",
  "en", "çok", "gibi", "olan", "olarak", "veya", "ya", "ama", "ise", "her",
  "daha", "kadar", "sonra", "önce", "şu", "o", "ben", "sen", "biz", "siz",
  "onlar", "göre", "üzere", "tüm", "bütün", "adet", "tane", "ürün", "ürünler",
  "olan", "olup", "oldukça", "hem", "ancak", "fakat", "lakin", "çünkü",

  "the", "and", "for", "with", "you", "your", "a", "an", "of", "to", "in",
  "on", "is", "are", "this", "that", "it", "as", "at", "by", "or", "be",
]);

export interface Term {
  term: string;
  count: number;
}

export interface KeywordAnalysis {
  words: Term[];
  phrases: Term[];
  totalWords: number;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9çğıöşü\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function analyzeKeywords(text: string): KeywordAnalysis {
  const tokens = normalize(text)
    .split(" ")
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t) && !/^\d+$/.test(t));

  const wordCounts = new Map<string, number>();
  for (const t of tokens) wordCounts.set(t, (wordCounts.get(t) || 0) + 1);

  const phraseCounts = new Map<string, number>();
  for (let i = 0; i < tokens.length - 1; i++) {
    const phrase = `${tokens[i]} ${tokens[i + 1]}`;
    phraseCounts.set(phrase, (phraseCounts.get(phrase) || 0) + 1);
  }

  const words: Term[] = [...wordCounts.entries()]
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count || a.term.localeCompare(b.term))
    .slice(0, 30);

  const phrases: Term[] = [...phraseCounts.entries()]
    .map(([term, count]) => ({ term, count }))
    .filter((p) => p.count >= 2)
    .sort((a, b) => b.count - a.count || a.term.localeCompare(b.term))
    .slice(0, 20);

  return { words, phrases, totalWords: tokens.length };
}
