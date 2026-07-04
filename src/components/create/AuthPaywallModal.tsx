"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, X } from "lucide-react";

import { supabase } from "@/lib/supabase/client";

type Mode = "signup" | "login";

type AuthPaywallModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void | Promise<void>;
};

export default function AuthPaywallModal({
  isOpen,
  onClose,
  onAuthSuccess,
}: AuthPaywallModalProps) {
  const t = useTranslations("AIExperience.auth");

  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);

    if (isOpen) {
      setMode("signup");
      setEmail("");
      setPassword("");
      setError("");
    }
  }

  if (!isOpen) return null;

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setIsSubmitting(false);

      if (signUpError.message.toLowerCase().includes("already registered")) {
        setMode("login");
        setError(t("emailAlreadyRegistered"));
        return;
      }

      setError(signUpError.message || t("genericError"));
      return;
    }

    setIsSubmitting(false);
    onClose();
    await onAuthSuccess();
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setIsSubmitting(false);
      setError(t("loginError"));
      return;
    }

    setIsSubmitting(false);
    onClose();
    await onAuthSuccess();
  }

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0b0b0d] p-6 text-white shadow-[0_30px_120px_rgba(0,0,0,0.5)] md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/70 transition duration-300 hover:bg-white/[0.09] hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="text-xl font-semibold text-white">
          {mode === "signup" ? t("signupTitle") : t("loginTitle")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-neutral-400">
          {mode === "signup" ? t("signupDescription") : t("loginDescription")}
        </p>

        <form
          onSubmit={mode === "signup" ? handleSignup : handleLogin}
          className="mt-6 space-y-4"
        >
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
              {t("emailLabel")}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-[1rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition duration-300 focus:border-[#caa27c] focus:ring-2 focus:ring-[#caa27c]/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
              {t("passwordLabel")}
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-[1rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition duration-300 focus:border-[#caa27c] focus:ring-2 focus:ring-[#caa27c]/20"
            />
          </div>

          {error ? (
            <p className="rounded-[1rem] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition duration-300 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === "signup" ? (
              t("signupButton")
            ) : (
              t("loginButton")
            )}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signup" ? "login" : "signup");
            setError("");
          }}
          className="mt-4 text-sm text-neutral-400 underline-offset-4 hover:text-white hover:underline"
        >
          {mode === "signup" ? t("switchToLogin") : t("switchToSignup")}
        </button>
      </div>
    </div>
  );
}
