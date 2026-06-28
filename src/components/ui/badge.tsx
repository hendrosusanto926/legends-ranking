import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#FFD700]/20 text-[#FFD700]",
        secondary:
          "border-transparent bg-[#1B5E20]/20 text-[#4CAF50]",
        destructive:
          "border-transparent bg-red-500/20 text-red-400",
        outline: "text-white border-white/20",
        gold: "border-[#FFD700]/50 bg-[#FFD700]/10 text-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.3)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
