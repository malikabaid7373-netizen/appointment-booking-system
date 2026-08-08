import { notFound } from "next/navigation";

import { BookingForm } from "@/components/booking/booking-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  BadgeCheckIcon,
  ClockIcon,
  ShieldIcon,
  StarIcon,
} from "@/components/ui/icons";
import { getDoctor } from "@/lib/api/doctors";

type BookAppointmentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BookAppointmentPage({
  params,
}: BookAppointmentPageProps) {
  const { id } = await params;
  const doctorId = Number(id);

  if (!Number.isInteger(doctorId) || doctorId <= 0) {
    notFound();
  }

  const doctor = await getDoctor(doctorId);

  if (!doctor) {
    notFound();
  }

  return (
    <main className="min-h-screen text-white">
      <SiteHeader
        backHref={`/doctors/${doctor.id}`}
        backLabel="Back to Doctor"
      />

      <section className="relative overflow-hidden px-5 py-12 sm:px-6 sm:py-16">
        <div className="ambient-orb -right-28 top-20 h-80 w-80 bg-sky-400/[0.06] blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[350px_minmax(0,1fr)]">
          <aside className="glass-panel h-fit rounded-[2rem] p-6 fade-up lg:sticky lg:top-28">
            <div className="flex items-start gap-4">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-300 via-emerald-400 to-emerald-600 text-2xl font-black text-slate-950 shadow-xl shadow-emerald-500/20">
                {doctor.initials}
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-900 bg-slate-950 text-emerald-400">
                  <BadgeCheckIcon className="h-4 w-4" />
                </span>
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-400">
                  {doctor.specialty}
                </p>
                <h1 className="mt-1.5 text-xl font-black leading-tight">
                  {doctor.name}
                </h1>
                <p className="mt-2 text-sm leading-5 text-slate-500">
                  {doctor.qualification}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/[0.07] bg-slate-950/45 p-4">
                <ClockIcon className="h-5 w-5 text-sky-400" />
                <p className="mt-2 text-xs text-slate-500">Experience</p>
                <p className="mt-1 font-bold">{doctor.experience} years</p>
              </div>
              <div className="rounded-2xl border border-white/[0.07] bg-slate-950/45 p-4">
                <StarIcon className="h-5 w-5 fill-amber-300 text-amber-300" />
                <p className="mt-2 text-xs text-slate-500">Rating</p>
                <p className="mt-1 font-bold">{doctor.rating} / 5</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-slate-300">
                  Consultation fee
                </span>
                <span className="font-black text-emerald-300">
                  {doctor.consultationFee} SAR
                </span>
              </div>
            </div>

            <div className="mt-6 border-t border-white/[0.07] pt-6">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                Available days
              </p>

              {doctor.availableDays.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {doctor.availableDays.map((day) => (
                    <span
                      key={day}
                      className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-xs font-semibold text-slate-300"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">
                  No schedule is currently available.
                </p>
              )}
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
              <ShieldIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <p className="text-xs leading-5 text-slate-500">
                Your booking is attached securely to your logged-in patient
                account.
              </p>
            </div>
          </aside>

          <div className="min-w-0 fade-up [animation-delay:100ms]">
            <BookingForm doctor={doctor} />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
