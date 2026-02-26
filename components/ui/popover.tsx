'use client'

import * as React from 'react'
import MuiPopover from '@mui/material/Popover'

import { cn } from '@/lib/utils'

type PopoverContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  anchorEl: HTMLElement | null
  setAnchorEl: (anchor: HTMLElement | null) => void
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null)

function usePopoverContext(name: string) {
  const ctx = React.useContext(PopoverContext)
  if (!ctx) throw new Error(`${name} must be used within Popover`)
  return ctx
}

type PopoverProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function Popover({ open, defaultOpen = false, onOpenChange, children }: PopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const isOpen = open ?? internalOpen

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (open === undefined) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [onOpenChange, open],
  )

  return (
    <PopoverContext.Provider value={{ open: isOpen, setOpen, anchorEl, setAnchorEl }}>
      {children}
    </PopoverContext.Provider>
  )
}

function PopoverTrigger({ children, ...props }: React.ComponentProps<'button'>) {
  const { setOpen, setAnchorEl } = usePopoverContext('PopoverTrigger')

  return (
    <button
      data-slot="popover-trigger"
      type="button"
      onClick={(e) => {
        props.onClick?.(e)
        if (!e.defaultPrevented) {
          setAnchorEl(e.currentTarget)
          setOpen(true)
        }
      }}
      {...props}
    >
      {children}
    </button>
  )
}

function PopoverContent({ className, children, ...props }: React.ComponentProps<'div'>) {
  const { open, setOpen, anchorEl } = usePopoverContext('PopoverContent')

  return (
    <MuiPopover
      open={open}
      anchorEl={anchorEl}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      slotProps={{
        paper: {
          className: cn('bg-popover text-popover-foreground w-72 rounded-md border p-4 shadow-md', className),
        },
      }}
    >
      <div data-slot="popover-content" {...props}>
        {children}
      </div>
    </MuiPopover>
  )
}

function PopoverAnchor({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
