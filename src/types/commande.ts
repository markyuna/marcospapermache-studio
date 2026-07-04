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
  supabase_user_id: string | null;
  source_ai_image_id: string | null;
};