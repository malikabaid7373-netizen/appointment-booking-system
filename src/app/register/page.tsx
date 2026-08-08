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
  UserIcon,
} from "@/components/ui/icons";
import { registerUser } from "@/lib/api/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password confirmation does not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      });

      router.push("/");
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not create the account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Patient Registration"
      title="Create your account"
      description="Join ClinicCare to book doctors and manage every appointment securely."
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3.5 text-sm text-red-200 fade-in">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="full-name" className="mb-2 block text-sm font-semibold text-slate-300">
            Full Name
          </label>
          <div className="relative">
            <UserIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              id="full-name"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              autoComplete="name"
              placeholder="Enter your full name"
              disabled={isSubmitting}
              className="input-control pl-12"
            />
          </div>
        </div>

        <div className="mt-5">
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

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
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
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
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

          <div>
            <label htmlFor="confirm-password" className="mb-2 block text-sm font-semibold text-slate-300">
              Confirm Password
            </label>
            <div className="relative">
              <LockIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                placeholder="Enter again"
                disabled={isSubmitting}
                className="input-control pl-12"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>Use at least 8 characters</span>
          {password && confirmPassword && (
            <span className={password === confirmPassword ? "text-emerald-400" : "text-amber-300"}>
              {password === confirmPassword ? "Passwords match" : "Passwords differ"}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="primary-button mt-7 w-full py-4"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-slate-950/30 border-t-slate-950 spin-slow" />
              Creating Account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRightIcon className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-emerald-400 transition hover:text-emerald-300">
            Login
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
