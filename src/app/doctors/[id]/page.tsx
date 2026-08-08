import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  ShieldIcon,
  StarIcon,
  StethoscopeIcon,
} from "@/components/ui/icons";
import { getDoctor } from "@/lib/api/doctors";

type DoctorDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DoctorDetailsPage({
  params,
}: DoctorDetailsPageProps) {
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
      <SiteHeader backHref="/doctors" backLabel="Back to Doctors" />

      <section className="relative overflow-hidden px-5 py-12 sm:px-6 sm:py-16">
        <div className="ambient-orb -left-24 top-12 h-72 w-72 bg-emerald-400/[0.07] blur-3xl" />
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500 fade-in">
            <Link href="/doctors" className="transition hover:text-white">
              Doctors
            </Link>
            <span>/</span>
            <span className="text-slate-300">{doctor.name}</span>
          </div>

          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_380px]">
            <section className="glass-panel min-w-0 overflow-hidden rounded-[2rem] p-6 fade-up sm:p-8">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />

              <div className="flex flex-col gap-7 sm:flex-row sm:items-start">
                <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-emerald-300 via-emerald-400 to-emerald-600 text-3xl font-black text-slate-950 shadow-2xl shadow-emerald-500/20">
                  {doctor.initials}
                  <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-slate-900 bg-slate-950 text-emerald-400">
                    <BadgeCheckIcon className="h-5 w-5" />
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col justify-between gap-4 xl:flex-row">
                    <div className="min-w-0">
                      <p className="text-sm font-bold uppercase tracking-[0.12em] text-emerald-400">
                        {doctor.specialty}
                      </p>
                      <h1 className="mt-2 break-words text-3xl font-black tracking-[-0.04em] sm:text-5xl">
                        {doctor.name}
                      </h1>
                      <p className="mt-3 leading-7 text-slate-400">
                        {doctor.qualification}
                      </p>
                    </div>

                    <span
                      className={`h-fit w-fit shrink-0 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide ${
                        doctor.availableToday
                          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                          : "border-amber-400/20 bg-amber-400/10 text-amber-300"
                      }`}
                    >
                      {doctor.availableToday
                        ? "Available Today"
                        : "Next Available"}
                    </span>
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/[0.07] bg-slate-950/45 p-4">
                      <ClockIcon className="h-5 w-5 text-sky-400" />
                      <p className="mt-3 text-xs font-semibold text-slate-500">
                        Experience
                      </p>
                      <p className="mt-1 text-lg font-bold">
                        {doctor.experience} years
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.07] bg-slate-950/45 p-4">
                      <StarIcon className="h-5 w-5 fill-amber-300 text-amber-300" />
                      <p className="mt-3 text-xs font-semibold text-slate-500">
                        Patient rating
                      </p>
                      <p className="mt-1 text-lg font-bold">
                        {doctor.rating} / 5
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.07] bg-slate-950/45 p-4">
                      <StethoscopeIcon className="h-5 w-5 text-emerald-400" />
                      <p className="mt-3 text-xs font-semibold text-slate-500">
                        Consultation
                      </p>
                      <p className="mt-1 text-lg font-bold text-emerald-300">
                        {doctor.consultationFee} SAR
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid gap-6 border-t border-white/[0.07] pt-8 lg:grid-cols-[1.3fr_0.7fr]">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">
                    About the Doctor
                  </h2>
                  <p className="mt-4 leading-8 text-slate-400">
                    {doctor.about}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <ShieldIcon className="h-5 w-5 text-emerald-400" />
                    Patient-first care
                  </div>
                  <div className="mt-4 space-y-3 text-sm text-slate-400">
                    <p className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-emerald-400" />
                      Verified clinic profile
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-emerald-400" />
                      Live appointment slots
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-emerald-400" />
                      Secure online booking
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-9 border-t border-white/[0.07] pt-8">
                <h2 className="text-2xl font-black tracking-tight">
                  Languages
                </h2>

                {doctor.languages.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {doctor.languages.map((language) => (
                      <span
                        key={language}
                        className="rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2 text-sm font-semibold text-slate-300"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-slate-500">
                    No languages listed.
                  </p>
                )}
              </div>
            </section>

            <aside className="glass-panel h-fit rounded-[2rem] p-6 fade-up [animation-delay:100ms] lg:sticky lg:top-28">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-400">
                    Clinic schedule
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    Available Days
                  </h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                  <CalendarIcon className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Choose a date on the next step to load the exact available
                times.
              </p>

              {doctor.availableDays.length > 0 ? (
                <div className="mt-6 space-y-3">
                  {doctor.availableDays.map((day) => (
                    <div
                      key={day}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-slate-950/45 px-4 py-3.5"
                    >
                      <span className="font-semibold text-slate-200">
                        {day}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        Open
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-6 rounded-2xl border border-white/[0.07] bg-slate-950/45 px-4 py-4 text-sm text-slate-500">
                  No schedule is currently available.
                </p>
              )}

              <Link
                href={`/doctors/${doctor.id}/book`}
                className="primary-button mt-6 w-full py-3.5"
              >
                Book Appointment
                <ArrowRightIcon className="h-4 w-4" />
              </Link>

              <p className="mt-4 text-center text-xs leading-5 text-slate-600">
                You can review all booking details before confirming.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
