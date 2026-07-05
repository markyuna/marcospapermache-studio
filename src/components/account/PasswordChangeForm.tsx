"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Loader2 } from "lucide-react";

import { supabase } from "@/lib/supabase/client";

const inputClassName =
  "w-full rounded-[1rem] border border-[#e4d6c8] bg-white px-4 py-3 text-sm text-[#181512] outline-none transition duration-300 focus:border-[#cfa57f] focus:ring-4 focus:ring-[#cfa57f]/10";

const labelClassName =
  "mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-500";

const MIN_PASSWORD_LENGTH = 8;

export default function PasswordChangeForm() {
  const t = useTranslations("AccountPage.password");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(t("tooShort", { count: MIN_PASSWORD_LENGTH }));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("mismatch"));
      return;
    }

    setIsSaving(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setIsSaving(false);

    if (updateError) {
      setError(updateError.message || t("saveError"));
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    setSuccessMessage(t("saved"));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClassName}>{t("newPasswordLabel")}</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={MIN_PASSWORD_LENGTH}
            className={inputClassName}
          />
        </div>

        <div>
          <label className={labelClassName}>{t("confirmPasswordLabel")}</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={MIN_PASSWORD_LENGTH}
            className={inputClassName}
          />
        </div>
      </div>

      {error ? (
        <p className="rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {successMessage ? (
        <p className="flex items-center gap-2 rounded-[1rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <Check className="h-4 w-4 shrink-0" />
          {successMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSaving}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-[#181512] transition duration-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {t("saveButton")}
      </button>
    </form>
  );
}
