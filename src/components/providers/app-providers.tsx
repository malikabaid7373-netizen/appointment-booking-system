"use client";

import { AppSettingsProvider } from "@/components/providers/app-settings-provider";
import { AppSplash } from "@/components/ui/app-splash";
import type { Locale, ThemeMode } from "@/lib/i18n";

export function AppProviders({
  initialLocale,
  initialTheme,
  children,
}: {
  initialLocale: Locale;
  initialTheme: ThemeMode;
  children: React.ReactNode;
}) {
  return (
    <AppSettingsProvider initialLocale={initialLocale} initialTheme={initialTheme}>
      <AppSplash />
      {children}
    </AppSettingsProvider>
  );
}
