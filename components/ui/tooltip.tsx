"use client";

import * as React from "react";
import TooltipMUI from "@mui/material/Tooltip";
import { cn } from "@/lib/utils";

type Placement = "top" | "bottom" | "left" | "right";

const TooltipContext = React.createContext<{
  title?: React.ReactNode;
  setTitle: (t?: React.ReactNode) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  placement?: Placement;
}>({
  title: undefined,
  setTitle: () => {},
  open: false,
  setOpen: () => {},
  placement: "bottom",
});

function TooltipProvider({
  delayDuration = 0,
  children,
  ...props
}: React.PropsWithChildren & { delayDuration?: number; [key: string]: any }) {
  return (
    <div data-slot="tooltip-provider" {...props}>
      {children}
    </div>
  );
}

function Tooltip({ children }: React.PropsWithChildren) {
  const [title, setTitle] = React.useState<React.ReactNode | undefined>();
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<Placement>("bottom");

  return (
    <TooltipContext.Provider
      value={{ title, setTitle, open, setOpen, placement }}
    >
      {children}
    </TooltipContext.Provider>
  );
}

function TooltipTrigger({
  children,
  asChild,
  ...props
}: React.PropsWithChildren & {
  asChild?: boolean;
  className?: string;
  [key: string]: any;
}) {
  const { setOpen } = React.useContext(TooltipContext);

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any, any>;
    const extraProps: any = {
      onMouseEnter: (e: any) => {
        setOpen(true);
        (child.props as any)?.onMouseEnter?.(e);
      },
      onMouseLeave: (e: any) => {
        setOpen(false);
        (child.props as any)?.onMouseLeave?.(e);
      },
      onFocus: (e: any) => {
        setOpen(true);
        (child.props as any)?.onFocus?.(e);
      },
      onBlur: (e: any) => {
        setOpen(false);
        (child.props as any)?.onBlur?.(e);
      },
    };

    return React.cloneElement(child, extraProps);
  }

  return (
    <div
      data-slot="tooltip-trigger"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </div>
  );
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  placement = "bottom",
  ...props
}: React.PropsWithChildren & {
  className?: string;
  sideOffset?: number;
  placement?: Placement;
  [key: string]: any;
}) {
  const { title, setTitle, open } = React.useContext(TooltipContext);

  React.useEffect(() => {
    setTitle(children);
    return () => setTitle(undefined);
  }, [children, setTitle]);

  return (
    <TooltipMUI
      title={title ?? ""}
      open={open}
      placement={placement}
      arrow
      enterDelay={0}
      leaveDelay={0}
      sx={{
        "& .MuiTooltip-tooltip": {
          backgroundColor: "var(--foreground)",
          color: "var(--background)",
          fontSize: "0.75rem",
          padding: "0.375rem 0.5rem",
          borderRadius: "0.375rem",
        },
        "& .MuiTooltip-arrow": {
          color: "var(--foreground)",
        },
      }}
      {...props}
    >
      <span className={cn("inline-block")} />
    </TooltipMUI>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
