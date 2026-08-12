"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useAppSettings } from "@/components/providers/app-settings-provider";
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  StethoscopeIcon,
  UserRoundIcon,
} from "@/components/ui/icons";
import {
  getAppointmentSummary,
  getMyAppointments,
  type AppointmentResponse,
  type AppointmentSummary,
} from "@/lib/api/appointments";
import { getCurrentUser, type AuthUser } from "@/lib/api/auth";
import { formatAppointmentDate, localizeApiMessage, localizeSpecialty } from "@/lib/i18n";

function statusClasses(status: AppointmentResponse["status"]): string {
  if (status === "confirmed") return "bg-emerald-400/10 text-emerald-300";
  if (status === "completed") return "bg-cyan-400/10 text-cyan-300";
  if (status === "cancelled") return "bg-rose-400/10 text-rose-300";
  return "bg-amber-400/10 text-amber-200";
}

export function DashboardClient() {
  const { copy, locale, isRtl } = useAppSettings();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [summary, setSummary] = useState<AppointmentSummary | null>(null);
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadDashboard() {
      try {
        const currentUser = await getCurrentUser();
        if (!active) return;
        setUser(currentUser);
        if (!currentUser) return;
        const [summaryData, appointmentData] = await Promise.all([
          getAppointmentSummary(),
          getMyAppointments(),
        ]);
        if (active) {
          setSummary(summaryData);
          setAppointments(appointmentData);
        }
      } catch (caughtError) {
        if (active) setError(caughtError instanceof Error ? localizeApiMessage(caughtError.message, locale) : copy.dashboard.loadError);
      } finally {
        if (active) setIsLoading(false);
      }
    }
    void loadDashboard();
    return () => { active = false; };
  }, [copy.dashboard.loadError, locale]);

  if (isLoading) {
    return <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8"><div className="h-12 w-72 animate-pulse rounded-2xl bg-white/6" /><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[0,1,2,3].map((item) => <div key={item} className="h-36 animate-pulse rounded-3xl bg-white/5" />)}</div></div>;
  }

  if (!user) return null;

  const statusLabel = (status: AppointmentResponse["status"]) => copy.appointments[status];
  const cards = [
    { label: copy.dashboard.upcoming, value: summary?.upcoming ?? 0, icon: <CalendarIcon className="h-6 w-6" />, accent: "text-cyan-300 bg-cyan-400/10" },
    { label: copy.dashboard.confirmed, value: summary?.confirmed ?? 0, icon: <CheckCircleIcon className="h-6 w-6" />, accent: "text-emerald-300 bg-emerald-400/10" },
    { label: copy.dashboard.pending, value: summary?.pending ?? 0, icon: <ClockIcon className="h-6 w-6" />, accent: "text-amber-200 bg-amber-400/10" },
    { label: copy.dashboard.completed, value: summary?.completed ?? 0, icon: <StethoscopeIcon className="h-6 w-6" />, accent: "text-violet-300 bg-violet-400/10" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div><p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-300">{copy.dashboard.eyebrow}</p><h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{copy.dashboard.welcome}, {user.fullName.split(" ")[0]}.</h1><p className="mt-4 max-w-2xl leading-7 text-slate-400">{copy.dashboard.subtitle}</p></div>
        <Link href="/doctors" className="primary-button px-6 py-3.5">{copy.dashboard.bookNew}<ArrowRightIcon className={`h-5 w-5 ${isRtl ? "rotate-180" : ""}`} /></Link>
      </div>

      {error && <div className="form-error mt-7">{error}</div>}

      <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => <article key={card.label} className="glass-panel rounded-3xl p-5"><div className="flex items-center justify-between"><span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.accent}`}>{card.icon}</span><span className="text-3xl font-black">{card.value}</span></div><p className="mt-5 text-sm font-bold text-slate-300">{card.label}</p></article>)}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">{copy.dashboard.upcoming}</p><h2 className="mt-2 text-2xl font-black">{copy.dashboard.upcoming}</h2></div><CalendarIcon className="h-7 w-7 text-cyan-300" /></div>
          {summary?.nextAppointment ? (
            <div className="mt-7 rounded-3xl border border-cyan-400/12 bg-cyan-400/5 p-5">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4"><span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-teal-500 text-xl font-black text-slate-950">{summary.nextAppointment.doctorInitials}</span><div><p className="text-sm font-bold text-cyan-300">{localizeSpecialty(summary.nextAppointment.specialty, locale)}</p><h3 className="mt-1 text-xl font-black">{summary.nextAppointment.doctorName}</h3><p className="mt-1 text-sm text-slate-400">{formatAppointmentDate(summary.nextAppointment.appointmentDate, locale)} · {summary.nextAppointment.appointmentTime}</p></div></div>
                <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${statusClasses(summary.nextAppointment.status)}`}>{statusLabel(summary.nextAppointment.status)}</span>
              </div>
            </div>
          ) : (
            <div className="mt-7 rounded-3xl border border-dashed border-white/12 px-6 py-12 text-center"><CalendarIcon className="mx-auto h-10 w-10 text-slate-600" /><h3 className="mt-4 text-xl font-black">{copy.dashboard.noUpcoming}</h3><p className="mt-2 text-sm text-slate-400">{copy.dashboard.noUpcomingDesc}</p></div>
          )}
        </section>

        <aside className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">{copy.dashboard.summary}</p><h2 className="mt-2 text-2xl font-black">{user.fullName}</h2>
          <div className="mt-7 flex items-center gap-4 rounded-2xl bg-white/4 p-4"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300"><UserRoundIcon className="h-7 w-7" /></span><div className="min-w-0"><p className="truncate font-black">{user.fullName}</p><p className="mt-1 truncate text-sm text-slate-400">{user.email}</p></div></div>
          <div className="mt-5 space-y-3 text-sm"><div className="summary-row"><span>{copy.dashboard.total}</span><strong>{summary?.total ?? 0}</strong></div><div className="summary-row"><span>{copy.dashboard.cancelled}</span><strong className="text-rose-300">{summary?.cancelled ?? 0}</strong></div></div>
        </aside>
      </div>

      <section className="mt-8 glass-panel rounded-[2rem] p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">{copy.dashboard.recentEyebrow}</p><h2 className="mt-2 text-2xl font-black">{copy.dashboard.history}</h2></div><Link href="/appointments" className="font-bold text-cyan-300 transition hover:text-cyan-200">{copy.dashboard.viewAll}</Link></div>
        <div className="mt-6 space-y-3">
          {appointments.slice(0, 4).map((appointment) => <div key={appointment.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-white/7 bg-white/3 p-4 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/6 text-sm font-black text-cyan-200">{appointment.doctorInitials}</span><div><p className="font-bold">{appointment.doctorName}</p><p className="mt-1 text-sm text-slate-500">{formatAppointmentDate(appointment.appointmentDate, locale)} · {appointment.appointmentTime}</p></div></div><span className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${statusClasses(appointment.status)}`}>{statusLabel(appointment.status)}</span></div>)}
          {appointments.length === 0 && <div className="rounded-2xl border border-dashed border-white/10 px-5 py-10 text-center text-slate-400">{copy.dashboard.empty}</div>}
        </div>
      </section>
    </div>
  );
}
