export function isSoldAvailability(availability?: string | null): boolean {
  const normalized = availability?.toLowerCase().trim() ?? "";

  return (
    normalized.includes("vendu") ||
    normalized.includes("vendid") ||
    normalized.includes("sold")
  );
}
