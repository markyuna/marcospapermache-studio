import clsx from "clsx";

export const availabilityBadgeBaseClass =
  "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] shadow-sm backdrop-blur-md";

type SoldBadgeProps = {
  label: string;
  className?: string;
};

export function SoldBadge({ label, className }: SoldBadgeProps) {
  return (
    <span
      className={clsx(
        availabilityBadgeBaseClass,
        "border-white/20 bg-neutral-900/90 text-white",
        className
      )}
    >
      {label}
    </span>
  );
}
