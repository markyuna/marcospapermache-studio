// src/components/layout/SectionDivider.tsx

import { cn } from "@/lib/utils";

type SectionDividerProps = {
  /** Which edge of the (relatively positioned) parent section to anchor to. */
  position?: "top" | "bottom";
  className?: string;
};

/**
 * Solid 2px brand-gold seam between a flat "Paper & Gold" section and an
 * espresso-deep dark section — replaces the old cream-to-transparent blur
 * dividers. Parent must be `relative`.
 */
export function SectionDivider({ position = "top", className }: SectionDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 h-0.5 bg-brand-gold",
        position === "top" ? "top-0" : "bottom-0",
        className
      )}
    />
  );
}
