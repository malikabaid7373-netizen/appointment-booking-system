"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  RefreshIcon,
  ShieldIcon,
  StethoscopeIcon,
  XIcon,
} from "@/components/ui/icons";
import {
  cancelAppointmentById,
  getMyAppointments,
  type AppointmentResponse,
  type AppointmentStatus,
} from "@/lib/api/appointments";

function getStatusLabel(status: AppointmentStatus): string {
  if (status === "confirmed") return "Confirmed";
  if (status === "completed") return "Completed";
  if (status === "cancelled") return "Cancelled";
  return "Pending";
}

function getStatusClasses(status: AppointmentStatus): string {
  if (status === "confirmed") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  }

  if (status === "completed") {
    return "border-sky-400/20 bg-sky-400/10 text-sky-300";
  }

  if (status === "cancelled") {
    return "border-red-400/20 bg-red-400/10 text-red-300";
  }

  return "border-amber-400/20 bg-amber-400/10 text-amber-300";
}

type FilterStatus = "all" | AppointmentStatus;

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("all");

  const loadAppointments = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setNeedsLogin(false);

    try {
      const data = await getMyAppointments();
      setAppointments(data);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Could not load appointments.";

      setAppointments([]);

      if (message === "Authentication is required.") {
        setNeedsLogin(true);
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadAppointments();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadAppointments]);

  const counts = useMemo(() => {
    return appointments.reduce(
      (result, appointment) => {
        result.all += 1;
        result[appointment.status] += 1;
        return result;
      },
      {
        all: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
      },
    );
  }, [appointments]);

  const filteredAppointments = useMemo(
    () =>
      selectedStatus === "all"
        ? appointments
        : appointments.filter(
            (appointment) => appointment.status === selectedStatus,
          ),
    [appointments, selectedStatus],
  );

  async function handleCancel(appointmentId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setCancellingId(appointmentId);

    try {
      const updatedAppointment = await cancelAppointmentById(appointmentId);

      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment.id === updatedAppointment.id
            ? updatedAppointment
            : appointment,
        ),
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not cancel the appointment.",
      );
    } finally {
      setCancellingId(null);
    }
  }

  const filters: Array<{ value: FilterStatus; label: string }> = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <main className="min-h-screen text-white">
      <SiteHeader backHref="/" backLabel="Back to Home" />

      <section className="relative overflow-hidden border-b border-white/[0.06] px-5 py-14 sm:px-6 sm:py-20">
        <div className="ambient-orb -right-20 top-4 h-72 w-72 bg-emerald-400/[0.07] blur-3xl" />
        <div className="mx-auto max-w-7xl fade-up">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="eyebrow">
                <CalendarIcon className="h-3.5 w-3.5" />
                Patient bookings
              </div>
              <h1 className="hero-title mt-5 text-4xl font-black sm:text-6xl">
                My Appointments
              </h1>
              <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                Track your upcoming visits, confirmation status, consultation
                details, and booking history from one place.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void loadAppointments()}
                disabled={isLoading}
                className="secondary-button"
              >
                <RefreshIcon
                  className={`h-4 w-4 ${isLoading ? "spin-slow" : ""}`}
                />
                Refresh
              </button>

              <Link href="/doctors" className="primary-button">
                Book Appointment
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {error && (
            <div className="mt-6 max-w-2xl rounded-2xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3.5 text-sm text-red-200">
              {error}
            </div>
          )}
        </div>
      </section>

      <section className="px-5 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-7xl">
          {isLoading ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="glass-card shimmer h-72 rounded-3xl"
                />
              ))}
            </div>
          ) : needsLogin ? (
            <div className="glass-panel mx-auto max-w-2xl rounded-[2rem] px-6 py-16 text-center fade-up">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-400/10 text-emerald-300">
                <ShieldIcon className="h-8 w-8" />
              </div>
              <h2 className="mt-6 text-3xl font-black">Login required</h2>
              <p className="mt-3 text-slate-400">
                Sign in securely to view and manage your appointments.
              </p>
              <Link href="/login" className="primary-button mt-7 px-7 py-3.5">
                Login to Continue
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          ) : appointments.length === 0 ? (
            <div className="glass-panel mx-auto max-w-2xl rounded-[2rem] px-6 py-16 text-center fade-up">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-400/10 text-emerald-300">
                <StethoscopeIcon className="h-8 w-8" />
              </div>
              <h2 className="mt-6 text-3xl font-black">
                No appointments yet
              </h2>
              <p className="mt-3 text-slate-400">
                Choose a doctor and create your first clinic appointment.
              </p>
              <Link href="/doctors" className="primary-button mt-7 px-7 py-3.5">
                Explore Doctors
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="glass-card overflow-x-auto rounded-3xl p-2">
                <div className="flex min-w-max gap-2">
                  {filters.map((filter) => (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() => setSelectedStatus(filter.value)}
                      className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
                        selectedStatus === filter.value
                          ? "bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20"
                          : "text-slate-400 hover:bg-white/[0.045] hover:text-white"
                      }`}
                    >
                      {filter.label}
                      <span
                        className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                          selectedStatus === filter.value
                            ? "bg-slate-950/15"
                            : "bg-white/[0.06]"
                        }`}
                      >
                        {counts[filter.value]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {filteredAppointments.length === 0 ? (
                <div className="glass-card mt-6 rounded-3xl px-6 py-14 text-center">
                  <p className="font-semibold text-slate-400">
                    No {selectedStatus} appointments found.
                  </p>
                </div>
              ) : (
                <div className="mt-6 grid gap-5 lg:grid-cols-2">
                  {filteredAppointments.map((appointment, index) => (
                    <article
                      key={appointment.id}
                      className="glass-card card-hover relative overflow-hidden rounded-3xl p-6 fade-up"
                      style={{ animationDelay: `${Math.min(index, 5) * 70}ms` }}
                    >
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/35 to-transparent" />

                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                            <StethoscopeIcon className="h-6 w-6" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-emerald-400">
                              {appointment.specialty}
                            </p>
                            <h2 className="mt-1 truncate text-xl font-black">
                              {appointment.doctorName}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                              Appointment #{appointment.id}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide ${getStatusClasses(
                            appointment.status,
                          )}`}
                        >
                          {getStatusLabel(appointment.status)}
                        </span>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white/[0.06] bg-slate-950/45 p-4">
                          <CalendarIcon className="h-5 w-5 text-emerald-400" />
                          <p className="mt-2 text-xs font-semibold text-slate-500">
                            Date
                          </p>
                          <p className="mt-1 font-bold">
                            {appointment.appointmentDate}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/[0.06] bg-slate-950/45 p-4">
                          <ClockIcon className="h-5 w-5 text-sky-400" />
                          <p className="mt-2 text-xs font-semibold text-slate-500">
                            Time
                          </p>
                          <p className="mt-1 font-bold">
                            {appointment.appointmentTime}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3.5">
                        <div>
                          <p className="text-xs font-semibold text-slate-500">
                            Patient
                          </p>
                          <p className="mt-1 font-bold text-slate-200">
                            {appointment.patientName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-slate-500">
                            Fee
                          </p>
                          <p className="mt-1 font-black text-emerald-300">
                            {appointment.consultationFee} SAR
                          </p>
                        </div>
                      </div>

                      {appointment.reason && (
                        <div className="mt-4 border-t border-white/[0.07] pt-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                            Reason for visit
                          </p>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                            {appointment.reason}
                          </p>
                        </div>
                      )}

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <Link
                          href={`/doctors/${appointment.doctorId}`}
                          className="secondary-button flex-1"
                        >
                          View Doctor
                        </Link>

                        {(appointment.status === "pending" ||
                          appointment.status === "confirmed") && (
                          <button
                            type="button"
                            onClick={() => handleCancel(appointment.id)}
                            disabled={cancellingId === appointment.id}
                            className="danger-button flex-1"
                          >
                            {cancellingId === appointment.id ? (
                              <>
                                <span className="h-4 w-4 rounded-full border-2 border-red-300/30 border-t-red-200 spin-slow" />
                                Cancelling...
                              </>
                            ) : (
                              <>
                                <XIcon className="h-4 w-4" />
                                Cancel Appointment
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
