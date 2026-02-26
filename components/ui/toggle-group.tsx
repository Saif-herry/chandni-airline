"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";

type ToggleVariant = "default" | "outline";
type ToggleSize = "default" | "sm" | "lg";

const ToggleGroupContext = React.createContext<{
  variant?: ToggleVariant;
  size?: ToggleSize;
}>({
  size: "default",
  variant: "default",
});

function ToggleGroup({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: ToggleVariant;
  size?: ToggleSize;
}) {
  return (
    <div
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        "group/toggle-group flex w-fit items-center rounded-md",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </div>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ToggleVariant;
  size?: ToggleSize;
}) {
  const context = React.useContext(ToggleGroupContext);

  const finalVariant = (context.variant || variant) as ToggleVariant;
  const finalSize = (context.size || size) as ToggleSize;

  return (
    <button
      data-slot="toggle-group-item"
      data-variant={finalVariant}
      data-size={finalSize}
      className={cn(
        toggleVariants({ variant: finalVariant, size: finalSize }),
        "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export { ToggleGroup, ToggleGroupItem };
