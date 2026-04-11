//src/components/ui/button.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-transparent bg-clip-padding text-sm font-medium transition-all duration-300 outline-none select-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:not-aria-[haspopup]:translate-y-px aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#ff6a00] to-[#ff9a3d] text-white shadow-[0_14px_34px_rgba(255,106,0,0.25)] hover:-translate-y-0.5 hover:from-[#ff7a1a] hover:to-[#ffb05c] hover:shadow-[0_20px_48px_rgba(255,106,0,0.32)] focus-visible:ring-[#ff6a00]/30",
        outline:
          "border border-black/10 bg-white/80 text-[#181512] backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:border-black/20 hover:bg-white hover:text-[#181512] focus-visible:ring-black/10",
        secondary:
          "bg-[#f3ece2] text-[#5c4632] hover:bg-[#efe5d8] focus-visible:ring-[#caa47c]/25",
        ghost:
          "text-[#181512] hover:bg-black/5 hover:text-[#181512] focus-visible:ring-black/10",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-[#181512] underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-11 gap-2 px-6 py-3 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        xs: "h-8 gap-1.5 px-3 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 px-4 text-[0.8rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-7 text-sm [&_svg:not([class*='size-'])]:size-4",
        icon: "size-11 rounded-full",
        "icon-xs": "size-8 rounded-full [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-full",
        "icon-lg": "size-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };