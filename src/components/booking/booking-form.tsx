"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

import {
  createAppointment,
  type AppointmentResponse,
} from "@/lib/api/appointments";
import { getAvailableDoctorSlots } from "@/lib/api/doctors";
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  MailIcon,
  PhoneIcon,
  ShieldIcon,
  SparklesIcon,
  UserIcon,
} from "@/components/ui/icons";

type BookingDoctor = {
  id: number;
  name: string;
  specialty: string;
  consultationFee: number;
  availableDays: string[];
};

type BookingFormProps = {
  doctor: BookingDoctor;
};

function getMinimumDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function BookingForm({ doctor }: BookingFormProps) {
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotsWeekday, setSlotsWeekday] = useState("");
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAppointment, setSubmittedAppointment] =
    useState<AppointmentResponse | null>(null);

  const minimumDate = useMemo(() => getMinimumDate(), []);

  useEffect(() => {
    if (!appointmentDate) {
      return;
    }

    const controller = new AbortController();

    async function loadAvailableSlots() {
      setIsLoadingSlots(true);

      try {
        const response = await getAvailableDoctorSlots(
          doctor.id,
          appointmentDate,
          controller.signal,
        );

        setAvailableSlots(response.slots);
        setSlotsWeekday(response.weekday);
      } catch (caughtError) {
        if (
          caughtError instanceof DOMException &&
          caughtError.name === "AbortError"
        ) {
          return;
        }

        setSlotsError(
          caughtError instanceof Error
            ? caughtError.message
            : "Could not load available times.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingSlots(false);
        }
      }
    }

    void loadAvailableSlots();

    return () => {
      controller.abort();
    };
  }, [appointmentDate, doctor.id]);

  function handleDateChange(value: string) {
    setAppointmentDate(value);
    setAppointmentTime("");
    setAvailableSlots([]);
    setSlotsWeekday("");
    setSlotsError("");
  }

  function resetForm() {
    setPatientName("");
    setPhone("");
    setEmail("");
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

    if (!patientName.trim()) {
      setError("Patient name is required.");
      return;
    }

    if (!phone.trim() || phone.trim().length < 8) {
      setError("Enter a valid phone number.");
      return;
    }

    if (!appointmentDate) {
      setError("Select an appointment date.");
      return;
    }

    if (!appointmentTime) {
      setError("Select an available appointment time.");
      return;
    }

    if (!availableSlots.includes(appointmentTime)) {
      setError("The selected appointment time is no longer available.");
      return;
    }

    setIsSubmitting(true);

    try {
      const appointment = await createAppointment({
        doctorId: doctor.id,
        patientName: patientName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        appointmentDate,
        appointmentTime,
        reason: reason.trim(),
      });

      setSubmittedAppointment(appointment);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Could not create the appointment.";

      setError(message);

      try {
        const refreshedSlots = await getAvailableDoctorSlots(
          doctor.id,
          appointmentDate,
        );

        setAvailableSlots(refreshedSlots.slots);
        setAppointmentTime("");
      } catch {
        // Original appointment error remains visible.
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submittedAppointment) {
    return (
      <div className="glass-panel relative overflow-hidden rounded-[2rem] p-6 fade-up sm:p-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/80 to-transparent" />
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-300 to-emerald-500 text-slate-950 shadow-xl shadow-emerald-500/25">
          <CheckIcon className="h-8 w-8" />
        </div>

        <div className="mx-auto mt-6 max-w-lg text-center">
          <div className="eyebrow">
            <SparklesIcon className="h-3.5 w-3.5" />
            Booking received
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Appointment Requested
          </h2>
          <p className="mt-3 leading-7 text-slate-400">
            Your appointment has been saved successfully. You can now track
            its confirmation from My Appointments.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-emerald-400/15 bg-slate-950/55 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Appointment ID", `#${submittedAppointment.id}`],
              ["Patient", submittedAppointment.patientName],
              ["Doctor", submittedAppointment.doctorName],
              ["Status", submittedAppointment.status],
              ["Date", submittedAppointment.appointmentDate],
              ["Time", submittedAppointment.appointmentTime],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {label}
                </p>
                <p className="mt-1.5 font-bold capitalize text-white">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] px-4 py-3.5">
            <span className="text-sm font-semibold text-slate-300">
              Consultation fee
            </span>
            <span className="font-black text-emerald-300">
              {submittedAppointment.consultationFee} SAR
            </span>
          </div>
        </div>

        <div className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-2">
          <button type="button" onClick={resetForm} className="secondary-button py-3.5">
            Book Another
          </button>
          <Link href="/appointments" className="primary-button py-3.5">
            My Appointments
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel relative overflow-hidden rounded-[2rem] p-6 sm:p-8"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/45 to-transparent" />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="eyebrow">
            <CalendarIcon className="h-3.5 w-3.5" />
            Appointment form
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Book your appointment
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-400">
            Add patient details, choose a date, and select one of the live
            available times.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-500">
          <ShieldIcon className="h-4 w-4 text-emerald-400" />
          Secure booking
        </div>
      </div>

      <div className="mt-7 grid grid-cols-3 gap-2">
        {[
          ["1", "Patient"],
          ["2", "Schedule"],
          ["3", "Confirm"],
        ].map(([number, label]) => (
          <div
            key={number}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.025] px-3 py-3 text-center"
          >
            <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/10 text-xs font-black text-emerald-300">
              {number}
            </span>
            <p className="mt-1.5 text-xs font-semibold text-slate-500">
              {label}
            </p>
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3.5 text-sm text-red-200 fade-in">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="patient-name" className="mb-2 block text-sm font-semibold text-slate-300">
            Patient Name
          </label>
          <div className="relative">
            <UserIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              id="patient-name"
              type="text"
              value={patientName}
              onChange={(event) => setPatientName(event.target.value)}
              placeholder="Enter patient name"
              disabled={isSubmitting}
              className="input-control pl-12"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-300">
            Phone Number
          </label>
          <div className="relative">
            <PhoneIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+966 5X XXX XXXX"
              disabled={isSubmitting}
              className="input-control pl-12"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-300">
            Email <span className="font-normal text-slate-600">(optional)</span>
          </label>
          <div className="relative">
            <MailIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="patient@example.com"
              disabled={isSubmitting}
              className="input-control pl-12"
            />
          </div>
        </div>

        <div>
          <label htmlFor="appointment-date" className="mb-2 block text-sm font-semibold text-slate-300">
            Appointment Date
          </label>
          <input
            id="appointment-date"
            type="date"
            min={minimumDate}
            value={appointmentDate}
            onChange={(event) => handleDateChange(event.target.value)}
            disabled={isSubmitting}
            className="input-control"
          />
        </div>

        <div>
          <label htmlFor="appointment-time" className="mb-2 block text-sm font-semibold text-slate-300">
            Appointment Time
          </label>
          <div className="relative">
            <ClockIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <select
              id="appointment-time"
              value={appointmentTime}
              onChange={(event) => setAppointmentTime(event.target.value)}
              disabled={
                isSubmitting ||
                isLoadingSlots ||
                !appointmentDate ||
                availableSlots.length === 0
              }
              className="input-control cursor-pointer pl-12"
            >
              <option value="">
                {!appointmentDate
                  ? "Select date first"
                  : isLoadingSlots
                    ? "Loading times..."
                    : availableSlots.length === 0
                      ? "No available times"
                      : "Select time"}
              </option>
              {availableSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        {slotsError && (
          <div className="sm:col-span-2 rounded-2xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3.5 text-sm text-red-200">
            {slotsError}
          </div>
        )}

        {appointmentDate && !isLoadingSlots && !slotsError && availableSlots.length === 0 && (
          <div className="sm:col-span-2 rounded-2xl border border-amber-400/20 bg-amber-400/[0.08] px-4 py-3.5 text-sm text-amber-200">
            The doctor has no available appointment times
            {slotsWeekday ? ` on ${slotsWeekday}` : ""}.
          </div>
        )}

        {availableSlots.length > 0 && (
          <div className="sm:col-span-2 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-3.5 text-sm text-emerald-200 fade-in">
            <CheckIcon className="h-5 w-5 shrink-0" />
            {availableSlots.length} available time
            {availableSlots.length === 1 ? "" : "s"}
            {slotsWeekday ? ` on ${slotsWeekday}` : ""}.
          </div>
        )}

        <div className="sm:col-span-2">
          <label htmlFor="reason" className="mb-2 block text-sm font-semibold text-slate-300">
            Reason for Visit <span className="font-normal text-slate-600">(optional)</span>
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={4}
            placeholder="Briefly describe the reason for your visit..."
            disabled={isSubmitting}
            className="input-control resize-none py-3"
          />
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/[0.07] bg-slate-950/45 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              Booking summary
            </p>
            <p className="mt-2 font-bold text-white">{doctor.name}</p>
            <p className="mt-1 text-sm text-slate-500">{doctor.specialty}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-semibold text-slate-500">Consultation fee</p>
            <p className="mt-1 text-2xl font-black text-emerald-300">
              {doctor.consultationFee} SAR
            </p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isLoadingSlots || !appointmentTime}
        className="primary-button mt-6 w-full py-4"
      >
        {isSubmitting ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-slate-950/30 border-t-slate-950 spin-slow" />
            Saving Appointment...
          </>
        ) : (
          <>
            Confirm Appointment
            <ArrowRightIcon className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
