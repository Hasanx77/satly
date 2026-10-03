export type Marketplace = "trendyol" | "hepsiburada" | "amazon" | "shopify";

export type Tone = "profesyonel" | "samimi" | "premium" | "genc";

export type Language = "tr" | "en";

export interface GenerationInput {
  name: string;
  category?: string;
  features?: string;
  marketplace: Marketplace;
  tone?: Tone;
  language?: Language;
}

export interface GenerationResult {
  titleOptions: string[];
  shortDescription: string;
  longDescription: string;
  features: string[];
  keywords: string[];
  socialCaption: string;
}

export interface GenerateResponse {
  result: GenerationResult;
  mock: boolean;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  error?: string;
}

export interface HistoryItem {
  id: string;
  createdAt: string;
  input: GenerationInput;
  result: GenerationResult;
}
