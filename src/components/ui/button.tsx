import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--knop-radius,0.375rem)] text-sm font-epilogue [font-weight:var(--knop-gewicht,400)] ring-offset-background transition-[color,background-color,border-color,transform] duration-150 active:scale-[0.97] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-[color:var(--knop-rand,hsl(var(--input)))] bg-[color:var(--knop-vlak,hsl(var(--background)))] hover:bg-[color:var(--knop-vlak-hover,hsl(var(--accent)))] hover:text-[color:var(--knop-tekst-hover,hsl(var(--accent-foreground)))]",
        secondary:
          "bg-[color:var(--knop-vlak,hsl(var(--secondary)))] text-secondary-foreground hover:bg-[color:var(--knop-vlak-hover,hsl(var(--secondary)/0.8))]",
        ghost:
          "hover:bg-[color:var(--knop-spook-hover,hsl(var(--accent)))] hover:text-[color:var(--knop-tekst-hover,hsl(var(--accent-foreground)))]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
