"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

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
  const router = useRouter();

  const [status, setStatus] = useState<CommandeStatus>(
    initialStatus ?? "nouvelle",
  );
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setStatus(initialStatus ?? "nouvelle");
  }, [initialStatus]);

  async function handleChange(nextStatus: CommandeStatus) {
    if (nextStatus === status) return;

    const previousStatus = status;

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

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Impossible de mettre à jour le statut.");
      }

      setFeedback({
        type: "success",
        message: "Statut mis à jour avec succès.",
      });

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error(error);

      setStatus(previousStatus);
      onStatusChange?.(previousStatus);

      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Une erreur est survenue.",
      });
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
          className={`w-full appearance-none rounded-xl border px-4 py-3 pr-10 text-sm font-medium outline-none transition ${getCommandeStatusClasses(
            status,
          )} disabled:cursor-not-allowed disabled:opacity-70`}
        >
          {COMMANDE_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />
          ) : null}
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