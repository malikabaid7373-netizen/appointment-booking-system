"use client";

import { BookingForm } from "@/components/booking/booking-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import { BadgeCheckIcon, ClockIcon, ShieldIcon, StarIcon } from "@/components/ui/icons";
import type { Doctor } from "@/lib/api/doctors";
import { localizeSpecialty, localizeWeekday } from "@/lib/i18n";

export function BookAppointmentClient({ doctor }: { doctor: Doctor }) {
  const { copy, locale } = useAppSettings();
  return (
    <main className="min-h-screen text-white">
      <SiteHeader backHref={`/doctors/${doctor.id}`} backLabel={copy.booking.backDoctor} />
      <section className="relative overflow-hidden px-5 py-12 sm:px-6 sm:py-16">
        <div className="ambient-orb -right-28 top-20 h-80 w-80 bg-sky-400/[0.06] blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[350px_minmax(0,1fr)]">
          <aside className="glass-panel h-fit rounded-[2rem] p-6 fade-up lg:sticky lg:top-28">
            <div className="flex items-start gap-4">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-300 via-emerald-400 to-emerald-600 text-2xl font-black text-slate-950 shadow-xl shadow-emerald-500/20">{doctor.initials}<span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-900 bg-slate-950 text-emerald-400"><BadgeCheckIcon className="h-4 w-4" /></span></div>
              <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-400">{localizeSpecialty(doctor.specialty, locale)}</p><h1 className="mt-1.5 text-xl font-black leading-tight">{doctor.name}</h1><p className="mt-2 text-sm leading-5 text-slate-500">{doctor.qualification}</p></div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="metric-card"><ClockIcon className="h-5 w-5 text-sky-400" /><p>{copy.booking.experience}</p><strong>{doctor.experience} {copy.common.years}</strong></div>
              <div className="metric-card"><StarIcon className="h-5 w-5 fill-amber-300 text-amber-300" /><p>{copy.booking.rating}</p><strong>{doctor.rating} / 5</strong></div>
            </div>
            <div className="mt-5 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] p-4"><div className="flex items-center justify-between gap-4"><span className="text-sm font-semibold text-slate-300">{copy.booking.consultationFee}</span><span className="font-black text-emerald-300">{doctor.consultationFee} {copy.common.sar}</span></div></div>
            <div className="mt-6 border-t border-white/[0.07] pt-6"><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{copy.booking.availableDays}</p>{doctor.availableDays.length > 0 ? <div className="mt-3 flex flex-wrap gap-2">{doctor.availableDays.map((day) => <span key={day} className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-xs font-semibold text-slate-300">{localizeWeekday(day, locale)}</span>)}</div> : <p className="mt-3 text-sm text-slate-500">{copy.booking.noSchedule}</p>}</div>
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"><ShieldIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" /><p className="text-xs leading-5 text-slate-500">{copy.booking.secureAccount}</p></div>
          </aside>
          <div className="min-w-0 fade-up [animation-delay:100ms]"><BookingForm doctor={doctor} /></div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
