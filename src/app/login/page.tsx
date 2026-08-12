"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import { ArrowRightIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "@/components/ui/icons";
import { loginUser } from "@/lib/api/auth";
import { localizeApiMessage } from "@/lib/i18n";

function safeNextPath() {
  if (typeof window === "undefined") return "/dashboard";
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

export default function LoginPage() {
  const router = useRouter();
  const { copy, isRtl } = useAppSettings();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!email.trim()) return setError(copy.auth.errors.emailRequired);
    if (!password) return setError(copy.auth.errors.passwordRequired);
    setIsSubmitting(true);
    try {
      await loginUser({ email: email.trim(), password });
      router.push(safeNextPath());
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? localizeApiMessage(caughtError.message, isRtl ? "ar" : "en") : copy.auth.errors.login);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell mode="login">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div className="form-error fade-in">{error}</div>}

        <div>
          <label htmlFor="email" className="field-label">{copy.auth.email}</label>
          <div className="field-wrap">
            <MailIcon className="field-icon-start" />
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder={copy.auth.emailPlaceholder} disabled={isSubmitting} className="input-control has-start-icon" />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="field-label">{copy.auth.password}</label>
          <div className="field-wrap">
            <LockIcon className="field-icon-start" />
            <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder={copy.auth.passwordPlaceholder} disabled={isSubmitting} className="input-control has-both-icons" />
            <button type="button" onClick={() => setShowPassword((current) => !current)} className="field-action-end" aria-label={showPassword ? copy.auth.hidePassword : copy.auth.showPassword}>
              {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="primary-button w-full py-4">
          {isSubmitting ? <><span className="button-spinner" />{copy.auth.loggingIn}</> : <>{copy.auth.loginButton}<ArrowRightIcon className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} /></>}
        </button>

        <p className="text-center text-sm text-slate-400">{copy.auth.noAccount} <Link href="/register" onClick={(event) => { const next = new URLSearchParams(window.location.search).get("next"); if (next) { event.preventDefault(); router.push(`/register?next=${encodeURIComponent(next)}`); } }} className="font-bold text-emerald-400 transition hover:text-emerald-300">{copy.auth.createNow}</Link></p>
      </form>
    </AuthShell>
  );
}
