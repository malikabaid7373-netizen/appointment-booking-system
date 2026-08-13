"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAppSettings } from "@/components/providers/app-settings-provider";
import { CalendarIcon, LayoutDashboardIcon, LogOutIcon, UserIcon } from "@/components/ui/icons";
import { getCurrentUser, logoutUser, type AuthUser } from "@/lib/api/auth";

type AuthNavProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

export function AuthNav({ mobile = false, onNavigate }: AuthNavProps) {
  const router = useRouter();
  const { copy } = useAppSettings();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let mounted = true;
    getCurrentUser()
      .then((currentUser) => mounted && setUser(currentUser))
      .catch(() => mounted && setUser(null))
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      setUser(null);
      onNavigate?.();
      router.push("/");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  if (isLoading) {
    return (
      <div className={`session-pill ${mobile ? "w-full justify-center" : ""}`}>
        <span className="h-2 w-2 rounded-full bg-emerald-400 pulse-soft" />
        <span>{copy.nav.checkingSession}</span>
      </div>
    );
  }

  if (!user) {
    if (mobile) {
      return (
        <div className="grid w-full grid-cols-2 gap-2">
          <Link href="/login" onClick={onNavigate} className="secondary-button min-h-11 w-full px-3 py-2.5 text-sm">
            {copy.common.login}
          </Link>
          <Link href="/register" onClick={onNavigate} className="primary-button min-h-11 w-full px-3 py-2.5 text-sm">
            {copy.common.getStarted}
          </Link>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Link href="/login" className="secondary-button min-h-10 px-3.5 py-2 text-xs sm:px-4 sm:text-sm">
          {copy.common.login}
        </Link>
        <Link href="/register" className="primary-button hidden min-h-10 px-3.5 py-2 text-xs sm:inline-flex sm:px-4 sm:text-sm">
          {copy.common.getStarted}
        </Link>
      </div>
    );
  }

  const initials = user.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  if (mobile) {
    return (
      <div className="w-full">
        <div className="mb-3 flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3">
          <span className="user-avatar shrink-0">{initials || <UserIcon className="h-4 w-4" />}</span>
          <div className="min-w-0 flex-1">
            <p className="mobile-user-name truncate text-sm font-bold">{user.fullName}</p>
            <p className="mt-0.5 truncate text-xs text-slate-500">{user.email}</p>
          </div>
        </div>

        <div className="grid gap-2">
          <Link href="/dashboard" onClick={onNavigate} className="mobile-nav-link flex items-center gap-2.5">
            <LayoutDashboardIcon className="h-4 w-4 text-sky-400" />
            {copy.common.dashboard}
          </Link>
          <Link href="/appointments" onClick={onNavigate} className="mobile-nav-link flex items-center gap-2.5">
            <CalendarIcon className="h-4 w-4 text-emerald-400" />
            {copy.nav.myAppointments}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="mobile-nav-link flex w-full items-center gap-2.5 text-red-300 hover:bg-red-500/10"
          >
            <LogOutIcon className="h-4 w-4" />
            {isLoggingOut ? copy.nav.loggingOut : copy.common.logout}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <button type="button" className="user-chip" aria-label={copy.nav.userMenu}>
        <span className="user-avatar">{initials || <UserIcon className="h-4 w-4" />}</span>
        <span className="hidden max-w-28 truncate text-sm font-semibold lg:block">{user.fullName}</span>
      </button>
      <div className="user-menu">
        <div className="border-b border-white/[0.07] px-3 py-2.5">
          <p className="truncate text-sm font-semibold text-white">{user.fullName}</p>
          <p className="mt-0.5 truncate text-xs text-slate-500">{user.email}</p>
        </div>
        <Link href="/dashboard" className="user-menu-link">
          <LayoutDashboardIcon className="h-4 w-4 text-sky-400" />
          {copy.common.dashboard}
        </Link>
        <Link href="/appointments" className="user-menu-link">
          <CalendarIcon className="h-4 w-4 text-emerald-400" />
          {copy.nav.myAppointments}
        </Link>
        <button type="button" onClick={handleLogout} disabled={isLoggingOut} className="user-menu-link w-full text-red-300 hover:bg-red-500/10">
          <LogOutIcon className="h-4 w-4" />
          {isLoggingOut ? copy.nav.loggingOut : copy.common.logout}
        </button>
      </div>
    </div>
  );
}
