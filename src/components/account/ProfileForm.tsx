"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Loader2 } from "lucide-react";

import { supabase } from "@/lib/supabase/client";

type ProfileFormProps = {
  email: string;
  initialFullName: string;
  initialAddress: string;
  initialCity: string;
  initialPostalCode: string;
  initialCountry: string;
  initialPhone: string;
};

const inputClassName =
  "w-full rounded-[1rem] border border-[#e4d6c8] bg-paper-surface px-4 py-3 text-sm text-[#181512] outline-none transition duration-300 placeholder:text-[#9a8a7d] focus:border-[#cfa57f] focus:ring-4 focus:ring-[#cfa57f]/10";

const labelClassName =
  "mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-500";

export default function ProfileForm({
  email,
  initialFullName,
  initialAddress,
  initialCity,
  initialPostalCode,
  initialCountry,
  initialPhone,
}: ProfileFormProps) {
  const t = useTranslations("AccountPage.profile");

  const [currentEmail, setCurrentEmail] = useState(email);
  const [newEmail, setNewEmail] = useState(email);
  const [fullName, setFullName] = useState(initialFullName);
  const [address, setAddress] = useState(initialAddress);
  const [city, setCity] = useState(initialCity);
  const [postalCode, setPostalCode] = useState(initialPostalCode);
  const [country, setCountry] = useState(initialCountry);
  const [phone, setPhone] = useState(initialPhone);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          address,
          city,
          postalCode,
          country,
          phone,
        }),
      });

      if (!response.ok) {
        throw new Error(t("saveError"));
      }

      const emailChanged = newEmail.trim() !== currentEmail.trim();

      if (emailChanged) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: newEmail.trim(),
        });

        if (emailError) {
          throw new Error(emailError.message || t("emailChangeError"));
        }

        setCurrentEmail(newEmail.trim());
        setSuccessMessage(t("savedWithEmailChange"));
      } else {
        setSuccessMessage(t("saved"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("saveError"));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClassName}>{t("fullNameLabel")}</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t("fullNamePlaceholder")}
            className={inputClassName}
          />
        </div>

        <div>
          <label className={labelClassName}>{t("emailLabel")}</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label className={labelClassName}>{t("addressLabel")}</label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={t("addressPlaceholder")}
          className={inputClassName}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClassName}>{t("cityLabel")}</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={inputClassName}
          />
        </div>

        <div>
          <label className={labelClassName}>{t("postalCodeLabel")}</label>
          <input
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className={inputClassName}
          />
        </div>

        <div>
          <label className={labelClassName}>{t("countryLabel")}</label>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="sm:w-1/2 sm:pr-2">
        <label className={labelClassName}>{t("phoneLabel")}</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClassName}
        />
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
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#181512] px-5 py-2.5 text-sm font-medium text-white transition duration-300 hover:bg-[#2a241f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {t("saveButton")}
      </button>
    </form>
  );
}
