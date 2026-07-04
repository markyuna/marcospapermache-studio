"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CreditCard, Loader2 } from "lucide-react";

type CheckoutSessionResponse = {
  url?: string;
  error?: string;
};

export default function BuyCreditsButton() {
  const t = useTranslations("AccountPage.dashboard");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnPath: window.location.pathname }),
      });

      const data: CheckoutSessionResponse = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || t("buyError"));
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : t("buyError"));
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#181512] px-5 py-3 text-sm font-medium text-white transition duration-300 hover:bg-[#2a241f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CreditCard className="h-4 w-4" />
        )}
        {t("buyButton")}
      </button>

      {error ? (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
