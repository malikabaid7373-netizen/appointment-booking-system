"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import {
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  RefreshIcon,
  StethoscopeIcon,
  XIcon,
} from "@/components/ui/icons";
import {
  cancelAppointmentById,
  getMyAppointments,
  type AppointmentResponse,
  type AppointmentStatus,
} from "@/lib/api/appointments";
import { formatAppointmentDate, localizeApiMessage, localizeSpecialty } from "@/lib/i18n";

type FilterStatus = "all" | AppointmentStatus;

function statusClasses(status: AppointmentStatus) {
  if (status === "confirmed") return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  if (status === "completed") return "border-sky-400/20 bg-sky-400/10 text-sky-300";
  if (status === "cancelled") return "border-red-400/20 bg-red-400/10 text-red-300";
  return "border-amber-400/20 bg-amber-400/10 text-amber-300";
}

export default function AppointmentsPage() {
  const { copy, locale, isRtl } = useAppSettings();
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("all");

  const loadAppointments = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      setAppointments(await getMyAppointments());
    } catch (caughtError) {
      setAppointments([]);
      setError(caughtError instanceof Error ? localizeApiMessage(caughtError.message, locale) : copy.appointments.loadError);
    } finally {
      setIsLoading(false);
    }
  }, [copy.appointments.loadError, locale]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void loadAppointments(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadAppointments]);

  const counts = useMemo(() => appointments.reduce((result, appointment) => {
    result.all += 1;
    result[appointment.status] += 1;
    return result;
  }, { all: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 }), [appointments]);

  const filteredAppointments = useMemo(() => selectedStatus === "all" ? appointments : appointments.filter((appointment) => appointment.status === selectedStatus), [appointments, selectedStatus]);

  async function handleCancel(appointmentId: number) {
    if (!window.confirm(copy.appointments.confirmCancel)) return;
    setError("");
    setCancellingId(appointmentId);
    try {
      const updated = await cancelAppointmentById(appointmentId);
      setAppointments((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? localizeApiMessage(caughtError.message, locale) : copy.appointments.cancelError);
    } finally {
      setCancellingId(null);
    }
  }

  const filters: Array<{ value: FilterStatus; label: string }> = [
    { value: "all", label: copy.appointments.all },
    { value: "pending", label: copy.appointments.pending },
    { value: "confirmed", label: copy.appointments.confirmed },
    { value: "completed", label: copy.appointments.completed },
    { value: "cancelled", label: copy.appointments.cancelled },
  ];

  function statusLabel(status: AppointmentStatus) {
    return copy.appointments[status];
  }

  return (
    <main className="min-h-screen text-white">
      <SiteHeader backHref="/" backLabel={copy.appointments.backHome} />

      <section className="relative overflow-hidden border-b border-white/[0.06] px-5 py-14 sm:px-6 sm:py-18">
        <div className="ambient-orb -right-24 top-0 h-80 w-80 bg-sky-400/[0.06] blur-3xl" />
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 sm:flex-row sm:items-end">
          <div className="fade-up">
            <div className="eyebrow"><CalendarIcon className="h-3.5 w-3.5" />{copy.appointments.eyebrow}</div>
            <h1 className="hero-title mt-5 text-4xl font-black tracking-tight sm:text-6xl">{copy.appointments.title}</h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-400">{copy.appointments.description}</p>
          </div>
          <div className="flex gap-3 fade-up [animation-delay:80ms]">
            <button type="button" onClick={() => void loadAppointments()} disabled={isLoading} className="secondary-button"><RefreshIcon className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />{copy.appointments.refresh}</button>
            <Link href="/doctors" className="primary-button">{copy.appointments.bookNew}<ArrowRightIcon className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} /></Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button key={filter.value} type="button" onClick={() => setSelectedStatus(filter.value)} className={`status-filter ${selectedStatus === filter.value ? "status-filter-active" : ""}`}>
                {filter.label}<span>{counts[filter.value]}</span>
              </button>
            ))}
          </div>

          {error && <div className="form-error mt-6">{error}</div>}

          {isLoading ? (
            <div className="mt-7 grid gap-5 lg:grid-cols-2">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="glass-card h-72 animate-pulse rounded-3xl" />)}</div>
          ) : filteredAppointments.length > 0 ? (
            <div className="mt-7 grid gap-5 lg:grid-cols-2">
              {filteredAppointments.map((appointment, index) => (
                <article key={appointment.id} className="glass-card card-hover relative overflow-hidden rounded-[1.75rem] p-5 fade-up sm:p-6" style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-emerald-400 font-black text-slate-950">{appointment.doctorInitials}</div>
                      <div className="min-w-0"><p className="text-sm font-bold text-emerald-400">{localizeSpecialty(appointment.specialty, locale)}</p><h2 className="mt-1 truncate text-xl font-black">{appointment.doctorName}</h2></div>
                    </div>
                    <span className={`rounded-full border px-3 py-1.5 text-xs font-bold ${statusClasses(appointment.status)}`}>{statusLabel(appointment.status)}</span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="metric-card"><CalendarIcon className="h-4 w-4 text-emerald-400" /><p>{copy.appointments.date}</p><strong>{formatAppointmentDate(appointment.appointmentDate, locale)}</strong></div>
                    <div className="metric-card"><ClockIcon className="h-4 w-4 text-sky-400" /><p>{copy.appointments.time}</p><strong>{appointment.appointmentTime}</strong></div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="summary-row"><span>{copy.appointments.id}</span><strong>#{appointment.id}</strong></div>
                    <div className="summary-row"><span>{copy.appointments.fee}</span><strong className="text-emerald-300">{appointment.consultationFee} {copy.common.sar}</strong></div>
                  </div>

                  {appointment.reason && <div className="mt-4 rounded-2xl border border-white/[0.06] bg-slate-950/40 p-4"><p className="text-xs font-semibold text-slate-500">{copy.appointments.reason}</p><p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-300">{appointment.reason}</p></div>}

                  {appointment.canCancel && (
                    <button type="button" onClick={() => void handleCancel(appointment.id)} disabled={cancellingId === appointment.id} className="danger-button mt-5 w-full py-3">
                      <XIcon className="h-4 w-4" />{cancellingId === appointment.id ? copy.appointments.cancelling : copy.appointments.cancel}
                    </button>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="glass-card mt-7 rounded-[2rem] px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-400/10 text-emerald-300"><StethoscopeIcon className="h-8 w-8" /></div>
              <h2 className="mt-5 text-2xl font-black">{copy.appointments.emptyTitle}</h2>
              <p className="mx-auto mt-2 max-w-md leading-7 text-slate-500">{copy.appointments.emptyDesc}</p>
              <Link href="/doctors" className="primary-button mt-6">{copy.appointments.bookNew}<ArrowRightIcon className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} /></Link>
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
