import * as React from 'react'
import { cva } from 'class-variance-authority'
import { ChevronDownIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

function NavigationMenu({
  className,
  children,
  ...props
}: React.ComponentProps<'nav'> & {
  viewport?: boolean
}) {
  return (
    <nav
      data-slot="navigation-menu"
      className={cn('group/navigation-menu relative flex max-w-max flex-1 items-center justify-center', className)}
      {...props}
    >
      {children}
    </nav>
  )
}

function NavigationMenuList({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="navigation-menu-list"
      className={cn('group flex flex-1 list-none items-center justify-center gap-1', className)}
      {...props}
    />
  )
}

function NavigationMenuItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="navigation-menu-item"
      className={cn('relative', className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1',
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<'button'>) {
  return (
    <button
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), 'group', className)}
      {...props}
    >
      {children}{' '}
      <ChevronDownIcon
        className="relative top-[1px] ml-1 size-3 transition duration-300"
        aria-hidden="true"
      />
    </button>
  )
}

function NavigationMenuContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="navigation-menu-content"
      className={cn('top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto', className)}
      {...props}
    />
  )
}

function NavigationMenuViewport({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className="absolute top-full left-0 isolate z-50 flex justify-center">
      <div
        data-slot="navigation-menu-viewport"
        className={cn('origin-top-center bg-popover text-popover-foreground relative mt-1.5 w-full overflow-hidden rounded-md border shadow md:w-auto', className)}
        {...props}
      />
    </div>
  )
}

function NavigationMenuLink({ className, ...props }: React.ComponentProps<'a'>) {
  return (
    <a
      data-slot="navigation-menu-link"
      className={cn(
        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="navigation-menu-indicator"
      className={cn('top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden', className)}
      {...props}
    >
      <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
    </div>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
