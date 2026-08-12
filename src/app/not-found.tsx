"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/layout/site-header";
import { useAppSettings } from "@/components/providers/app-settings-provider";

export default function NotFound() {
  const { copy } = useAppSettings();
  return (
    <main className="grid min-h-screen place-items-center px-6 text-white">
      <div className="max-w-lg text-center">
        <div className="flex justify-center"><BrandLogo /></div>
        <p className="mt-10 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">{copy.states.notFoundEyebrow}</p>
        <h1 className="mt-4 text-4xl font-black">{copy.states.notFoundTitle}</h1>
        <p className="mt-4 leading-7 text-slate-400">{copy.states.notFoundDesc}</p>
        <Link href="/" className="primary-button mt-8">{copy.states.backHome}</Link>
      </div>
    </main>
  );
}
