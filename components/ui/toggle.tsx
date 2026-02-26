"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ToggleVariant = "default" | "outline";
type ToggleSize = "default" | "sm" | "lg";

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap";

const variantClasses: Record<ToggleVariant, string> = {
  default: "bg-transparent",
  outline:
    "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground",
};

const sizeClasses: Record<ToggleSize, string> = {
  default: "h-9 px-2 min-w-9",
  sm: "h-8 px-1.5 min-w-8",
  lg: "h-10 px-2.5 min-w-10",
};

function toggleVariants({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: ToggleVariant;
  size?: ToggleSize;
  className?: string;
}) {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
}

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ToggleVariant;
  size?: ToggleSize;
}) {
  return (
    <button
      data-slot="toggle"
      className={toggleVariants({ variant, size, className })}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
