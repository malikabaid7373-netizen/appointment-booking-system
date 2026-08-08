"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import {
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
} from "@/components/ui/icons";
import { loginUser } from "@/lib/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      await loginUser({
        email: email.trim(),
        password,
      });

      router.push("/");
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not log in.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Patient Login"
      title="Welcome back"
      description="Sign in to manage your appointments and continue your care journey."
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3.5 text-sm text-red-200 fade-in">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-300">
            Email address
          </label>
          <div className="relative">
            <MailIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="patient@example.com"
              disabled={isSubmitting}
              className="input-control pl-12"
            />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-300">
            Password
          </label>
          <div className="relative">
            <LockIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Enter your password"
              disabled={isSubmitting}
              className="input-control px-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white/[0.05] hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="primary-button mt-7 w-full py-4"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-slate-950/30 border-t-slate-950 spin-slow" />
              Logging in...
            </>
          ) : (
            <>
              Login
              <ArrowRightIcon className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="mt-6 text-center text-sm text-slate-400">
          Do not have an account?{" "}
          <Link href="/register" className="font-bold text-emerald-400 transition hover:text-emerald-300">
            Create one now
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
