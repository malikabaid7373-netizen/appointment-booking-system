"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  ArrowRightIcon,
  BadgeCheckIcon,
  SearchIcon,
  StarIcon,
  StethoscopeIcon,
} from "@/components/ui/icons";
import type { Doctor } from "@/lib/api/doctors";

type DoctorsListProps = {
  doctors: Doctor[];
  featuredLimit?: number;
};

export function DoctorsList({
  doctors,
  featuredLimit,
}: DoctorsListProps) {
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const specialties = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(doctors.map((doctor) => doctor.specialty)),
      ).sort(),
    ],
    [doctors],
  );

  const filteredDoctors = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const matches = doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(normalizedSearch) ||
        doctor.specialty.toLowerCase().includes(normalizedSearch) ||
        doctor.qualification.toLowerCase().includes(normalizedSearch);

      const matchesSpecialty =
        selectedSpecialty === "All" ||
        doctor.specialty === selectedSpecialty;

      return matchesSearch && matchesSpecialty;
    });

    return typeof featuredLimit === "number"
      ? matches.slice(0, featuredLimit)
      : matches;
  }, [doctors, featuredLimit, search, selectedSpecialty]);

  return (
    <>
      <div className="glass-panel grid gap-4 rounded-3xl p-4 sm:p-5 md:grid-cols-[1fr_290px]">
        <div>
          <label
            htmlFor="doctor-search"
            className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500"
          >
            Search doctors
          </label>

          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              id="doctor-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, specialty, or qualification..."
              className="input-control pl-12"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="specialty"
            className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500"
          >
            Specialty
          </label>

          <select
            id="specialty"
            value={selectedSpecialty}
            onChange={(event) => setSelectedSpecialty(event.target.value)}
            className="input-control cursor-pointer"
          >
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Available Doctors
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Verified clinic specialists ready for online booking.
          </p>
        </div>

        <div className="mt-2 flex w-fit items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.035] px-3.5 py-2 text-sm font-semibold text-slate-400 sm:mt-0">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.75)]" />
          {filteredDoctors.length} doctor
          {filteredDoctors.length === 1 ? "" : "s"} found
        </div>
      </div>

      {filteredDoctors.length > 0 ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredDoctors.map((doctor, index) => (
            <article
              key={doctor.id}
              className="glass-card card-hover group relative overflow-hidden rounded-3xl p-5 fade-up sm:p-6"
              style={{ animationDelay: `${Math.min(index, 5) * 70}ms` }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/0 to-transparent transition duration-500 group-hover:via-emerald-300/60" />
              <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-400/[0.04] blur-2xl transition duration-500 group-hover:bg-emerald-400/[0.09]" />

              <div className="relative flex items-start justify-between gap-4">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 via-emerald-400 to-emerald-600 text-xl font-black text-slate-950 shadow-lg shadow-emerald-500/20 transition duration-300 group-hover:-translate-y-1 group-hover:rotate-2">
                  {doctor.initials}
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-900 bg-slate-950 text-emerald-400">
                    <BadgeCheckIcon className="h-4 w-4" />
                  </span>
                </div>

                <span
                  className={`rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide ${
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

              <div className="relative mt-6">
                <p className="text-sm font-bold text-emerald-400">
                  {doctor.specialty}
                </p>
                <h3 className="mt-1.5 text-xl font-extrabold tracking-tight text-white">
                  {doctor.name}
                </h3>
                <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">
                  {doctor.qualification}
                </p>
              </div>

              <div className="relative mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/[0.06] bg-slate-950/45 p-3.5">
                  <p className="text-xs font-semibold text-slate-500">
                    Experience
                  </p>
                  <p className="mt-1.5 font-bold text-white">
                    {doctor.experience} years
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-slate-950/45 p-3.5">
                  <p className="text-xs font-semibold text-slate-500">
                    Patient rating
                  </p>
                  <p className="mt-1.5 flex items-center gap-1.5 font-bold text-white">
                    <StarIcon className="h-4 w-4 fill-amber-300 text-amber-300" />
                    {doctor.rating}
                  </p>
                </div>
              </div>

              <div className="relative mt-4 flex items-center justify-between gap-4 border-t border-white/[0.07] pt-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Consultation fee
                  </p>
                  <p className="mt-1 text-lg font-black text-emerald-300">
                    {doctor.consultationFee} SAR
                  </p>
                </div>

                <Link
                  href={`/doctors/${doctor.id}`}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 transition duration-300 hover:scale-105 hover:bg-emerald-400 hover:text-slate-950"
                  aria-label={`View ${doctor.name}`}
                >
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="glass-card mt-6 rounded-3xl border-dashed px-6 py-16 text-center fade-in">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.035] text-slate-500">
            <StethoscopeIcon className="h-7 w-7" />
          </div>
          <h3 className="mt-5 text-xl font-bold text-white">
            No doctors found
          </h3>
          <p className="mt-2 text-slate-500">
            Try another name or choose a different specialty.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedSpecialty("All");
            }}
            className="secondary-button mt-6"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
