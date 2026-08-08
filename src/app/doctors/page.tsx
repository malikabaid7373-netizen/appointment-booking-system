import { DoctorsList } from "@/components/doctors/doctors-list";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  ShieldIcon,
  SparklesIcon,
  StethoscopeIcon,
} from "@/components/ui/icons";
import { getDoctors } from "@/lib/api/doctors";

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <main className="min-h-screen text-white">
      <SiteHeader backHref="/" backLabel="Back to Home" />

      <section className="relative overflow-hidden border-b border-white/[0.06] px-5 py-16 sm:px-6 sm:py-20">
        <div className="ambient-orb -right-24 top-0 h-80 w-80 bg-emerald-400/[0.08] blur-3xl" />
        <div className="mx-auto max-w-7xl fade-up">
          <div className="eyebrow">
            <StethoscopeIcon className="h-3.5 w-3.5" />
            Our medical team
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <h1 className="hero-title max-w-4xl text-4xl font-black leading-[1.03] sm:text-6xl">
                Find the right specialist for your care.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
                Compare verified doctors, clinical experience, languages,
                consultation fees, and live availability before booking.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                  <ShieldIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-white">Verified availability</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Available slots are loaded directly from the clinic system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-2 text-sm font-semibold text-slate-500">
            <SparklesIcon className="h-4 w-4 text-emerald-400" />
            Search and compare {doctors.length} clinic doctors
          </div>
          <DoctorsList doctors={doctors} />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
