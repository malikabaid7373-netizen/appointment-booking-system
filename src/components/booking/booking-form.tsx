"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

import { useAppSettings } from "@/components/providers/app-settings-provider";
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  PhoneIcon,
  ShieldIcon,
  SparklesIcon,
  UserRoundIcon,
} from "@/components/ui/icons";
import { createAppointment, type AppointmentResponse } from "@/lib/api/appointments";
import { getCurrentUser, type AuthUser } from "@/lib/api/auth";
import { getAvailableDoctorSlots } from "@/lib/api/doctors";
import { formatAppointmentDate, localizeApiMessage, localizeWeekday } from "@/lib/i18n";

type BookingDoctor = {
  id: number;
  name: string;
  specialty: string;
  consultationFee: number;
  availableDays: string[];
};

type BookingFormProps = { doctor: BookingDoctor };

function getMinimumDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function BookingForm({ doctor }: BookingFormProps) {
  const { copy, locale, isRtl } = useAppSettings();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [phone, setPhone] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotsWeekday, setSlotsWeekday] = useState("");
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAppointment, setSubmittedAppointment] = useState<AppointmentResponse | null>(null);
  const minimumDate = useMemo(() => getMinimumDate(), []);

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!appointmentDate) return;
    const controller = new AbortController();

    async function loadAvailableSlots() {
      setIsLoadingSlots(true);
      setSlotsError("");
      try {
        const response = await getAvailableDoctorSlots(doctor.id, appointmentDate, controller.signal);
        setAvailableSlots(response.slots);
        setSlotsWeekday(response.weekday);
      } catch (caughtError) {
        if (caughtError instanceof DOMException && caughtError.name === "AbortError") return;
        setSlotsError(caughtError instanceof Error ? localizeApiMessage(caughtError.message, locale) : copy.booking.errors.slots);
      } finally {
        if (!controller.signal.aborted) setIsLoadingSlots(false);
      }
    }

    void loadAvailableSlots();
    return () => controller.abort();
  }, [appointmentDate, copy.booking.errors.slots, doctor.id, locale]);

  function handleDateChange(value: string) {
    setAppointmentDate(value);
    setAppointmentTime("");
    setAvailableSlots([]);
    setSlotsWeekday("");
    setSlotsError("");
  }

  function resetForm() {
    setPhone("");
    setAppointmentDate("");
    setAppointmentTime("");
    setReason("");
    setAvailableSlots([]);
    setSlotsWeekday("");
    setSlotsError("");
    setError("");
    setSubmittedAppointment(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!phone.trim() || phone.trim().length < 8) return setError(copy.booking.errors.phone);
    if (!appointmentDate) return setError(copy.booking.errors.date);
    if (!appointmentTime) return setError(copy.booking.errors.time);
    if (!availableSlots.includes(appointmentTime)) return setError(copy.booking.errors.stale);

    setIsSubmitting(true);
    try {
      const appointment = await createAppointment({
        doctorId: doctor.id,
        phone: phone.trim(),
        appointmentDate,
        appointmentTime,
        reason: reason.trim(),
      });
      setSubmittedAppointment(appointment);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? localizeApiMessage(caughtError.message, locale) : copy.booking.errors.create);
      try {
        const refreshed = await getAvailableDoctorSlots(doctor.id, appointmentDate);
        setAvailableSlots(refreshed.slots);
        setAppointmentTime("");
      } catch {
        // Keep original booking error.
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submittedAppointment) {
    return (
      <div className="glass-panel relative overflow-hidden rounded-[2rem] p-6 fade-up sm:p-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/80 to-transparent" />
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-300 to-emerald-500 text-slate-950 shadow-xl shadow-emerald-500/25"><CheckIcon className="h-8 w-8" /></div>
        <div className="mx-auto mt-6 max-w-lg text-center"><div className="eyebrow"><SparklesIcon className="h-3.5 w-3.5" />{copy.booking.received}</div><h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{copy.booking.successTitle}</h2><p className="mt-3 leading-7 text-slate-400">{copy.booking.successDesc}</p></div>

        <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-emerald-400/15 bg-slate-950/55 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [copy.booking.appointmentId, `#${submittedAppointment.id}`],
              [copy.booking.patient, submittedAppointment.patientName],
              [copy.booking.doctor, submittedAppointment.doctorName],
              [copy.booking.status, submittedAppointment.statusLabel],
              [copy.booking.selectedDate, formatAppointmentDate(submittedAppointment.appointmentDate, locale)],
              [copy.booking.selectedTime, submittedAppointment.appointmentTime],
            ].map(([label, value]) => <div key={label} className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1.5 font-bold text-white">{value}</p></div>)}
          </div>
          <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] px-4 py-3.5"><span className="text-sm font-semibold text-slate-300">{copy.booking.consultationFee}</span><span className="font-black text-emerald-300">{submittedAppointment.consultationFee} {copy.common.sar}</span></div>
        </div>

        <div className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-2"><button type="button" onClick={resetForm} className="secondary-button py-3.5">{copy.booking.bookAnother}</button><Link href="/appointments" className="primary-button py-3.5">{copy.booking.myAppointments}<ArrowRightIcon className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} /></Link></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/45 to-transparent" />
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div><div className="eyebrow"><CalendarIcon className="h-3.5 w-3.5" />{copy.booking.eyebrow}</div><h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{copy.booking.title}</h2><p className="mt-3 max-w-2xl leading-7 text-slate-400">{copy.booking.description}</p></div>
        <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-500"><ShieldIcon className="h-4 w-4 text-emerald-400" />{copy.booking.secure}</div>
      </div>

      <div className="mt-7 grid grid-cols-3 gap-2">
        {[["1", copy.booking.patientStep], ["2", copy.booking.scheduleStep], ["3", copy.booking.confirmStep]].map(([number, label]) => <div key={number} className="booking-step"><span>{number}</span><p>{label}</p></div>)}
      </div>

      {error && <div className="form-error mt-6 fade-in">{error}</div>}

      <div className="mt-8 rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.055] p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300"><UserRoundIcon className="h-5 w-5" /></div>
          <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.13em] text-emerald-400">{copy.booking.accountTitle}</p>{user ? <><p className="mt-1 font-bold text-white">{user.fullName}</p><p className="mt-0.5 truncate text-sm text-slate-500">{user.email}</p></> : <p className="mt-2 text-sm text-slate-500">{copy.booking.accountLoading}</p>}</div>
          <CheckCircleIcon className="ms-auto h-5 w-5 shrink-0 text-emerald-400" />
        </div>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="field-label">{copy.booking.phone}</label>
          <div className="field-wrap"><PhoneIcon className="field-icon-start" /><input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={copy.booking.phonePlaceholder} className="input-control has-start-icon" /></div>
        </div>
        <div>
          <label htmlFor="appointment-date" className="field-label">{copy.booking.date}</label>
          <div className="field-wrap"><CalendarIcon className="field-icon-start" /><input id="appointment-date" type="date" min={minimumDate} value={appointmentDate} onChange={(e) => handleDateChange(e.target.value)} className="input-control has-start-icon" /></div>
        </div>
      </div>

      <div className="mt-7">
        <div className="mb-3 flex items-center justify-between gap-4"><label className="text-sm font-semibold text-slate-300">{copy.booking.time}</label>{slotsWeekday && <span className="text-xs font-bold text-emerald-400">{localizeWeekday(slotsWeekday, locale)}</span>}</div>
        {!appointmentDate ? <div className="booking-placeholder"><CalendarIcon className="h-5 w-5" />{copy.booking.selectDateFirst}</div> : isLoadingSlots ? <div className="booking-placeholder"><span className="button-spinner" />{copy.booking.loadingSlots}</div> : slotsError ? <div className="form-error">{slotsError}</div> : availableSlots.length === 0 ? <div className="booking-placeholder"><ClockIcon className="h-5 w-5" />{copy.booking.noSlots}</div> : <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">{availableSlots.map((slot) => <button key={slot} type="button" onClick={() => setAppointmentTime(slot)} className={`slot-button ${appointmentTime === slot ? "slot-button-active" : ""}`}><ClockIcon className="h-4 w-4" />{slot}</button>)}</div>}
      </div>

      <div className="mt-7">
        <div className="mb-2 flex items-center justify-between gap-3"><label htmlFor="reason" className="text-sm font-semibold text-slate-300">{copy.booking.reason}</label><span className="text-xs text-slate-600">{copy.booking.reasonOptional}</span></div>
        <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={4} placeholder={copy.booking.reasonPlaceholder} className="input-control min-h-28 resize-y" />
      </div>

      <div className="mt-8 rounded-3xl border border-white/[0.07] bg-slate-950/50 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.13em] text-slate-500">{copy.booking.summary}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="summary-row"><span>{copy.booking.doctor}</span><strong>{doctor.name}</strong></div>
          <div className="summary-row"><span>{copy.booking.fee}</span><strong>{doctor.consultationFee} {copy.common.sar}</strong></div>
          <div className="summary-row"><span>{copy.booking.selectedDate}</span><strong>{appointmentDate ? formatAppointmentDate(appointmentDate, locale) : copy.booking.notSelected}</strong></div>
          <div className="summary-row"><span>{copy.booking.selectedTime}</span><strong>{appointmentTime || copy.booking.notSelected}</strong></div>
        </div>
      </div>

      <button type="submit" disabled={isSubmitting || isLoadingSlots || !user} className="primary-button mt-7 w-full py-4">{isSubmitting ? <><span className="button-spinner" />{copy.booking.submitting}</> : <>{copy.booking.submit}<ArrowRightIcon className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} /></>}</button>
    </form>
  );
}
