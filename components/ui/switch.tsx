"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function Switch({
  className,
  checked,
  defaultChecked,
  onChange,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label
      data-slot="switch"
      className={cn("inline-flex items-center", className)}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        {...props}
      />
      <span
        aria-hidden
        className={cn(
          "relative inline-block h-[1.15rem] w-8 rounded-full bg-input transition-colors",
        )}
      >
        <span
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-background shadow-sm transform transition-transform",
            // translate when input is checked using peer selector isn't available on native input here,
            // so rely on CSS that will be applied when the sibling input is :checked via the label
          )}
        />
      </span>
    </label>
  );
}

export { Switch };
