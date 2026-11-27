// UI utility mappings used across components

// Backend platform IDs → display labels (used across all components)
export const platformLabels: Record<string, string> = {
  openai: "ChatGPT",
  anthropic: "Claude",
  gemini: "Gemini",
  perplexity: "Perplexity",
  grok: "Grok",
  deepseek: "DeepSeek",
};

// Alias for backward compatibility
export const platformIcons = platformLabels;

export const statusColors = {
  ranking: "bg-emerald-900/50 text-emerald-400 border-emerald-800",
  improving: "bg-amber-900/50 text-amber-400 border-amber-800",
  needs_work: "bg-red-900/50 text-red-400 border-red-800",
  not_ranking: "bg-zinc-800 text-zinc-400 border-zinc-700",
};
