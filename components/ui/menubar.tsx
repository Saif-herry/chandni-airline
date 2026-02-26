'use client'

import * as React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type MenubarContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  anchorEl: HTMLElement | null
  setAnchorEl: (el: HTMLElement | null) => void
}

const MenubarCtx = React.createContext<MenubarContextValue | null>(null)

function useMenubar(name: string) {
  const ctx = React.useContext(MenubarCtx)
  if (!ctx) throw new Error(`${name} must be used within Menubar`)
  return ctx
}

function Menubar({ className, ...props }: React.ComponentProps<'div'>) {
  const [open, setOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

  return (
    <MenubarCtx.Provider value={{ open, setOpen, anchorEl, setAnchorEl }}>
      <div
        data-slot="menubar"
        className={cn('bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs', className)}
        {...props}
      />
    </MenubarCtx.Provider>
  )
}

function MenubarMenu({ ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="menubar-menu" {...props} />
}

function MenubarGroup({ ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="menubar-group" {...props} />
}

function MenubarPortal({ ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="menubar-portal" {...props} />
}

function MenubarRadioGroup({ ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="menubar-radio-group" {...props} />
}

function MenubarTrigger({ className, ...props }: React.ComponentProps<'button'>) {
  const { open, setOpen, setAnchorEl } = useMenubar('MenubarTrigger')

  return (
    <button
      data-slot="menubar-trigger"
      className={cn(
        'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none',
        className,
      )}
      onClick={(e) => {
        props.onClick?.(e)
        if (!e.defaultPrevented) {
          setAnchorEl(e.currentTarget)
          setOpen(!open)
        }
      }}
      {...props}
    />
  )
}

function MenubarContent({ className, children, ...props }: React.ComponentProps<'div'>) {
  const { open, setOpen, anchorEl } = useMenubar('MenubarContent')

  return (
    <Menu
      open={open}
      anchorEl={anchorEl}
      onClose={() => setOpen(false)}
      slotProps={{ paper: { className: cn('bg-popover text-popover-foreground min-w-[12rem] rounded-md border p-1 shadow-md', className) } }}
    >
      <div data-slot="menubar-content" {...props}>
        {children}
      </div>
    </Menu>
  )
}

function MenubarItem({
  className,
  inset,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof MenuItem> & {
  inset?: boolean
  variant?: 'default' | 'destructive'
}) {
  return (
    <MenuItem
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={cn('relative flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm data-[inset=true]:pl-8', variant === 'destructive' ? 'text-destructive' : '', className)}
      {...props}
    />
  )
}

function MenubarCheckboxItem({ className, children, checked, ...props }: React.ComponentProps<typeof MenuItem> & { checked?: boolean }) {
  return (
    <MenubarItem data-slot="menubar-checkbox-item" className={cn('pl-8', className)} {...props}>
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        {checked ? <CheckIcon className="size-4" /> : null}
      </span>
      {children}
    </MenubarItem>
  )
}

function MenubarRadioItem({ className, children, checked, ...props }: React.ComponentProps<typeof MenuItem> & { checked?: boolean }) {
  return (
    <MenubarItem data-slot="menubar-radio-item" className={cn('pl-8', className)} {...props}>
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        {checked ? <CircleIcon className="size-2 fill-current" /> : null}
      </span>
      {children}
    </MenubarItem>
  )
}

function MenubarLabel({ className, inset, ...props }: React.ComponentProps<'div'> & { inset?: boolean }) {
  return (
    <div
      data-slot="menubar-label"
      data-inset={inset}
      className={cn('px-2 py-1.5 text-sm font-medium data-[inset=true]:pl-8', className)}
      {...props}
    />
  )
}

function MenubarSeparator({ className, ...props }: React.ComponentProps<typeof Divider>) {
  return <Divider data-slot="menubar-separator" className={cn('-mx-1 my-1 h-px', className)} {...props} />
}

function MenubarShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)}
      {...props}
    />
  )
}

function MenubarSub({ ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="menubar-sub" {...props} />
}

function MenubarSubTrigger({ className, inset, children, ...props }: React.ComponentProps<'div'> & { inset?: boolean }) {
  return (
    <div
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn('flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm data-[inset=true]:pl-8', className)}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-4 w-4" />
    </div>
  )
}

function MenubarSubContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="menubar-sub-content"
      className={cn('bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg', className)}
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}
