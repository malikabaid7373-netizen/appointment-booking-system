import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { DoctorsList } from "@/components/doctors/doctors-list";
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
import { getDoctors } from "@/lib/api/doctors";

const steps = [
  {
    number: "01",
    title: "Choose a doctor",
    description:
      "Browse specialists, experience, languages, fees, and current availability.",
    icon: StethoscopeIcon,
  },
  {
    number: "02",
    title: "Pick a real slot",
    description:
      "Select a date and choose from appointment times loaded directly from the clinic.",
    icon: CalendarIcon,
  },
  {
    number: "03",
    title: "Manage online",
    description:
      "Track confirmation, view booking details, or cancel securely from your account.",
    icon: ShieldIcon,
  },
];

export default async function HomePage() {
  const doctors = await getDoctors();
  const featuredDoctor = doctors[0];
  const specialtiesCount = new Set(
    doctors.map((doctor) => doctor.specialty),
  ).size;

  return (
    <main className="min-h-screen text-white">
      <SiteHeader />

      <section className="relative overflow-hidden px-5 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20">
        <div className="ambient-orb left-[-8rem] top-12 h-80 w-80 bg-emerald-400/[0.08] blur-3xl" />
        <div className="ambient-orb right-[-7rem] top-4 h-96 w-96 bg-sky-400/[0.07] blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="relative z-10 fade-up">
            <div className="eyebrow">
              <SparklesIcon className="h-3.5 w-3.5" />
              Healthcare made simple
            </div>

            <h1 className="hero-title mt-7 max-w-4xl text-5xl font-black leading-[0.98] sm:text-6xl lg:text-7xl">
              Better care starts with the right appointment.
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              Find trusted doctors, check live availability, and book your
              visit in minutes. No phone calls. No waiting. Just a clear and
              secure patient experience.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/doctors" className="primary-button px-6 py-3.5">
                Find a Doctor
                <ArrowRightIcon className="h-4 w-4" />
              </Link>

              <Link
                href="/appointments"
                className="secondary-button px-6 py-3.5"
              >
                <CalendarIcon className="h-4 w-4 text-emerald-400" />
                My Appointments
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-400" />
                Real-time slots
              </span>
              <span className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-400" />
                Secure account
              </span>
              <span className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-400" />
                Easy cancellation
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="absolute -left-6 top-16 h-24 w-24 rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.05] float-reverse" />
            <div className="absolute -right-2 bottom-12 h-28 w-28 rounded-full border border-sky-400/15 bg-sky-400/[0.04] float-slow" />

            <div className="glass-panel relative overflow-hidden rounded-[2rem] p-5 sm:p-7 fade-up [animation-delay:120ms]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent" />
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
                    Your next visit
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
                    Book with confidence
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                  <BadgeCheckIcon className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-7 rounded-3xl border border-white/[0.08] bg-slate-950/65 p-5 shadow-2xl shadow-slate-950/35">
                {featuredDoctor ? (
                  <>
                    <div className="flex items-start gap-4">
                      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 to-emerald-500 text-xl font-black text-slate-950 shadow-lg shadow-emerald-500/20">
                        {featuredDoctor.initials}
                        <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-slate-950 bg-emerald-400" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="truncate text-lg font-bold">
                              {featuredDoctor.name}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-emerald-400">
                              {featuredDoctor.specialty}
                            </p>
                          </div>
                          <span className="flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-1 text-xs font-bold text-amber-300">
                            <StarIcon className="h-3.5 w-3.5 fill-current" />
                            {featuredDoctor.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-4">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                          <ClockIcon className="h-4 w-4 text-sky-400" />
                          Experience
                        </div>
                        <p className="mt-2 text-lg font-bold">
                          {featuredDoctor.experience} years
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-4">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                          <CalendarIcon className="h-4 w-4 text-emerald-400" />
                          Consultation
                        </div>
                        <p className="mt-2 text-lg font-bold text-emerald-300">
                          {featuredDoctor.consultationFee} SAR
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/doctors/${featuredDoctor.id}`}
                      className="primary-button mt-5 w-full py-3.5"
                    >
                      View Doctor
                      <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  </>
                ) : (
                  <p className="py-10 text-center text-slate-500">
                    Doctors will appear here when the clinic is online.
                  </p>
                )}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] px-3 py-4 text-center">
                  <p className="text-2xl font-black text-white">
                    {doctors.length}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Doctors
                  </p>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] px-3 py-4 text-center">
                  <p className="text-2xl font-black text-white">
                    {specialtiesCount}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Specialties
                  </p>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] px-3 py-4 text-center">
                  <p className="text-2xl font-black text-emerald-300">24/7</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Online
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="doctors" className="relative border-y border-white/[0.06] bg-slate-950/35 px-5 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="eyebrow">
                <StethoscopeIcon className="h-3.5 w-3.5" />
                Trusted specialists
              </div>
              <h2 className="mt-5 max-w-3xl text-3xl font-black tracking-[-0.045em] sm:text-5xl">
                Find the doctor who fits your needs.
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                Search by name or specialty, compare experience and fees,
                then continue directly to booking.
              </p>
            </div>

            <Link
              href="/doctors"
              className="secondary-button w-fit shrink-0"
            >
              View all doctors
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10">
            <DoctorsList doctors={doctors} featuredLimit={6} />
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="eyebrow">
              <SparklesIcon className="h-3.5 w-3.5" />
              How it works
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-[-0.045em] sm:text-5xl">
              From search to appointment in three simple steps.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="glass-card card-hover relative overflow-hidden rounded-3xl p-6 fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute right-5 top-3 text-6xl font-black tracking-tighter text-white/[0.035]">
                    {step.number}
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold">{step.title}</h3>
                  <p className="mt-3 leading-7 text-slate-400">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
