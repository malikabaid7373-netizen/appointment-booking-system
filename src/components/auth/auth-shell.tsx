import Link from "next/link";
import type { ReactNode } from "react";

import { BrandLogo } from "@/components/layout/site-header";
import {
  BadgeCheckIcon,
  CalendarIcon,
  CheckIcon,
  ShieldIcon,
  SparklesIcon,
} from "@/components/ui/icons";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-6 text-white sm:px-6 lg:flex lg:items-stretch lg:p-6">
      <div className="ambient-orb -left-32 -top-32 h-96 w-96 bg-emerald-400/[0.09] blur-3xl" />
      <div className="ambient-orb -bottom-40 -right-32 h-[28rem] w-[28rem] bg-sky-400/[0.07] blur-3xl" />

      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-7xl overflow-hidden rounded-[2rem] border border-white/[0.07] bg-slate-950/45 shadow-2xl shadow-slate-950/50 backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden overflow-hidden border-r border-white/[0.07] bg-gradient-to-br from-emerald-400/[0.09] via-slate-900/60 to-sky-400/[0.06] p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute -right-24 top-20 h-72 w-72 rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] float-slow" />
          <div className="absolute -bottom-16 -left-12 h-64 w-64 rounded-[4rem] border border-sky-400/10 bg-sky-400/[0.03] float-reverse" />

          <div className="relative z-10">
            <BrandLogo />
          </div>

          <div className="relative z-10 my-12 max-w-lg fade-up">
            <div className="eyebrow">
              <SparklesIcon className="h-3.5 w-3.5" />
              Smart patient experience
            </div>
            <h2 className="hero-title mt-6 text-5xl font-black leading-[1.02]">
              Your healthcare journey, organized beautifully.
            </h2>
            <p className="mt-6 text-base leading-8 text-slate-400">
              Find doctors, choose real appointment times, and keep every
              booking secure in one simple account.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "Live doctor availability",
                "Protected patient bookings",
                "Easy status tracking and cancellation",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold text-slate-300">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3 text-xs text-slate-500">
            <ShieldIcon className="h-4 w-4 text-emerald-400" />
            Secure authentication and patient-owned appointments
          </div>
        </section>

        <section className="flex items-center justify-center p-5 sm:p-10 xl:p-14">
          <div className="w-full max-w-lg fade-up">
            <div className="mb-8 flex items-center justify-between gap-4 lg:hidden">
              <BrandLogo />
              <Link
                href="/"
                className="text-sm font-semibold text-slate-400 transition hover:text-white"
              >
                Home
              </Link>
            </div>

            <div className="mb-8">
              <div className="eyebrow">
                <BadgeCheckIcon className="h-3.5 w-3.5" />
                {eyebrow}
              </div>
              <h1 className="mt-5 text-4xl font-black tracking-[-0.045em] sm:text-5xl">
                {title}
              </h1>
              <p className="mt-4 leading-7 text-slate-400">{description}</p>
            </div>

            {children}

            <div className="mt-8 grid grid-cols-2 gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-3 py-3">
                <ShieldIcon className="h-4 w-4 text-emerald-400" />
                Secure session
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-3 py-3">
                <CalendarIcon className="h-4 w-4 text-sky-400" />
                Easy booking
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
