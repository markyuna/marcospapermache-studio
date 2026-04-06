import type { CommandeStatus } from "@/types/commande";

export const COMMANDE_STATUS_OPTIONS: {
  value: CommandeStatus;
  label: string;
}[] = [
  { value: "nouvelle", label: "Nouvelle" },
  { value: "en_cours", label: "En cours" },
  { value: "terminee", label: "Terminée" },
  { value: "livree", label: "Livrée" },
  { value: "annulee", label: "Annulée" },
];

export function getCommandeStatusLabel(status: CommandeStatus | null) {
  if (!status) return "Nouvelle";

  switch (status) {
    case "nouvelle":
      return "Nouvelle";
    case "en_cours":
      return "En cours";
    case "terminee":
      return "Terminée";
    case "livree":
      return "Livrée";
    case "annulee":
      return "Annulée";
    default:
      return "Inconnu"; // 👈 clave
  }
}

export function getCommandeStatusClasses(status: CommandeStatus | null) {
  switch (status) {
    case "nouvelle":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "en_cours":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "terminee":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "livree":
      return "bg-violet-50 text-violet-700 ring-violet-200";
    case "annulee":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    default:
      return "bg-neutral-100 text-neutral-700 ring-neutral-200";
  }
}