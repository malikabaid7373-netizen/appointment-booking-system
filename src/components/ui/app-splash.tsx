"use client";

import { useEffect, useState } from "react";

import { ActivityIcon } from "@/components/ui/icons";
import { useAppSettings } from "@/components/providers/app-settings-provider";

export function AppSplash() {
  const { copy } = useAppSettings();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const key = "cliniccare_splash_seen";
    if (sessionStorage.getItem(key)) {
      const timeout = window.setTimeout(() => setVisible(false), 0);
      return () => window.clearTimeout(timeout);
    }

    sessionStorage.setItem(key, "1");
    const timeout = window.setTimeout(() => setVisible(false), 1250);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div className="splash-screen" role="status" aria-live="polite">
      <div className="splash-aura" />
      <div className="splash-mark-wrap">
        <span className="splash-orbit splash-orbit-one" />
        <span className="splash-orbit splash-orbit-two" />
        <span className="splash-mark">
          <ActivityIcon className="h-10 w-10" />
        </span>
      </div>
      <div className="mt-7 text-center">
        <h1 className="splash-wordmark">Clinic<span>Care</span></h1>
        <p className="mt-2 text-sm font-semibold tracking-wide text-slate-400">{copy.splash.tagline}</p>
        <div className="splash-progress mt-6"><span /></div>
        <p className="mt-3 text-xs text-slate-500">{copy.splash.loading}</p>
      </div>
    </div>
  );
}
