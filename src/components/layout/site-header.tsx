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
    <Link
      href="/"
      className="brand-logo group flex min-w-0 items-center gap-2.5 sm:gap-3"
      aria-label="ClinicCare home"
    >
      <span className="brand-mark shrink-0">
        <span className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent" />
        <ActivityIcon className="relative h-5 w-5 sm:h-6 sm:w-6" />
      </span>
      <span className="brand-wordmark truncate">
        Clinic<span>Care</span>
      </span>
    </Link>
  );
}

function PreferenceButtons({ fullWidth = false }: { fullWidth?: boolean }) {
  const { copy, locale, theme, toggleLocale, toggleTheme } = useAppSettings();

  return (
    <div className={`flex items-center gap-2 ${fullWidth ? "w-full" : ""}`}>
      <button
        type="button"
        onClick={toggleLocale}
        className={`preference-button ${fullWidth ? "flex-1" : ""}`}
        aria-label={copy.common.language}
        title={copy.common.language}
      >
        <LanguagesIcon className="h-4 w-4" />
        <span>{locale === "en" ? "AR" : "EN"}</span>
      </button>
      <button
        type="button"
        onClick={toggleTheme}
        className={`preference-button ${fullWidth ? "flex-1" : ""}`}
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

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <nav
        className={`site-header-inner mx-auto max-w-7xl px-4 sm:px-6 ${
          compact ? "min-h-[4.25rem] py-2.5" : "min-h-[4.5rem] py-3 sm:min-h-20 sm:py-4"
        }`}
      >
        {/* Mobile: hamburger stays physically on the LEFT. */}
        <button
          type="button"
          className="mobile-menu-trigger preference-button lg:hidden"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label={copy.nav.menu}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>

        <div className="site-header-brand flex min-w-0 items-center gap-4">
          <BrandLogo />

          {backHref && backLabel ? (
            <Link href={backHref} className="header-back hidden md:inline-flex">
              <ArrowLeftIcon className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
              {backLabel}
            </Link>
          ) : (
            <div className="hidden items-center gap-6 border-s border-white/10 ps-6 lg:flex">
              <Link href="/" className="nav-link">
                {copy.common.home}
              </Link>
              <Link href="/doctors" className="nav-link">
                {copy.common.doctors}
              </Link>
              <Link href="/appointments" className="nav-link">
                {copy.common.appointments}
              </Link>
            </div>
          )}
        </div>

        <div className="site-header-actions flex shrink-0 items-center gap-2">
          {/* On phones the language/theme controls stay in the TOP BAR, not inside the drawer. */}
          <div className="mobile-header-preferences sm:hidden">
            <PreferenceButtons />
          </div>

          <div className="hidden md:block">
            <PreferenceButtons />
          </div>

          <div className="hidden sm:block">
            <AuthNav />
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-nav-panel lg:hidden">
          <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 sm:pb-5">
            <div className="glass-card grid gap-2 rounded-2xl p-3">
              {backHref && backLabel && (
                <Link href={backHref} onClick={closeMenu} className="mobile-nav-link flex items-center gap-2.5">
                  <ArrowLeftIcon className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
                  {backLabel}
                </Link>
              )}

              <Link href="/" onClick={closeMenu} className="mobile-nav-link">
                {copy.common.home}
              </Link>
              <Link href="/doctors" onClick={closeMenu} className="mobile-nav-link">
                {copy.common.doctors}
              </Link>

              {/* AuthNav owns Dashboard/Appointments for signed-in users, so there are no duplicate links. */}
              <div className="mt-1 border-t border-white/[0.07] pt-3 sm:hidden">
                <AuthNav mobile onNavigate={closeMenu} />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
