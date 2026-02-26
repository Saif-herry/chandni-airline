'use client'

import * as React from 'react'
import Menu from '@mui/material/Menu'
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { DropdownMenuSeparator as ContextMenuSeparator } from '@/components/ui/dropdown-menu'

type ContextMenuState = {
  open: boolean
  setOpen: (open: boolean) => void
  anchorPosition: { top: number; left: number } | null
  setAnchorPosition: (position: { top: number; left: number } | null) => void
}

const ContextMenuCtx = React.createContext<ContextMenuState | null>(null)

function useCtx(name: string) {
  const ctx = React.useContext(ContextMenuCtx)
  if (!ctx) throw new Error(`${name} must be used within ContextMenu`)
  return ctx
}

function ContextMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [anchorPosition, setAnchorPosition] = React.useState<{ top: number; left: number } | null>(null)

  return <ContextMenuCtx.Provider value={{ open, setOpen, anchorPosition, setAnchorPosition }}>{children}</ContextMenuCtx.Provider>
}

function ContextMenuTrigger({ children, ...props }: React.ComponentProps<'div'>) {
  const { setOpen, setAnchorPosition } = useCtx('ContextMenuTrigger')

  return (
    <div
      data-slot="context-menu-trigger"
      onContextMenu={(e) => {
        e.preventDefault()
        setAnchorPosition({ top: e.clientY, left: e.clientX })
        setOpen(true)
      }}
      {...props}
    >
      {children}
    </div>
  )
}

function ContextMenuPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function ContextMenuContent({ className, children, ...props }: React.ComponentProps<'div'>) {
  const { open, setOpen, anchorPosition } = useCtx('ContextMenuContent')

  return (
    <Menu
      open={open}
      onClose={() => setOpen(false)}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition ?? undefined}
      slotProps={{
        paper: {
          className: cn('bg-popover text-popover-foreground min-w-[8rem] rounded-md border p-1 shadow-md', className),
        },
      }}
    >
      <div data-slot="context-menu-content" {...props}>
        {children}
      </div>
    </Menu>
  )
}

function ContextMenuGroup(props: React.ComponentProps<'div'>) {
  return <div data-slot="context-menu-group" {...props} />
}

function ContextMenuItem({
  className,
  inset,
  variant = 'default',
  onSelect,
  ...props
}: React.ComponentProps<'button'> & {
  inset?: boolean
  variant?: 'default' | 'destructive'
  onSelect?: () => void
}) {
  const { setOpen } = useCtx('ContextMenuItem')

  return (
    <button
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        'flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm data-[inset=true]:pl-8 hover:bg-accent',
        variant === 'destructive' ? 'text-destructive' : '',
        className,
      )}
      onClick={() => {
        onSelect?.()
        setOpen(false)
      }}
      {...(props as Omit<React.ComponentProps<'button'>, 'onSelect'>)}
    />
  )
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  onCheckedChange,
  ...props
}: Omit<React.ComponentProps<'button'>, 'onSelect'> & {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}) {
  return (
    <ContextMenuItem
      data-slot="context-menu-checkbox-item"
      className={cn('relative pl-8', className)}
      onSelect={() => onCheckedChange?.(!checked)}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        {checked ? <CheckIcon className="size-4" /> : null}
      </span>
      {children}
    </ContextMenuItem>
  )
}

const RadioCtx = React.createContext<{ value?: string; onValueChange?: (v: string) => void }>({})

function ContextMenuRadioGroup({ value, onValueChange, ...props }: React.ComponentProps<'div'> & { value?: string; onValueChange?: (value: string) => void }) {
  return (
    <RadioCtx.Provider value={{ value, onValueChange }}>
      <div data-slot="context-menu-radio-group" {...props} />
    </RadioCtx.Provider>
  )
}

function ContextMenuRadioItem({
  className,
  children,
  value,
  ...props
}: Omit<React.ComponentProps<'button'>, 'onSelect'> & { value: string }) {
  const radio = React.useContext(RadioCtx)
  const checked = radio.value === value

  return (
    <ContextMenuItem
      data-slot="context-menu-radio-item"
      className={cn('relative pl-8', className)}
      onSelect={() => radio.onValueChange?.(value)}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        {checked ? <CircleIcon className="size-2 fill-current" /> : null}
      </span>
      {children}
    </ContextMenuItem>
  )
}

function ContextMenuLabel({ className, inset, ...props }: React.ComponentProps<'div'> & { inset?: boolean }) {
  return (
    <div
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn('text-foreground px-2 py-1.5 text-sm font-medium data-[inset=true]:pl-8', className)}
      {...props}
    />
  )
}

function ContextMenuShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)}
      {...props}
    />
  )
}

function ContextMenuSub(props: React.ComponentProps<'div'>) {
  return <div data-slot="context-menu-sub" {...props} />
}

function ContextMenuSubTrigger({ className, inset, children, ...props }: React.ComponentProps<'div'> & { inset?: boolean }) {
  return (
    <div
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn('flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm data-[inset=true]:pl-8', className)}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </div>
  )
}

function ContextMenuSubContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="context-menu-sub-content"
      className={cn('bg-popover text-popover-foreground z-50 min-w-[8rem] rounded-md border p-1 shadow-lg', className)}
      {...props}
    />
  )
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
