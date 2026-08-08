"use client";

import Link from "next/link";

import { BrandLogo } from "@/components/layout/site-header";
import { ShieldIcon } from "@/components/ui/icons";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-7 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <BrandLogo />
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
            A simple, secure way to find doctors and manage clinic
            appointments online.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:items-end">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-slate-400">
            <Link href="/doctors" className="transition hover:text-white">
              Doctors
            </Link>
            <Link
              href="/appointments"
              className="transition hover:text-white"
            >
              My Appointments
            </Link>
            <Link href="/login" className="transition hover:text-white">
              Login
            </Link>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldIcon className="h-4 w-4 text-emerald-400" />
            Secure patient experience · ClinicCare
          </div>
        </div>
      </div>
    </footer>
  );
}
