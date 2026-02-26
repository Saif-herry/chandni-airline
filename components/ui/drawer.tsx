'use client'

import * as React from 'react'
import MuiDrawer from '@mui/material/Drawer'

import { cn } from '@/lib/utils'

type DrawerDirection = 'top' | 'bottom' | 'left' | 'right'

type DrawerContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  direction: DrawerDirection
}

const DrawerContext = React.createContext<DrawerContextValue | null>(null)

function useDrawerContext(name: string) {
  const ctx = React.useContext(DrawerContext)
  if (!ctx) throw new Error(`${name} must be used within Drawer`)
  return ctx
}

function Drawer({
  open,
  defaultOpen = false,
  onOpenChange,
  direction = 'bottom',
  children,
}: {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  direction?: DrawerDirection
  children: React.ReactNode
}) {
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
    <DrawerContext.Provider value={{ open: isOpen, setOpen, direction }}>
      <div data-slot="drawer">{children}</div>
    </DrawerContext.Provider>
  )
}

function DrawerTrigger({ children, ...props }: React.ComponentProps<'button'>) {
  const { setOpen } = useDrawerContext('DrawerTrigger')

  return (
    <button
      data-slot="drawer-trigger"
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

function DrawerPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function DrawerClose({ children, ...props }: React.ComponentProps<'button'>) {
  const { setOpen } = useDrawerContext('DrawerClose')

  return (
    <button
      data-slot="drawer-close"
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

function DrawerOverlay({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-overlay"
      className={cn('fixed inset-0 z-50 bg-black/50', className)}
      {...props}
    />
  )
}

function DrawerContent({ className, children, ...props }: React.ComponentProps<'div'>) {
  const { open, setOpen, direction } = useDrawerContext('DrawerContent')

  return (
    <DrawerPortal>
      <MuiDrawer
        open={open}
        anchor={direction}
        onClose={() => setOpen(false)}
        PaperProps={{
          className: cn(
            'group/drawer-content bg-background fixed z-50 flex h-auto flex-col',
            direction === 'top' &&
              'inset-x-0 top-0 mb-24 max-h-[80vh] rounded-b-lg border-b',
            direction === 'bottom' &&
              'inset-x-0 bottom-0 mt-24 max-h-[80vh] rounded-t-lg border-t',
            direction === 'right' &&
              'inset-y-0 right-0 w-3/4 border-l sm:max-w-sm',
            direction === 'left' &&
              'inset-y-0 left-0 w-3/4 border-r sm:max-w-sm',
            className,
          ),
        }}
      >
        <div data-slot="drawer-content" data-vaul-drawer-direction={direction} {...props}>
          <div className="bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
          {children}
        </div>
      </MuiDrawer>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        'flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left',
        className,
      )}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  )
}

function DrawerTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return (
    <h2
      data-slot="drawer-title"
      className={cn('text-foreground font-semibold', className)}
      {...props}
    />
  )
}

function DrawerDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="drawer-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
