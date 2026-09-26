"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { Loader2, X } from "lucide-react";

import { supabase } from "@/lib/supabase/client";

type Mode = "signup" | "login";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void | Promise<void>;
  initialMode?: Mode;
};

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = "signup",
}: AuthModalProps) {
  const t = useTranslations("AIExperience.auth");

  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);

    if (isOpen) {
      setMode(initialMode);
      setEmail("");
      setPassword("");
      setError("");
    }
  }

  if (!isOpen || typeof document === "undefined") return null;

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

  async function handleGoogleLogin() {
    setIsSubmitting(true);
    setError("");

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${window.location.pathname}`,
      },
    });

    if (oauthError) {
      setIsSubmitting(false);
      setError(oauthError.message);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-8 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-md max-h-[90vh] overflow-y-auto rounded-[2rem] border border-white/10 bg-[#0b0b0d] p-6 text-white shadow-[0_30px_120px_rgba(0,0,0,0.5)] md:p-8"
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

        <div className="mt-5 flex items-center gap-3 text-xs uppercase tracking-wide text-neutral-500">
          <span className="h-px flex-1 bg-white/10" />
          {t("orDivider")}
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="mt-4 flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-medium text-white transition duration-300 hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.82-.07-1.61-.2-2.36H12v4.46h6.47c-.28 1.48-1.13 2.74-2.4 3.58v2.98h3.88c2.27-2.09 3.58-5.17 3.58-8.66z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-2.98c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.95H1.26v3.09C3.24 21.3 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.31c-.25-.72-.38-1.49-.38-2.31s.14-1.59.38-2.31V6.6H1.26A11.96 11.96 0 000 12c0 1.93.46 3.76 1.26 5.4l4.01-3.09z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.24 2.7 1.26 6.6l4.01 3.09c.95-2.84 3.6-4.94 6.73-4.94z"
            />
          </svg>
          {t("googleButton")}
        </button>

        <p className="mt-3 text-center text-xs leading-5 text-neutral-500">
          {t("googleHint")}
        </p>

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
    </div>,
    document.body,
  );
}
