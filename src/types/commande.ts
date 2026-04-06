export type CommandeStatus =
  | "nouvelle"
  | "en_cours"
  | "terminee"
  | "livree"
  | "annulee";

export type Commande = {
  id: number;
  created_at: string;
  name: string;
  email: string;
  project_type: string | null;
  dimensions: string | null;
  budget: string | null;
  message: string | null;
  image_url: string | null;
  file_url: string | null;
  status: CommandeStatus | null;
};