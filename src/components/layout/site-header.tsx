"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthNav } from "@/components/auth/auth-nav";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import {
  ActivityIcon,
  ArrowLeftIcon,
  LanguagesIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  XIcon,
} from "@/components/ui/icons";

type SiteHeaderProps = {
  backHref?: string;
  backLabel?: string;
  compact?: boolean;
};

export function BrandLogo() {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="ClinicCare home">
      <span className="brand-mark">
        <span className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent" />
        <ActivityIcon className="relative h-6 w-6" />
      </span>
      <span className="brand-wordmark">Clinic<span>Care</span></span>
    </Link>
  );
}

function PreferenceButtons() {
  const { copy, locale, theme, toggleLocale, toggleTheme } = useAppSettings();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleLocale}
        className="preference-button"
        aria-label={copy.common.language}
        title={copy.common.language}
      >
        <LanguagesIcon className="h-4 w-4" />
        <span className="hidden xl:inline">{locale === "en" ? "AR" : "EN"}</span>
      </button>
      <button
        type="button"
        onClick={toggleTheme}
        className="preference-button"
        aria-label={copy.nav.theme}
        title={copy.nav.theme}
      >
        {theme === "dark" ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function SiteHeader({ backHref, backLabel, compact = false }: SiteHeaderProps) {
  const { copy, isRtl } = useAppSettings();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <nav className={`mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 sm:px-6 ${compact ? "min-h-[4.5rem] py-3" : "min-h-20 py-4"}`}>
        <div className="flex min-w-0 items-center gap-4">
          <BrandLogo />
          {backHref && backLabel ? (
            <Link href={backHref} className="header-back hidden md:inline-flex">
              <ArrowLeftIcon className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
              {backLabel}
            </Link>
          ) : (
            <div className="hidden items-center gap-6 border-s border-white/10 ps-6 lg:flex">
              <Link href="/" className="nav-link">{copy.common.home}</Link>
              <Link href="/doctors" className="nav-link">{copy.common.doctors}</Link>
              <Link href="/appointments" className="nav-link">{copy.common.appointments}</Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block"><PreferenceButtons /></div>
          <AuthNav />
          <button
            type="button"
            className="preference-button lg:hidden"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label={copy.nav.menu}
          >
            {menuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-nav-panel lg:hidden">
          <div className="mx-auto max-w-7xl px-5 pb-5 sm:px-6">
            <div className="glass-card grid gap-2 rounded-2xl p-3">
              <Link href="/" onClick={() => setMenuOpen(false)} className="mobile-nav-link">{copy.common.home}</Link>
              <Link href="/doctors" onClick={() => setMenuOpen(false)} className="mobile-nav-link">{copy.common.doctors}</Link>
              <Link href="/appointments" onClick={() => setMenuOpen(false)} className="mobile-nav-link">{copy.common.appointments}</Link>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="mobile-nav-link">{copy.common.dashboard}</Link>
              <div className="mt-1 border-t border-white/[0.07] pt-3 sm:hidden"><PreferenceButtons /></div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
