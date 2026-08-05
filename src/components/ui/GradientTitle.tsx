// Renders a section-title string with the canonical warm gradient applied only
// to its final word — the pattern that predominates across the site. The
// leading words inherit the parent heading's own colour (solid near-black on
// light sections, cream on dark ones).
//
// Splitting on the last whitespace keeps the accent on the final word in every
// locale (FR/ER/ES), so it works straight from next-intl strings without
// needing separate translation keys.

type GradientTitleProps = {
  /** The full title string (e.g. from a translation). */
  text: string;
  /** "dark" uses the cream→terracotta variant for dark-background sections. */
  variant?: "light" | "dark";
};

export function GradientTitle({ text, variant = "light" }: GradientTitleProps) {
  const trimmed = text.trim();
  const lastSpace = trimmed.lastIndexOf(" ");
  const lead = lastSpace === -1 ? "" : trimmed.slice(0, lastSpace);
  const accent = lastSpace === -1 ? trimmed : trimmed.slice(lastSpace + 1);
  const accentClass =
    variant === "dark" ? "heading-gradient-dark" : "heading-gradient";

  return (
    <>
      {lead && `${lead} `}
      <span className={accentClass}>{accent}</span>
    </>
  );
}
