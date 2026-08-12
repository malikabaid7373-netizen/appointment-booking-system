"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useAppSettings } from "@/components/providers/app-settings-provider";
import { ArrowRightIcon, BadgeCheckIcon, SearchIcon, StarIcon, StethoscopeIcon } from "@/components/ui/icons";
import type { Doctor } from "@/lib/api/doctors";
import { localizeSpecialty } from "@/lib/i18n";

type DoctorsListProps = {
  doctors: Doctor[];
  featuredLimit?: number;
  compactFilters?: boolean;
};

export function DoctorsList({ doctors, featuredLimit, compactFilters = false }: DoctorsListProps) {
  const { copy, locale, isRtl } = useAppSettings();
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const specialties = useMemo(() => ["All", ...Array.from(new Set(doctors.map((doctor) => doctor.specialty))).sort()], [doctors]);
  const filteredDoctors = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const matches = doctors.filter((doctor) => {
      const localizedSpecialty = localizeSpecialty(doctor.specialty, locale).toLowerCase();
      const matchesSearch = doctor.name.toLowerCase().includes(normalizedSearch) || doctor.specialty.toLowerCase().includes(normalizedSearch) || localizedSpecialty.includes(normalizedSearch) || doctor.qualification.toLowerCase().includes(normalizedSearch);
      const matchesSpecialty = selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    });
    return typeof featuredLimit === "number" ? matches.slice(0, featuredLimit) : matches;
  }, [doctors, featuredLimit, locale, search, selectedSpecialty]);

  return (
    <>
      {!compactFilters && (
        <div className="glass-panel grid gap-4 rounded-3xl p-4 sm:p-5 md:grid-cols-[1fr_290px]">
          <div>
            <label htmlFor="doctor-search" className="field-label uppercase tracking-[0.12em]">{copy.doctors.searchLabel}</label>
            <div className="field-wrap">
              <SearchIcon className="field-icon-start" />
              <input id="doctor-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={copy.doctors.searchPlaceholder} className="input-control has-start-icon" />
            </div>
          </div>
          <div>
            <label htmlFor="specialty" className="field-label uppercase tracking-[0.12em]">{copy.doctors.specialty}</label>
            <select id="specialty" value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)} className="input-control cursor-pointer">
              {specialties.map((specialty) => <option key={specialty} value={specialty}>{specialty === "All" ? copy.doctors.allSpecialties : localizeSpecialty(specialty, locale)}</option>)}
            </select>
          </div>
        </div>
      )}

      {!compactFilters && (
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{copy.doctors.availableDoctors}</h2><p className="mt-1 text-sm text-slate-500">{copy.doctors.availableDesc}</p></div>
          <div className="mt-2 flex w-fit items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.035] px-3.5 py-2 text-sm font-semibold text-slate-400 sm:mt-0"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.75)]" />{filteredDoctors.length} {filteredDoctors.length === 1 ? copy.doctors.oneFound : copy.doctors.found}</div>
        </div>
      )}

      {filteredDoctors.length > 0 ? (
        <div className={`${compactFilters ? "" : "mt-6"} grid gap-5 md:grid-cols-2 xl:grid-cols-3`}>
          {filteredDoctors.map((doctor, index) => (
            <article key={doctor.id} className="glass-card card-hover group relative overflow-hidden rounded-3xl p-5 fade-up sm:p-6" style={{ animationDelay: `${Math.min(index, 5) * 70}ms` }}>
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/0 to-transparent transition duration-500 group-hover:via-emerald-300/60" />
              <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-400/[0.04] blur-2xl transition duration-500 group-hover:bg-emerald-400/[0.09]" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="doctor-avatar">{doctor.initials}<span><BadgeCheckIcon className="h-4 w-4" /></span></div>
                <span className={`rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide ${doctor.availableToday ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border-amber-400/20 bg-amber-400/10 text-amber-300"}`}>{doctor.availableToday ? copy.doctors.availableToday : copy.doctors.nextAvailable}</span>
              </div>
              <div className="relative mt-6"><p className="text-sm font-bold text-emerald-400">{localizeSpecialty(doctor.specialty, locale)}</p><h3 className="mt-1.5 text-xl font-extrabold tracking-tight text-white">{doctor.name}</h3><p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">{doctor.qualification}</p></div>
              <div className="relative mt-5 grid grid-cols-2 gap-3">
                <div className="metric-card"><p>{copy.doctors.experience}</p><strong>{doctor.experience} {copy.common.years}</strong></div>
                <div className="metric-card"><p>{copy.doctors.patientRating}</p><strong className="flex items-center gap-1.5"><StarIcon className="h-4 w-4 fill-amber-300 text-amber-300" />{doctor.rating}</strong></div>
              </div>
              <div className="relative mt-4 flex items-center justify-between gap-4 border-t border-white/[0.07] pt-4">
                <div><p className="text-xs font-semibold text-slate-500">{copy.doctors.consultationFee}</p><p className="mt-1 text-lg font-black text-emerald-300">{doctor.consultationFee} {copy.common.sar}</p></div>
                <Link href={`/doctors/${doctor.id}`} className="doctor-card-link" aria-label={`${copy.home.viewDoctor} ${doctor.name}`}><ArrowRightIcon className={`h-5 w-5 ${isRtl ? "rotate-180" : ""}`} /></Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="glass-card mt-6 rounded-3xl border-dashed px-6 py-16 text-center fade-in">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.035] text-slate-500"><StethoscopeIcon className="h-7 w-7" /></div>
          <h3 className="mt-5 text-xl font-bold text-white">{copy.doctors.noDoctors}</h3><p className="mt-2 text-slate-500">{copy.doctors.noDoctorsDesc}</p>
          <button type="button" onClick={() => { setSearch(""); setSelectedSpecialty("All"); }} className="secondary-button mt-6">{copy.doctors.clearFilters}</button>
        </div>
      )}
    </>
  );
}
