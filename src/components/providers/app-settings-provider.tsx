"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { getCopy, type Locale, type ThemeMode } from "@/lib/i18n";

type AppSettingsContextValue = {
  locale: Locale;
  theme: ThemeMode;
  isRtl: boolean;
  copy: ReturnType<typeof getCopy>;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

function persistCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=31536000; samesite=lax`;
}

export function AppSettingsProvider({
  initialLocale,
  initialTheme,
  children,
}: {
  initialLocale: Locale;
  initialTheme: ThemeMode;
  children: React.ReactNode;
}) {
  const [locale, updateLocale] = useState<Locale>(initialLocale);
  const [theme, updateTheme] = useState<ThemeMode>(initialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = locale === "ar" ? "rtl" : "ltr";
    root.dataset.theme = theme;
  }, [locale, theme]);

  function setLocale(nextLocale: Locale) {
    updateLocale(nextLocale);
    persistCookie("clinic_locale", nextLocale);
  }

  function setTheme(nextTheme: ThemeMode) {
    updateTheme(nextTheme);
    persistCookie("clinic_theme", nextTheme);
  }

  const value = useMemo<AppSettingsContextValue>(
    () => ({
      locale,
      theme,
      isRtl: locale === "ar",
      copy: getCopy(locale),
      setLocale,
      toggleLocale: () => setLocale(locale === "en" ? "ar" : "en"),
      setTheme,
      toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
    }),
    [locale, theme],
  );

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings() {
  const value = useContext(AppSettingsContext);
  if (!value) throw new Error("useAppSettings must be used inside AppSettingsProvider");
  return value;
}
