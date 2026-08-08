"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  getCurrentUser,
  logoutUser,
  type AuthUser,
} from "@/lib/api/auth";
import {
  CalendarIcon,
  UserIcon,
} from "@/components/ui/icons";

export function AuthNav() {
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadCurrentUser() {
      try {
        const currentUser = await getCurrentUser();

        if (isMounted) {
          setUser(currentUser);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await logoutUser();
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.035] px-3 py-2 text-xs font-semibold text-slate-500">
        <span className="h-2 w-2 rounded-full bg-emerald-400 pulse-soft" />
        <span className="hidden sm:inline">Checking session</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/login"
          className="secondary-button min-h-10 px-3.5 py-2 text-xs sm:px-4 sm:text-sm"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="primary-button min-h-10 px-3.5 py-2 text-xs sm:px-4 sm:text-sm"
        >
          Get Started
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

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link
        href="/appointments"
        className="hidden items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.035] px-3.5 py-2 text-sm font-semibold text-slate-300 transition hover:border-emerald-400/25 hover:bg-emerald-400/[0.08] hover:text-white md:flex"
      >
        <CalendarIcon className="h-4 w-4 text-emerald-400" />
        My Appointments
      </Link>

      <div className="group relative">
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.045] p-1.5 pr-2.5 transition hover:border-emerald-400/25 hover:bg-white/[0.07] sm:pr-3"
          aria-label="User menu"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-emerald-500 text-xs font-extrabold text-slate-950 shadow-lg shadow-emerald-500/20">
            {initials || <UserIcon className="h-4 w-4" />}
          </span>
          <span className="hidden max-w-28 truncate text-sm font-semibold text-slate-200 lg:block">
            {user.fullName}
          </span>
        </button>

        <div className="invisible absolute right-0 top-[calc(100%+0.55rem)] w-52 translate-y-2 rounded-2xl border border-white/[0.08] bg-slate-900/95 p-2 opacity-0 shadow-2xl shadow-slate-950/60 backdrop-blur-xl transition duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
          <div className="border-b border-white/[0.06] px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-white">
              {user.fullName}
            </p>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {user.email}
            </p>
          </div>

          <Link
            href="/appointments"
            className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.05] hover:text-white md:hidden"
          >
            <CalendarIcon className="h-4 w-4 text-emerald-400" />
            My Appointments
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}
