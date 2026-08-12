"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { useAppSettings } from "@/components/providers/app-settings-provider";
import { BrandLogo } from "@/components/layout/site-header";
import { BadgeCheckIcon, CalendarIcon, CheckIcon, LanguagesIcon, MoonIcon, ShieldIcon, SparklesIcon, SunIcon } from "@/components/ui/icons";

type AuthShellProps = {
  mode: "login" | "register";
  children: ReactNode;
};

export function AuthShell({ mode, children }: AuthShellProps) {
  const { copy, locale, theme, toggleLocale, toggleTheme } = useAppSettings();
  const eyebrow = mode === "login" ? copy.auth.loginEyebrow : copy.auth.registerEyebrow;
  const title = mode === "login" ? copy.auth.loginTitle : copy.auth.registerTitle;
  const description = mode === "login" ? copy.auth.loginDesc : copy.auth.registerDesc;

  return (
    <main className="auth-page">
      <div className="fixed end-4 top-4 z-[70] flex items-center gap-2 sm:end-6 sm:top-6">
        <button type="button" onClick={toggleLocale} className="preference-button" aria-label={copy.common.language}><LanguagesIcon className="h-4 w-4" /><span>{locale === "en" ? "AR" : "EN"}</span></button>
        <button type="button" onClick={toggleTheme} className="preference-button" aria-label={copy.nav.theme}>{theme === "dark" ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}</button>
      </div>
      <div className="ambient-orb -left-32 -top-32 h-96 w-96 bg-emerald-400/[0.10] blur-3xl" />
      <div className="ambient-orb -bottom-40 -right-32 h-[28rem] w-[28rem] bg-sky-400/[0.08] blur-3xl" />

      <div className="auth-frame">
        <section className="auth-showcase">
          <div className="auth-mesh" />
          <div className="relative z-10"><BrandLogo /></div>

          <div className="relative z-10 my-12 max-w-lg fade-up">
            <div className="eyebrow"><SparklesIcon className="h-3.5 w-3.5" />{copy.auth.smart}</div>
            <h2 className="hero-title mt-6 text-5xl font-black leading-[1.02]">{copy.auth.sideTitle}</h2>
            <p className="mt-6 text-base leading-8 text-slate-400">{copy.auth.sideDesc}</p>
            <div className="mt-8 space-y-3">
              {[copy.auth.benefit1, copy.auth.benefit2, copy.auth.benefit3].map((item) => (
                <div key={item} className="auth-benefit">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300"><CheckIcon className="h-4 w-4" /></span>
                  <span className="text-sm font-semibold text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3 text-xs text-slate-500"><ShieldIcon className="h-4 w-4 text-emerald-400" />{copy.auth.securePatient}</div>
        </section>

        <section className="auth-form-side">
          <div className="w-full max-w-lg fade-up">
            <div className="mb-8 flex items-center justify-between gap-4 lg:hidden">
              <BrandLogo />
              <Link href="/" className="text-sm font-semibold text-slate-400 transition hover:text-white">{copy.auth.home}</Link>
            </div>

            <div className="mb-8">
              <div className="eyebrow"><BadgeCheckIcon className="h-3.5 w-3.5" />{eyebrow}</div>
              <h1 className="mt-5 text-4xl font-black tracking-[-0.045em] sm:text-5xl">{title}</h1>
              <p className="mt-4 leading-7 text-slate-400">{description}</p>
            </div>

            <div className="auth-form-card">{children}</div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-slate-500">
              <div className="auth-mini-proof"><ShieldIcon className="h-4 w-4 text-emerald-400" />{copy.auth.secureSession}</div>
              <div className="auth-mini-proof"><CalendarIcon className="h-4 w-4 text-sky-400" />{copy.auth.easyBooking}</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
