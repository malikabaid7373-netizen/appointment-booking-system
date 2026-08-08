"use client";

import Link from "next/link";

import { AuthNav } from "@/components/auth/auth-nav";
import {
  ActivityIcon,
  ArrowLeftIcon,
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
      className="group flex items-center gap-3"
      aria-label="ClinicCare home"
    >
      <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-emerald-400 text-slate-950 shadow-[0_12px_35px_rgba(52,211,153,0.28)] transition duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3">
        <span className="absolute inset-0 bg-gradient-to-br from-white/55 via-transparent to-transparent" />
        <ActivityIcon className="relative h-6 w-6" />
      </span>
      <span className="text-xl font-extrabold tracking-[-0.04em] text-white sm:text-2xl">
        Clinic<span className="text-emerald-400">Care</span>
      </span>
    </Link>
  );
}

export function SiteHeader({
  backHref,
  backLabel,
  compact = false,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-slate-950/72 backdrop-blur-2xl">
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 sm:px-6 ${
          compact ? "min-h-[4.5rem] py-3" : "min-h-20 py-4"
        }`}
      >
        <div className="flex min-w-0 items-center gap-4">
          <BrandLogo />

          {backHref && backLabel ? (
            <Link
              href={backHref}
              className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-semibold text-slate-300 transition duration-300 hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-white md:flex"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              {backLabel}
            </Link>
          ) : (
            <div className="hidden items-center gap-6 border-l border-white/10 pl-6 lg:flex">
              <Link
                href="/doctors"
                className="text-sm font-semibold text-slate-400 transition hover:text-white"
              >
                Doctors
              </Link>
              <Link
                href="/appointments"
                className="text-sm font-semibold text-slate-400 transition hover:text-white"
              >
                Appointments
              </Link>
            </div>
          )}
        </div>

        <AuthNav />
      </nav>
    </header>
  );
}
