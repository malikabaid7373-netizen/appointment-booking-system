import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";
import type { Locale, ThemeMode } from "@/lib/i18n";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ClinicCare | Book Trusted Doctors Online",
    template: "%s | ClinicCare",
  },
  description:
    "A bilingual clinic appointment platform for discovering doctors, checking live availability, and managing secure patient bookings.",
  applicationName: "ClinicCare",
  keywords: [
    "doctor appointment",
    "clinic booking",
    "healthcare",
    "online appointment",
    "Arabic clinic booking",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("clinic_locale")?.value;
  const themeCookie = cookieStore.get("clinic_theme")?.value;

  const initialLocale: Locale = localeCookie === "ar" ? "ar" : "en";
  const initialTheme: ThemeMode = themeCookie === "light" ? "light" : "dark";

  return (
    <html
      lang={initialLocale}
      dir={initialLocale === "ar" ? "rtl" : "ltr"}
      data-theme={initialTheme}
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <AppProviders initialLocale={initialLocale} initialTheme={initialTheme}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
