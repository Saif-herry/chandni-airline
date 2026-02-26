'use client'

import * as React from 'react'
import Menu from '@mui/material/Menu'
import Divider from '@mui/material/Divider'
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type DropdownMenuContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  anchorEl: HTMLElement | null
  setAnchorEl: (el: HTMLElement | null) => void
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null)

function useDropdownMenuContext(name: string) {
  const ctx = React.useContext(DropdownMenuContext)
  if (!ctx) throw new Error(`${name} must be used within DropdownMenu`)
  return ctx
}

function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, anchorEl, setAnchorEl }}>
      <div data-slot="dropdown-menu">{children}</div>
    </DropdownMenuContext.Provider>
  )
}

function DropdownMenuTrigger({ children, ...props }: React.ComponentProps<'button'>) {
  const { open, setOpen, setAnchorEl } = useDropdownMenuContext('DropdownMenuTrigger')

  return (
    <button
      data-slot="dropdown-menu-trigger"
      type="button"
      onClick={(e) => {
        props.onClick?.(e)
        if (!e.defaultPrevented) {
          setAnchorEl(e.currentTarget)
          setOpen(!open)
        }
      }}
      {...props}
    >
      {children}
    </button>
  )
}

function DropdownMenuPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function DropdownMenuContent({ className, children, ...props }: React.ComponentProps<'div'>) {
  const { open, setOpen, anchorEl } = useDropdownMenuContext('DropdownMenuContent')

  return (
    <Menu
      open={open}
      anchorEl={anchorEl}
      onClose={() => setOpen(false)}
      slotProps={{
        paper: {
          className: cn('bg-popover text-popover-foreground min-w-[8rem] rounded-md border p-1 shadow-md', className),
        },
      }}
    >
      <div data-slot="dropdown-menu-content" {...props}>
        {children}
      </div>
    </Menu>
  )
}

function DropdownMenuGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="dropdown-menu-group" className={className} {...props} />
}

function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  onSelect,
  ...props
}: React.ComponentProps<'div'> & {
  inset?: boolean
  variant?: 'default' | 'destructive'
  onSelect?: () => void
}) {
  const { setOpen } = useDropdownMenuContext('DropdownMenuItem')

  return (
    <button
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      type="button"
      className={cn(
        'relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm data-[inset=true]:pl-8 hover:bg-accent',
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

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  onCheckedChange,
  ...props
}: Omit<React.ComponentProps<'div'>, 'onSelect'> & {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}) {
  return (
    <DropdownMenuItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn('pl-8', className)}
      onSelect={() => onCheckedChange?.(!checked)}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        {checked ? <CheckIcon className="size-4" /> : null}
      </span>
      {children}
    </DropdownMenuItem>
  )
}

type RadioCtxValue = { value?: string; onValueChange?: (value: string) => void }
const RadioCtx = React.createContext<RadioCtxValue>({})

function DropdownMenuRadioGroup({ value, onValueChange, ...props }: React.ComponentProps<'div'> & RadioCtxValue) {
  return (
    <RadioCtx.Provider value={{ value, onValueChange }}>
      <div data-slot="dropdown-menu-radio-group" {...props} />
    </RadioCtx.Provider>
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  value,
  ...props
}: Omit<React.ComponentProps<'div'>, 'onSelect'> & { value: string }) {
  const radio = React.useContext(RadioCtx)
  const checked = radio.value === value

  return (
    <DropdownMenuItem
      data-slot="dropdown-menu-radio-item"
      className={cn('pl-8', className)}
      onSelect={() => radio.onValueChange?.(value)}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        {checked ? <CircleIcon className="size-2 fill-current" /> : null}
      </span>
      {children}
    </DropdownMenuItem>
  )
}

function DropdownMenuLabel({ className, inset, ...props }: React.ComponentProps<'div'> & { inset?: boolean }) {
  return (
    <div
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn('px-2 py-1.5 text-sm font-medium data-[inset=true]:pl-8', className)}
      {...props}
    />
  )
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof Divider>) {
  return <Divider data-slot="dropdown-menu-separator" className={cn('-mx-1 my-1', className)} {...props} />
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)}
      {...props}
    />
  )
}

function DropdownMenuSub({ ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  inset?: boolean
}) {
  return (
    <div
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn('flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm data-[inset=true]:pl-8', className)}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </div>
  )
}

function DropdownMenuSubContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dropdown-menu-sub-content"
      className={cn('bg-popover text-popover-foreground min-w-[8rem] rounded-md border p-1 shadow-lg', className)}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
