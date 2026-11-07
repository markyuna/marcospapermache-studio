import type { ProfileId } from "@/data/quiz/profiles";

// TODO: replace these gradients with a real illustration/photo per profile.
// Shared by the quiz result and the account page (fallback when a saved result
// has no generated image yet).
export const PROFILE_GRADIENTS: Record<ProfileId, string> = {
  contemplativo: "from-[#d8c3a5] via-[#b9c4a8] to-[#8fa58a]",
  onirico: "from-[#1d2a4d] via-[#34508a] to-[#d4a85a]",
  animal: "from-[#e3a572] via-[#d9825b] to-[#f0d9b8]",
  vibrante: "from-[#ff8a2a] via-[#e8317a] to-[#1fb5c4]",
  minimalista: "from-[#f2efe9] via-[#d9d5cd] to-[#8c8a85]",
};
