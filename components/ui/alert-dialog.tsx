"use client";

import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";

import { cn } from "@/lib/utils";

const AlertDialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

function AlertDialog({
  children,
  open: controlledOpen,
  onOpenChange,
  ...props
}: React.PropsWithChildren & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  [key: string]: any;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

function AlertDialogTrigger({
  children,
  asChild,
  ...props
}: React.PropsWithChildren & { asChild?: boolean; [key: string]: any }) {
  const { setOpen } = React.useContext(AlertDialogContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e: any) => {
        setOpen(true);
        (children.props as any)?.onClick?.(e);
      },
    } as any);
  }

  return (
    <button
      data-slot="alert-dialog-trigger"
      onClick={() => setOpen(true)}
      {...props}
    >
      {children}
    </button>
  );
}

function AlertDialogPortal({
  children,
  ...props
}: React.PropsWithChildren & { [key: string]: any }) {
  return <>{children}</>;
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-overlay"
      className={cn("fixed inset-0 z-50 bg-black/50", className)}
      {...props}
    />
  );
}

function AlertDialogContent({
  className,
  children,
  ...props
}: React.PropsWithChildren & React.ComponentProps<"div">) {
  const { open, setOpen } = React.useContext(AlertDialogContext);

  return (
    <Dialog
      data-slot="alert-dialog-content"
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        className: cn("rounded-lg", className),
        sx: {
          borderRadius: "0.5rem",
        },
      }}
      {...props}
    >
      {children}
    </Dialog>
  );
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogTitle>) {
  return (
    <DialogTitle
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogContentText>) {
  return (
    <DialogContent>
      <DialogContentText
        data-slot="alert-dialog-description"
        className={cn("text-muted-foreground text-sm", className)}
        {...props}
      />
    </DialogContent>
  );
}

function AlertDialogAction({
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { setOpen } = React.useContext(AlertDialogContext);

  return (
    <Button
      variant="contained"
      onClick={(e) => {
        setOpen(false);
        onClick?.(e as any);
      }}
      className={cn("", className)}
      {...props}
    >
      {children}
    </Button>
  );
}

function AlertDialogCancel({
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { setOpen } = React.useContext(AlertDialogContext);

  return (
    <Button
      variant="outlined"
      onClick={(e) => {
        setOpen(false);
        onClick?.(e as any);
      }}
      className={cn("", className)}
      {...props}
    >
      {children}
    </Button>
  );
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
