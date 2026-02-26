"use client";

import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type SelectContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  anchorEl: HTMLElement | null;
  setAnchorEl: (el: HTMLElement | null) => void;
  labels: Map<string, React.ReactNode>;
  registerLabel: (value: string, label: React.ReactNode) => void;
  unregisterLabel: (value: string) => void;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext(name: string) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) {
    throw new Error(`${name} must be used within Select`);
  }
  return ctx;
}

type SelectProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
};

function Select({ value, defaultValue, onValueChange, children }: SelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [labels, setLabels] = React.useState<Map<string, React.ReactNode>>(new Map());

  const currentValue = value ?? internalValue;

  const handleValueChange = React.useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [onValueChange, value],
  );

  const registerLabel = React.useCallback((key: string, label: React.ReactNode) => {
    setLabels((prev) => {
      const next = new Map(prev);
      next.set(key, label);
      return next;
    });
  }, []);

  const unregisterLabel = React.useCallback((key: string) => {
    setLabels((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const contextValue = React.useMemo<SelectContextValue>(
    () => ({
      value: currentValue,
      onValueChange: handleValueChange,
      open,
      setOpen,
      anchorEl,
      setAnchorEl,
      labels,
      registerLabel,
      unregisterLabel,
    }),
    [
      anchorEl,
      currentValue,
      handleValueChange,
      labels,
      open,
      registerLabel,
      unregisterLabel,
    ],
  );

  return (
    <SelectContext.Provider value={contextValue}>
      <div data-slot="select">{children}</div>
    </SelectContext.Provider>
  );
}

type SelectGroupProps = React.HTMLAttributes<HTMLDivElement>;

function SelectGroup({ className, ...props }: SelectGroupProps) {
  return <div data-slot="select-group" className={className} {...props} />;
}

type SelectValueProps = {
  placeholder?: React.ReactNode;
};

function SelectValue({ placeholder }: SelectValueProps) {
  const { value, labels } = useSelectContext("SelectValue");
  const selected = value ? labels.get(value) : undefined;

  return (
    <span data-slot="select-value" className="line-clamp-1 flex items-center gap-2">
      {selected ?? placeholder}
    </span>
  );
}

type SelectTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "default";
};

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectTriggerProps) {
  const { open, setOpen, setAnchorEl } = useSelectContext("SelectTrigger");

  return (
    <button
      type="button"
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      onClick={(e) => {
        setAnchorEl(e.currentTarget);
        setOpen(!open);
      }}
      aria-haspopup="listbox"
      aria-expanded={open}
      {...props}
    >
      {children}
      {open ? (
        <ChevronUpIcon className="size-4 opacity-50" />
      ) : (
        <ChevronDownIcon className="size-4 opacity-50" />
      )}
    </button>
  );
}

type SelectContentProps = {
  className?: string;
  children: React.ReactNode;
};

function SelectContent({ className, children }: SelectContentProps) {
  const { open, setOpen, anchorEl } = useSelectContext("SelectContent");

  return (
    <Menu
      open={open}
      anchorEl={anchorEl}
      onClose={() => setOpen(false)}
      MenuListProps={{
        className: "p-1",
      }}
      slotProps={{
        paper: {
          className: cn(
            "bg-popover text-popover-foreground min-w-[8rem] rounded-md border shadow-md",
            className,
          ),
        },
      }}
    >
      {children}
    </Menu>
  );
}

type SelectLabelProps = React.HTMLAttributes<HTMLDivElement>;

function SelectLabel({ className, ...props }: SelectLabelProps) {
  return (
    <div
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  );
}

type SelectItemProps = {
  value: string;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
};

function SelectItem({ value, className, children, disabled }: SelectItemProps) {
  const { value: currentValue, onValueChange, setOpen, registerLabel, unregisterLabel } =
    useSelectContext("SelectItem");

  React.useEffect(() => {
    registerLabel(value, children);
    return () => unregisterLabel(value);
  }, [children, registerLabel, unregisterLabel, value]);

  const isSelected = currentValue === value;

  return (
    <MenuItem
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex w-full items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm",
        className,
      )}
      selected={isSelected}
      disabled={disabled}
      onClick={() => {
        onValueChange?.(value);
        setOpen(false);
      }}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        {isSelected ? <CheckIcon className="size-4" /> : null}
      </span>
      {children}
    </MenuItem>
  );
}

type SelectSeparatorProps = React.ComponentProps<typeof Divider>;

function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  return (
    <Divider
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1", className)}
      {...props}
    />
  );
}

type ScrollButtonProps = React.HTMLAttributes<HTMLDivElement>;

function SelectScrollUpButton({ className, ...props }: ScrollButtonProps) {
  return (
    <div
      data-slot="select-scroll-up-button"
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </div>
  );
}

function SelectScrollDownButton({ className, ...props }: ScrollButtonProps) {
  return (
    <div
      data-slot="select-scroll-down-button"
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </div>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
