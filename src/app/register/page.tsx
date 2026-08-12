"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import { ArrowRightIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from "@/components/ui/icons";
import { registerUser } from "@/lib/api/auth";
import { localizeApiMessage } from "@/lib/i18n";

function safeNextPath() {
  if (typeof window === "undefined") return "/dashboard";
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

export default function RegisterPage() {
  const router = useRouter();
  const { copy, isRtl } = useAppSettings();
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
    if (!fullName.trim()) return setError(copy.auth.errors.fullNameRequired);
    if (!email.trim()) return setError(copy.auth.errors.emailRequired);
    if (password.length < 8) return setError(copy.auth.errors.passwordLength);
    if (password !== confirmPassword) return setError(copy.auth.errors.passwordMismatch);
    setIsSubmitting(true);
    try {
      await registerUser({ fullName: fullName.trim(), email: email.trim(), password, confirmPassword });
      router.push(safeNextPath());
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? localizeApiMessage(caughtError.message, isRtl ? "ar" : "en") : copy.auth.errors.register);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell mode="register">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div className="form-error fade-in">{error}</div>}

        <div>
          <label htmlFor="full-name" className="field-label">{copy.auth.fullName}</label>
          <div className="field-wrap"><UserIcon className="field-icon-start" /><input id="full-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" placeholder={copy.auth.fullNamePlaceholder} disabled={isSubmitting} className="input-control has-start-icon" /></div>
        </div>

        <div>
          <label htmlFor="email" className="field-label">{copy.auth.email}</label>
          <div className="field-wrap"><MailIcon className="field-icon-start" /><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder={copy.auth.emailPlaceholder} disabled={isSubmitting} className="input-control has-start-icon" /></div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="field-label">{copy.auth.password}</label>
            <div className="field-wrap"><LockIcon className="field-icon-start" /><input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder={copy.auth.newPasswordPlaceholder} disabled={isSubmitting} className="input-control has-both-icons" /><button type="button" onClick={() => setShowPassword((current) => !current)} className="field-action-end" aria-label={showPassword ? copy.auth.hidePassword : copy.auth.showPassword}>{showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}</button></div>
          </div>
          <div>
            <label htmlFor="confirm-password" className="field-label">{copy.auth.confirmPassword}</label>
            <div className="field-wrap"><LockIcon className="field-icon-start" /><input id="confirm-password" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" placeholder={copy.auth.confirmPlaceholder} disabled={isSubmitting} className="input-control has-start-icon" /></div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 text-xs text-slate-500"><span>{copy.auth.minChars}</span>{password && confirmPassword && <span className={password === confirmPassword ? "text-emerald-400" : "text-amber-300"}>{password === confirmPassword ? copy.auth.match : copy.auth.differ}</span>}</div>

        <button type="submit" disabled={isSubmitting} className="primary-button w-full py-4">{isSubmitting ? <><span className="button-spinner" />{copy.auth.creating}</> : <>{copy.auth.createButton}<ArrowRightIcon className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} /></>}</button>
        <p className="text-center text-sm text-slate-400">{copy.auth.hasAccount} <Link href="/login" onClick={(event) => { const next = new URLSearchParams(window.location.search).get("next"); if (next) { event.preventDefault(); router.push(`/login?next=${encodeURIComponent(next)}`); } }} className="font-bold text-emerald-400 transition hover:text-emerald-300">{copy.common.login}</Link></p>
      </form>
    </AuthShell>
  );
}
