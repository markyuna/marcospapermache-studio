"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import { supabase } from "@/lib/supabase/client";

export default function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("AccountPage.login");

  const isInactivityLogout = searchParams.get("reason") === "inactivity";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(t("error"));
      return;
    }

    router.replace("/mon-compte");
    router.refresh();
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/${locale}/mon-compte`,
      },
    });

    if (oauthError) {
      setLoading(false);
      setError(oauthError.message);
    }
  }

  return (
    <form onSubmit={handleLogin} className="mx-auto w-full max-w-md space-y-5">
      {isInactivityLogout && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {t("inactivityMessage")}
        </p>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-neutral-700">
          {t("emailLabel")}
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-neutral-400"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-neutral-700">
          {t("passwordLabel")}
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-neutral-400"
        />
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-neutral-950 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? t("loading") : t("submit")}
      </button>

      <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-neutral-400">
        <span className="h-px flex-1 bg-neutral-200" />
        {t("orDivider")}
        <span className="h-px flex-1 bg-neutral-200" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
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
        {t("googleSubmit")}
      </button>
    </form>
  );
}
