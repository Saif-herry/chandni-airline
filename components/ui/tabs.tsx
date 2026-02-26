"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string | null;
  setValue: (v: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | undefined>(
  undefined,
);

function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used within a Tabs root");
  return ctx;
}

function Tabs({
  className,
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  ...props
}: React.PropsWithChildren<{
  className?: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (v: string) => void;
}>) {
  const [uncontrolled, setUncontrolled] = React.useState<string | null>(
    defaultValue ?? null,
  );
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolled;

  const setValue = (v: string) => {
    if (!isControlled) setUncontrolled(v);
    onValueChange?.(v);
  };

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div
        data-slot="tabs"
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function TabsList({
  className,
  children,
  ...props
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function TabsTrigger({
  className,
  value,
  children,
  ...props
}: React.PropsWithChildren<{
  className?: string;
  value: string;
}>) {
  const { value: current, setValue } = useTabsContext();
  const active = current === value;

  return (
    <button
      type="button"
      data-slot="tabs-trigger"
      aria-selected={active}
      onClick={() => setValue(value)}
      className={cn(
        "inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        active
          ? "bg-background shadow-sm text-foreground"
          : "text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function TabsContent({
  className,
  value,
  children,
  ...props
}: React.PropsWithChildren<{ className?: string; value: string }>) {
  const { value: current } = useTabsContext();
  if (current !== value) return null;
  return (
    <div
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
