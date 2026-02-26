'use client'

import * as React from 'react'
import MuiPopover from '@mui/material/Popover'

import { cn } from '@/lib/utils'

type HoverCardContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  anchorEl: HTMLElement | null
  setAnchorEl: (el: HTMLElement | null) => void
}

const HoverCardContext = React.createContext<HoverCardContextValue | null>(null)

function useHoverCardContext(name: string) {
  const ctx = React.useContext(HoverCardContext)
  if (!ctx) throw new Error(`${name} must be used within HoverCard`)
  return ctx
}

function HoverCard({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

  return (
    <HoverCardContext.Provider value={{ open, setOpen, anchorEl, setAnchorEl }}>
      {children}
    </HoverCardContext.Provider>
  )
}

function HoverCardTrigger({ children, ...props }: React.ComponentProps<'div'>) {
  const { setOpen, setAnchorEl } = useHoverCardContext('HoverCardTrigger')

  return (
    <div
      data-slot="hover-card-trigger"
      onMouseEnter={(e) => {
        setAnchorEl(e.currentTarget)
        setOpen(true)
      }}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </div>
  )
}

function HoverCardContent({ className, children, ...props }: React.ComponentProps<'div'>) {
  const { open, setOpen, anchorEl } = useHoverCardContext('HoverCardContent')

  return (
    <MuiPopover
      open={open}
      anchorEl={anchorEl}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      slotProps={{
        paper: {
          onMouseEnter: () => setOpen(true),
          onMouseLeave: () => setOpen(false),
          className: cn('bg-popover text-popover-foreground w-64 rounded-md border p-4 shadow-md', className),
        },
      }}
    >
      <div data-slot="hover-card-content" {...props}>
        {children}
      </div>
    </MuiPopover>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
