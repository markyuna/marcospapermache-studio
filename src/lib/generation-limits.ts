// Shared between the server quota logic and the client UI — keep this file
// free of server-only imports (prisma, supabase admin, …).

// Generations offered before the paywall kicks in. The 3rd request is the
// first one that requires a purchase.
export const FREE_GENERATION_LIMIT = 2;

export const CREDIT_PACKAGE = {
  credits: 3,
  priceEurCents: 100,
};
