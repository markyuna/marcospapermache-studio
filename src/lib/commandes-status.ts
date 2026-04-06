export const COMMANDE_STATUSES = [
  "nouvelle",
  "en_cours",
  "en_attente",
  "terminee",
  "annulee",
] as const;

export type CommandeStatus = (typeof COMMANDE_STATUSES)[number];

export const COMMANDE_STATUS_OPTIONS: Array<{
  value: CommandeStatus;
  label: string;
}> = [
  { value: "nouvelle", label: "Nouvelle" },
  { value: "en_cours", label: "En cours" },
  { value: "en_attente", label: "En attente" },
  { value: "terminee", label: "Terminée" },
  { value: "annulee", label: "Annulée" },
];

export function isCommandeStatus(value: string): value is CommandeStatus {
  return COMMANDE_STATUSES.includes(value as CommandeStatus);
}

export function normalizeCommandeStatus(
  value: string | null | undefined
): CommandeStatus | null {
  if (!value) return null;
  return isCommandeStatus(value) ? value : null;
}

export function getCommandeStatusLabel(status: CommandeStatus | null) {
  switch (status) {
    case "nouvelle":
      return "Nouvelle";
    case "en_cours":
      return "En cours";
    case "en_attente":
      return "En attente";
    case "terminee":
      return "Terminée";
    case "annulee":
      return "Annulée";
    default:
      return "Nouvelle";
  }
}

export function getCommandeStatusClasses(status: CommandeStatus | null) {
  switch (status) {
    case "nouvelle":
      return "border-amber-200 bg-amber-50 text-amber-700 ring-amber-200";
    case "en_cours":
      return "border-blue-200 bg-blue-50 text-blue-700 ring-blue-200";
    case "en_attente":
      return "border-violet-200 bg-violet-50 text-violet-700 ring-violet-200";
    case "terminee":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "annulee":
      return "border-rose-200 bg-rose-50 text-rose-700 ring-rose-200";
    default:
      return "border-neutral-200 bg-neutral-50 text-neutral-700 ring-neutral-200";
  }
}