"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CommandeStatus } from "@/lib/commandes-status";
import {
  COMMANDE_STATUS_OPTIONS,
  getCommandeStatusClasses,
} from "@/lib/commandes-status";

type CommandeStatusSelectProps = {
  commandeId: number;
  initialStatus: CommandeStatus | null;
};

export default function CommandeStatusSelect({
  commandeId,
  initialStatus,
}: CommandeStatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState<CommandeStatus>(
    initialStatus ?? "nouvelle"
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleChange(nextStatus: CommandeStatus) {
    const previousStatus = status;

    setStatus(nextStatus);
    setFeedback(null);

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

      setFeedback("Statut mis à jour avec succès.");

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error(error);
      setFeedback(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue."
      );
      setStatus(previousStatus);
    }
  }

  return (
    <div className="space-y-3">
      <select
        value={status}
        onChange={(event) => handleChange(event.target.value as CommandeStatus)}
        disabled={isPending}
        className={`w-full rounded-xl border px-4 py-3 text-sm font-medium outline-none transition ${getCommandeStatusClasses(
          status
        )} disabled:cursor-not-allowed disabled:opacity-70`}
      >
        {COMMANDE_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {feedback ? (
        <p className="text-sm text-neutral-600">{feedback}</p>
      ) : null}
    </div>
  );
}