"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";

type Props = {
  id: string;
};

// Two steps (ask, then delete). The server removes the image first and the row
// second, so if this fails the result is still there and can simply be retried.
export default function QuizResultDeleteButton({ id }: Props) {
  const t = useTranslations("quiz");
  const router = useRouter();
  const [asking, setAsking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    setFailed(false);

    try {
      const response = await fetch(
        `/api/quiz/results?id=${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );

      if (!response.ok) throw new Error("delete failed");

      router.refresh();
    } catch {
      setFailed(true);
      setDeleting(false);
    }
  }

  if (!asking) {
    return (
      <button
        type="button"
        onClick={() => setAsking(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-paper-surface px-3 py-2 text-xs font-medium text-neutral-600 transition hover:bg-paper-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c65400]/50"
      >
        <Trash2 className="h-3.5 w-3.5" />
        {t("account.delete")}
      </button>
    );
  }

  return (
    <div role="group" aria-label={t("account.deleteQuestion")} className="w-full">
      <p className="text-xs leading-5 text-neutral-600">
        {t("account.deleteQuestion")}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void handleDelete()}
          disabled={deleting}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#7a2e1f] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#5f2316] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c65400]/50"
        >
          {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {deleting ? t("account.deleting") : t("account.deleteConfirm")}
        </button>
        <button
          type="button"
          onClick={() => {
            setAsking(false);
            setFailed(false);
          }}
          disabled={deleting}
          className="rounded-full border border-neutral-200 bg-paper-surface px-3 py-2 text-xs font-medium text-neutral-600 transition hover:bg-paper-base disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c65400]/50"
        >
          {t("account.cancel")}
        </button>
      </div>
      {failed ? (
        <p role="alert" className="mt-2 text-xs leading-5 text-red-700">
          {t("save.errors.delete_failed")}
        </p>
      ) : null}
    </div>
  );
}
