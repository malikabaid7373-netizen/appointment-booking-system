"use client";

import { BrandLogo } from "@/components/layout/site-header";
import { useAppSettings } from "@/components/providers/app-settings-provider";

export default function GlobalError({ reset }: { reset: () => void }) {
  const { copy } = useAppSettings();
  return (
    <main className="grid min-h-screen place-items-center px-6 text-white">
      <div className="glass-panel max-w-lg rounded-3xl p-8 text-center">
        <div className="flex justify-center"><BrandLogo /></div>
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-rose-300">{copy.states.errorEyebrow}</p>
        <h1 className="mt-3 text-3xl font-black">{copy.states.errorTitle}</h1>
        <p className="mt-4 leading-7 text-slate-400">{copy.states.errorDesc}</p>
        <button type="button" onClick={reset} className="primary-button mt-7">{copy.states.retry}</button>
      </div>
    </main>
  );
}
