"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import { supabase } from "@/lib/supabase/client";

export default function CustomerLoginForm() {
  const router = useRouter();
  const t = useTranslations("AccountPage.login");

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

  return (
    <form onSubmit={handleLogin} className="mx-auto w-full max-w-md space-y-5">
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
    </form>
  );
}
