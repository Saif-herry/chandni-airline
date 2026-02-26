"use client";

import * as React from "react";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type SheetContextProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const SheetContext = React.createContext<SheetContextProps | null>(null);

function useSheet() {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error("useSheet must be used within a Sheet");
  }
  return context;
}

function Sheet({
  open,
  onOpenChange,
  children,
  ...props
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (isControlled) {
        onOpenChange?.(newOpen);
      } else {
        setInternalOpen(newOpen);
      }
    },
    [isControlled, onOpenChange],
  );

  return (
    <SheetContext.Provider
      value={{ open: isOpen, onOpenChange: handleOpenChange }}
    >
      {children}
    </SheetContext.Provider>
  );
}

function SheetTrigger({
  asChild,
  children,
  ...props
}: {
  asChild?: boolean;
  children?: React.ReactNode;
} & React.ComponentProps<"button">) {
  const { onOpenChange } = useSheet();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement,
      {
        onClick: (e: any) => {
          onOpenChange(true);
          (children.props as any)?.onClick?.(e);
        },
        ...props,
      } as any,
    );
  }

  return (
    <button
      data-slot="sheet-trigger"
      onClick={() => onOpenChange(true)}
      {...props}
    >
      {children}
    </button>
  );
}

function SheetClose({
  asChild,
  children,
  ...props
}: {
  asChild?: boolean;
  children?: React.ReactNode;
} & React.ComponentProps<"button">) {
  const { onOpenChange } = useSheet();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement,
      {
        onClick: (e: any) => {
          onOpenChange(false);
          (children.props as any)?.onClick?.(e);
        },
        ...props,
      } as any,
    );
  }

  return (
    <button
      data-slot="sheet-close"
      onClick={() => onOpenChange(false)}
      {...props}
    >
      {children}
    </button>
  );
}

function SheetPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function SheetOverlay({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-overlay"
      className={cn("fixed inset-0 z-50 bg-black/50", className)}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = "right",
  style: customStyle,
  ...props
}: {
  side?: "top" | "right" | "bottom" | "left";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}) {
  const { open, onOpenChange } = useSheet();

  const slideClass = {
    right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
    left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
    top: "inset-x-0 top-0 h-auto border-b",
    bottom: "inset-x-0 bottom-0 h-auto border-t",
  }[side];

  return (
    <>
      {open && <SheetOverlay />}
      <div
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "bg-background fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out",
          "duration-300",
          slideClass,
          open ? "block" : "hidden",
          className,
        )}
        style={{
          ...(side === "right" &&
            open && { animation: "slideInFromRight 0.5s ease-in-out" }),
          ...(side === "left" &&
            open && { animation: "slideInFromLeft 0.5s ease-in-out" }),
          ...(side === "top" &&
            open && { animation: "slideInFromTop 0.5s ease-in-out" }),
          ...(side === "bottom" &&
            open && { animation: "slideInFromBottom 0.5s ease-in-out" }),
          ...customStyle,
        }}
        {...props}
      >
        {children}
        <button
          onClick={() => onOpenChange(false)}
          className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
        >
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
