export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", short: "EN" },
  { code: "hi", label: "Hindi", short: "HI" },
  { code: "ar", label: "Arabic", short: "AR" },
  { code: "es", label: "Spanish", short: "ES" },
  { code: "fr", label: "French", short: "FR" },
  { code: "zh", label: "Chinese", short: "ZH" },
  { code: "de", label: "German", short: "DE" },
  { code: "pt", label: "Portuguese", short: "PT" },
  { code: "ja", label: "Japanese", short: "JA" },
  { code: "ko", label: "Korean", short: "KO" },
];

// Heuristic language detection based on video title/description keywords
// and app UI language as fallback — no external API needed
export function detectLanguage(video: {
  title?: string;
  description?: string;
}): string {
  const text = `${video.title ?? ""} ${video.description ?? ""}`.toLowerCase();
  if (/[\u0600-\u06FF]/.test(text)) return "ar";
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  if (/[\u4E00-\u9FFF]/.test(text)) return "zh";
  if (/[\u3040-\u30FF]/.test(text)) return "ja";
  if (/[\uAC00-\uD7AF]/.test(text)) return "ko";
  // keyword hints
  if (/\b(hola|gracias|el|la|los|las|es|español)\b/.test(text)) return "es";
  if (/\b(bonjour|merci|oui|non|le|la|les|français)\b/.test(text)) return "fr";
  if (/\b(hallo|danke|ja|nein|deutsch)\b/.test(text)) return "de";
  try {
    const stored = localStorage.getItem("app_language");
    if (stored && SUPPORTED_LANGUAGES.find((l) => l.code === stored))
      return stored;
  } catch {}
  return "en";
}

export function getAutoLabel(code: string): string {
  const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
  return `Auto (Detected: ${lang?.label ?? "English"})`;
}

export function getLangLabel(code: string): string {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code)?.label ?? code;
}

export function getLangShort(code: string): string {
  return (
    SUPPORTED_LANGUAGES.find((l) => l.code === code)?.short ??
    code.toUpperCase()
  );
}
