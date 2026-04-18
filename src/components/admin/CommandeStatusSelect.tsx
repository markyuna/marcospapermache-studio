// src/components/admin/CommandeStatusSelect.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, AlertCircle, ChevronDown, Loader2 } from "lucide-react";

import type { CommandeStatus } from "@/lib/commandes-status";
import {
  COMMANDE_STATUS_OPTIONS,
  getCommandeStatusClasses,
} from "@/lib/commandes-status";

type CommandeStatusSelectProps = {
  commandeId: number;
  initialStatus: CommandeStatus | null;
  onStatusChange?: (nextStatus: CommandeStatus) => void;
};

export default function CommandeStatusSelect({
  commandeId,
  initialStatus,
  onStatusChange,
}: CommandeStatusSelectProps) {
  const [status, setStatus] = useState<CommandeStatus>(
    initialStatus ?? "nouvelle",
  );
  const [isPending, setIsPending] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const feedbackTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setStatus(initialStatus ?? "nouvelle");
  }, [initialStatus]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        window.clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  function showFeedback(type: "success" | "error", message: string) {
    setFeedback({ type, message });

    if (feedbackTimeoutRef.current) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }

    feedbackTimeoutRef.current = window.setTimeout(() => {
      setFeedback(null);
    }, 2500);
  }

  async function handleChange(nextStatus: CommandeStatus) {
    if (nextStatus === status || isPending) return;

    const previousStatus = status;

    setIsPending(true);
    setStatus(nextStatus);
    setFeedback(null);
    onStatusChange?.(nextStatus);

    try {
      const response = await fetch(`/api/admin/commandes/${commandeId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || "Impossible de mettre à jour le statut.");
      }

      showFeedback("success", "Statut mis à jour avec succès.");
    } catch (error) {
      console.error(error);

      setStatus(previousStatus);
      onStatusChange?.(previousStatus);

      showFeedback(
        "error",
        error instanceof Error ? error.message : "Une erreur est survenue.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <select
          value={status}
          onChange={(event) =>
            handleChange(event.target.value as CommandeStatus)
          }
          disabled={isPending}
          aria-label="Changer le statut de la commande"
          className={[
            "w-full appearance-none rounded-xl border bg-white px-4 py-3 pr-12 text-sm font-medium outline-none transition",
            "shadow-sm",
            "focus:ring-4 focus:ring-orange-100",
            "disabled:cursor-not-allowed disabled:opacity-70",
            getCommandeStatusClasses(status),
          ].join(" ")}
        >
          {COMMANDE_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center gap-2">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />
          ) : null}
          <ChevronDown className="h-4 w-4 text-neutral-500" />
        </div>
      </div>

      {feedback ? (
        <div
          className={[
            "flex items-start gap-2 rounded-xl px-3 py-2 text-sm",
            feedback.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-red-200 bg-red-50 text-red-700",
          ].join(" ")}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      ) : null}
    </div>
  );
}