'use client'

import * as React from 'react'

type CollapsibleContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null)

function useCollapsibleContext(name: string) {
  const ctx = React.useContext(CollapsibleContext)
  if (!ctx) throw new Error(`${name} must be used within Collapsible`)
  return ctx
}

type CollapsibleProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function Collapsible({ open, defaultOpen = false, onOpenChange, children }: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const isOpen = open ?? internalOpen

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (open === undefined) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [onOpenChange, open],
  )

  return (
    <CollapsibleContext.Provider value={{ open: isOpen, setOpen }}>
      <div data-slot="collapsible">{children}</div>
    </CollapsibleContext.Provider>
  )
}

function CollapsibleTrigger({ children, ...props }: React.ComponentProps<'button'>) {
  const { open, setOpen } = useCollapsibleContext('CollapsibleTrigger')

  return (
    <button
      data-slot="collapsible-trigger"
      type="button"
      onClick={(e) => {
        props.onClick?.(e)
        if (!e.defaultPrevented) setOpen(!open)
      }}
      {...props}
    >
      {children}
    </button>
  )
}

function CollapsibleContent({ children, ...props }: React.ComponentProps<'div'>) {
  const { open } = useCollapsibleContext('CollapsibleContent')
  if (!open) return null

  return (
    <div data-slot="collapsible-content" {...props}>
      {children}
    </div>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
