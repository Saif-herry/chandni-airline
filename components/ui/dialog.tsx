'use client'

import * as React from 'react'
import MuiDialog from '@mui/material/Dialog'
import DialogTitleBase from '@mui/material/DialogTitle'
import DialogContentBase from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { XIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type DialogContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

type DialogProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function Dialog({ open, defaultOpen = false, onOpenChange, children }: DialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const isOpen = open ?? internalOpen

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (open === undefined) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [onOpenChange, open],
  )

  return <DialogContext.Provider value={{ open: isOpen, setOpen }}>{children}</DialogContext.Provider>
}

function useDialogContext(name: string) {
  const ctx = React.useContext(DialogContext)
  if (!ctx) throw new Error(`${name} must be used within Dialog`)
  return ctx
}

function DialogTrigger({ children, ...props }: React.ComponentProps<'button'>) {
  const { setOpen } = useDialogContext('DialogTrigger')

  return (
    <button
      data-slot="dialog-trigger"
      type="button"
      onClick={(e) => {
        props.onClick?.(e)
        if (!e.defaultPrevented) setOpen(true)
      }}
      {...props}
    >
      {children}
    </button>
  )
}

function DialogPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function DialogClose({ children, ...props }: React.ComponentProps<'button'>) {
  const { setOpen } = useDialogContext('DialogClose')

  return (
    <button
      data-slot="dialog-close"
      type="button"
      onClick={(e) => {
        props.onClick?.(e)
        if (!e.defaultPrevented) setOpen(false)
      }}
      {...props}
    >
      {children}
    </button>
  )
}

function DialogOverlay({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="dialog-overlay" className={cn('fixed inset-0 z-50 bg-black/50', className)} {...props} />
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<'div'> & {
  showCloseButton?: boolean
}) {
  const { open, setOpen } = useDialogContext('DialogContent')

  return (
    <MuiDialog
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        className: cn(
          'bg-background w-full max-w-[calc(100%-2rem)] sm:max-w-lg rounded-lg border p-0 shadow-lg',
          className,
        ),
      }}
      {...props}
    >
      <DialogContentBase className="!p-6 relative" data-slot="dialog-content">
        {children}
        {showCloseButton && (
          <button
            data-slot="dialog-close"
            type="button"
            onClick={() => setOpen(false)}
            className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
          >
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </DialogContentBase>
    </MuiDialog>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <DialogActions
      data-slot="dialog-footer"
      className={cn('!m-0 !p-0 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return <DialogTitleBase data-slot="dialog-title" className={cn('text-lg leading-none font-semibold !p-0', className)} {...props} />
}

function DialogDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return <p data-slot="dialog-description" className={cn('text-muted-foreground text-sm', className)} {...props} />
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
