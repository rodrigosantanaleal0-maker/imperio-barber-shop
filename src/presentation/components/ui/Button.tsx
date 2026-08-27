import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/infrastructure/styling/cn";

export const buttonVariants = cva(
  "focus-ring inline-flex items-center justify-center gap-2 rounded-sm font-sans uppercase tracking-[0.12em] transition-colors duration-300 ease-cinematic",
  {
    variants: {
      variant: {
        primary: "bg-ivory text-obsidian hover:bg-champagne",
        secondary: "border border-ivory/30 text-ivory hover:border-gold hover:text-gold",
        ghost: "text-ivory/70 hover:text-ivory",
      },
      size: {
        sm: "px-5 py-2.5 text-label",
        md: "px-7 py-3.5 text-caption",
        lg: "px-9 py-5 text-body-s",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
