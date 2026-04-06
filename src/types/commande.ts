import type { CommandeStatus } from "@/lib/commandes-status";

export type Commande = {
  id: number;
  name: string;
  email: string;
  project_type: string | null;
  dimensions: string | null;
  budget: string | null;
  message: string | null;
  image_url: string | null;
  file_url: string | null;
  status: CommandeStatus | null;
  created_at: string;
};