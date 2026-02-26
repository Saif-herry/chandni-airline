'use client'

import * as React from 'react'
import { SearchIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type CommandContextValue = {
  query: string
  setQuery: (value: string) => void
}

const CommandContext = React.createContext<CommandContextValue | null>(null)

function useCommandContext(name: string) {
  const ctx = React.useContext(CommandContext)
  if (!ctx) throw new Error(`${name} must be used within <Command />`)
  return ctx
}

function Command({ className, children, ...props }: React.ComponentProps<'div'>) {
  const [query, setQuery] = React.useState('')

  return (
    <CommandContext.Provider value={{ query, setQuery }}>
      <div
        data-slot="command"
        className={cn(
          'bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </CommandContext.Provider>
  )
}

function CommandDialog({
  title = 'Command Palette',
  description = 'Search for a command to run...',
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn('overflow-hidden p-0', className)}
        showCloseButton={showCloseButton}
      >
        <Command className="[&_[data-slot=command-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[data-slot=command-group-heading]]:px-2 [&_[data-slot=command-group-heading]]:font-medium [&_[data-slot=command-group]]:px-2 [&_[data-slot=command-group]:not([hidden])_~[data-slot=command-group]]:pt-0 [&_[data-slot=command-input-wrapper]_svg]:h-5 [&_[data-slot=command-input-wrapper]_svg]:w-5 [&_[data-slot=command-input]]:h-12 [&_[data-slot=command-item]]:px-2 [&_[data-slot=command-item]]:py-3 [&_[data-slot=command-item]_svg]:h-5 [&_[data-slot=command-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  onChange,
  ...props
}: React.ComponentProps<'input'>) {
  const { setQuery } = useCommandContext('CommandInput')

  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 items-center gap-2 border-b px-3"
    >
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <input
        data-slot="command-input"
        className={cn(
          'placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        onChange={(e) => {
          setQuery(e.target.value)
          onChange?.(e)
        }}
        {...props}
      />
    </div>
  )
}

function CommandList({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="command-list"
      className={cn(
        'max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto',
        className,
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  children = 'No results found.',
  ...props
}: React.ComponentProps<'div'>) {
  const { query } = useCommandContext('CommandEmpty')

  if (!query) return null

  return (
    <div
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    >
      {children}
    </div>
  )
}

function CommandGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="command-group"
      className={cn(
        'text-foreground overflow-hidden p-1',
        className,
      )}
      {...props}
    />
  )
}

function CommandSeparator({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="command-separator"
      className={cn('bg-border -mx-1 h-px', className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  disabled,
  ...props
}: React.ComponentProps<'button'>) {
  return (
    <button
      data-slot="command-item"
      data-disabled={disabled}
      disabled={disabled}
      className={cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        'text-muted-foreground ml-auto text-xs tracking-widest',
        className,
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
