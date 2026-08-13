"use client";

import Link from "next/link";

import { DoctorsList } from "@/components/doctors/doctors-list";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  ShieldIcon,
  SparklesIcon,
  StarIcon,
  StethoscopeIcon,
} from "@/components/ui/icons";
import { localizeSpecialty } from "@/lib/i18n";
import type { Doctor } from "@/lib/api/doctors";

export function HomeClient({ doctors }: { doctors: Doctor[] }) {
  const { copy, locale, isRtl } = useAppSettings();
  const featuredDoctor = doctors[0];
  const specialtiesCount = new Set(doctors.map((doctor) => doctor.specialty)).size;

  const steps = [
    { number: "01", title: copy.home.step1Title, description: copy.home.step1Desc, icon: StethoscopeIcon },
    { number: "02", title: copy.home.step2Title, description: copy.home.step2Desc, icon: CalendarIcon },
    { number: "03", title: copy.home.step3Title, description: copy.home.step3Desc, icon: ShieldIcon },
  ];

  return (
    <main className="min-h-screen text-white">
      <SiteHeader />

      <section className="relative overflow-hidden px-5 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20">
        <div className="ambient-orb left-[-8rem] top-12 h-80 w-80 bg-emerald-400/[0.08] blur-3xl" />
        <div className="ambient-orb right-[-7rem] top-4 h-96 w-96 bg-sky-400/[0.07] blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="relative z-10 fade-up">
            <div className="eyebrow"><SparklesIcon className="h-3.5 w-3.5" />{copy.home.eyebrow}</div>
            <h1 className="hero-title mt-7 max-w-4xl text-[2.65rem] font-black leading-[0.98] sm:text-6xl lg:text-7xl">{copy.home.title}</h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">{copy.home.description}</p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/doctors" className="primary-button px-6 py-3.5">{copy.home.findDoctor}<ArrowRightIcon className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} /></Link>
              <Link href="/appointments" className="secondary-button px-6 py-3.5"><CalendarIcon className="h-4 w-4 text-emerald-400" />{copy.home.myAppointments}</Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
              {[copy.home.point1, copy.home.point2, copy.home.point3].map((item) => <span key={item} className="flex items-center gap-2"><CheckIcon className="h-4 w-4 text-emerald-400" />{item}</span>)}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="absolute -left-6 top-16 h-24 w-24 rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.05] float-reverse" />
            <div className="absolute -right-2 bottom-12 h-28 w-28 rounded-full border border-sky-400/15 bg-sky-400/[0.04] float-slow" />
            <div className="glass-panel relative overflow-hidden rounded-[2rem] p-5 sm:p-7 fade-up [animation-delay:120ms]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent" />
              <div className="flex items-center justify-between gap-4">
                <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">{copy.home.nextVisit}</p><h2 className="mt-2 text-2xl font-extrabold tracking-tight">{copy.home.confidence}</h2></div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"><BadgeCheckIcon className="h-6 w-6" /></div>
              </div>

              <div className="mt-7 rounded-3xl border border-white/[0.08] bg-slate-950/65 p-5 shadow-2xl shadow-slate-950/35">
                {featuredDoctor ? (
                  <>
                    <div className="flex items-start gap-4">
                      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 to-emerald-500 text-xl font-black text-slate-950 shadow-lg shadow-emerald-500/20">{featuredDoctor.initials}<span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-slate-950 bg-emerald-400" /></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div><p className="truncate text-lg font-bold">{featuredDoctor.name}</p><p className="mt-1 text-sm font-semibold text-emerald-400">{localizeSpecialty(featuredDoctor.specialty, locale)}</p></div>
                          <span className="flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-1 text-xs font-bold text-amber-300"><StarIcon className="h-3.5 w-3.5 fill-current" />{featuredDoctor.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 grid grid-cols-1 gap-3 min-[390px]:grid-cols-2">
                      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-4"><div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><ClockIcon className="h-4 w-4 text-sky-400" />{copy.home.experience}</div><p className="mt-2 text-lg font-bold">{featuredDoctor.experience} {copy.common.years}</p></div>
                      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-4"><div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><CalendarIcon className="h-4 w-4 text-emerald-400" />{copy.home.consultation}</div><p className="mt-2 text-lg font-bold text-emerald-300">{featuredDoctor.consultationFee} {copy.common.sar}</p></div>
                    </div>
                    <Link href={`/doctors/${featuredDoctor.id}`} className="primary-button mt-5 w-full py-3.5">{copy.home.viewDoctor}<ArrowRightIcon className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} /></Link>
                  </>
                ) : <div className="py-12 text-center text-slate-500">{copy.doctors.noDoctors}</div>}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                <div className="stat-mini"><p>{doctors.length}</p><span>{copy.home.doctors}</span></div>
                <div className="stat-mini"><p>{specialtiesCount}</p><span>{copy.home.specialties}</span></div>
                <div className="stat-mini"><p>24/7</p><span>{copy.home.availability}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="eyebrow"><SparklesIcon className="h-3.5 w-3.5" />{copy.home.howEyebrow}</div>
            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">{copy.home.howTitle}</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return <article key={step.number} className="glass-card card-hover rounded-3xl p-6 fade-up" style={{ animationDelay: `${index * 80}ms` }}><div className="flex items-center justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300"><Icon className="h-6 w-6" /></span><span className="text-sm font-black text-slate-600">{step.number}</span></div><h3 className="mt-6 text-xl font-extrabold">{step.title}</h3><p className="mt-3 leading-7 text-slate-500">{step.description}</p></article>;
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div><div className="eyebrow"><StethoscopeIcon className="h-3.5 w-3.5" />{copy.home.featuredEyebrow}</div><h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">{copy.home.featuredTitle}</h2><p className="mt-4 max-w-2xl leading-7 text-slate-400">{copy.home.featuredDesc}</p></div>
            <Link href="/doctors" className="secondary-button w-fit">{copy.home.viewAll}<ArrowRightIcon className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} /></Link>
          </div>
          <div className="mt-8"><DoctorsList doctors={doctors} featuredLimit={3} compactFilters /></div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
