import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { JSX } from "react";
import { createElement } from "react";
import enLocale from "./locales/en.json";

// ── Types ────────────────────────────────────────────────────────────────────

type Translations = Record<string, string>;

export interface Language {
  code: string;
  name: string;
  dir: "ltr" | "rtl";
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", dir: "ltr" },
  { code: "fr", name: "Fran\u00e7ais", dir: "ltr" },
  { code: "es", name: "Espa\u00f1ol", dir: "ltr" },
  { code: "hi", name: "\u0939\u093f\u0928\u094d\u0926\u0940", dir: "ltr" },
  {
    code: "ar",
    name: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629",
    dir: "rtl",
  },
];

const SUBTITLE_LANG_KEY = "subtitle_lang";
const APP_LANG_KEY = "app_language";

// ── Translation loader ───────────────────────────────────────────────────────

const localeCache: Record<string, Translations> = {
  en: enLocale as Translations,
};

async function loadLocale(code: string): Promise<Translations> {
  if (localeCache[code]) return localeCache[code];
  try {
    // Dynamic import for non-English locales
    const module = await import(`./locales/${code}.json`);
    localeCache[code] = module.default as Translations;
    return localeCache[code];
  } catch {
    // biome-ignore lint/complexity/useLiteralKeys: dynamic key access needed
    return localeCache["en"];
  }
}

// ── Context ─────────────────────────────────────────────────────────────────

interface I18nContextValue {
  language: string;
  dir: "ltr" | "rtl";
  setLanguage: (code: string) => void;
  t: (key: string, vars?: Record<string, string>) => string;
  subtitleLang: string;
  setSubtitleLang: (code: string) => void;
}

const I18nContext = createContext<I18nContextValue>({
  language: "en",
  dir: "ltr",
  setLanguage: () => {},
  t: (key) => key,
  subtitleLang: "en",
  setSubtitleLang: () => {},
});

// ── translateComment stub ────────────────────────────────────────────────────
// Structured so a real API can replace it later.
export async function translateComment(
  text: string,
  targetLang: string,
): Promise<string> {
  // TODO: Replace with real translation API call when available.
  // e.g. return await realTranslationApi(text, targetLang);
  await new Promise((resolve) => setTimeout(resolve, 600)); // simulate latency
  return `[${targetLang.toUpperCase()}] ${text}`;
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function I18nProvider({
  children,
}: { children: React.ReactNode }): JSX.Element {
  const [language, setLanguageState] = useState<string>(() => {
    try {
      return localStorage.getItem(APP_LANG_KEY) || "en";
    } catch {
      return "en";
    }
  });

  const [translations, setTranslations] = useState<Translations>(
    localeCache.en,
  );

  const [subtitleLang, setSubtitleLangState] = useState<string>(() => {
    try {
      return localStorage.getItem(SUBTITLE_LANG_KEY) || "en";
    } catch {
      return "en";
    }
  });

  // Load locale on mount if not English
  // biome-ignore lint/correctness/useExhaustiveDependencies: only run on mount
  useEffect(() => {
    if (language !== "en") {
      loadLocale(language).then(setTranslations);
    }
  }, []);

  const setLanguage = useCallback((code: string) => {
    try {
      localStorage.setItem(APP_LANG_KEY, code);
    } catch {}
    setLanguageState(code);
    if (code === "en") {
      // biome-ignore lint/complexity/useLiteralKeys: dynamic key access needed
      setTranslations(localeCache["en"]);
    } else {
      loadLocale(code).then(setTranslations);
    }
  }, []);

  const setSubtitleLang = useCallback((code: string) => {
    try {
      localStorage.setItem(SUBTITLE_LANG_KEY, code);
    } catch {}
    setSubtitleLangState(code);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string>): string => {
      // biome-ignore lint/complexity/useLiteralKeys: dynamic key access needed
      let value = translations[key] ?? localeCache["en"][key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          value = value.replace(`{{${k}}}`, v);
        }
      }
      return value;
    },
    [translations],
  );

  const dir =
    SUPPORTED_LANGUAGES.find((l) => l.code === language)?.dir ?? "ltr";

  const value: I18nContextValue = {
    language,
    dir,
    setLanguage,
    t,
    subtitleLang,
    setSubtitleLang,
  };

  return createElement(I18nContext.Provider, { value }, children);
}

// ── Hooks ────────────────────────────────────────────────────────────────────

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}

export function useT(): (key: string, vars?: Record<string, string>) => string {
  return useContext(I18nContext).t;
}
