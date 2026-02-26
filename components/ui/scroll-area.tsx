'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

type ScrollAreaProps = React.HTMLAttributes<HTMLDivElement>

function ScrollArea({ className, children, ...props }: ScrollAreaProps) {
  return (
    <div data-slot="scroll-area" className={cn('relative overflow-hidden', className)} {...props}>
      <div
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full overflow-auto rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
      >
        {children}
      </div>
    </div>
  )
}

type ScrollBarProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: 'vertical' | 'horizontal'
}

function ScrollBar({ className, orientation = 'vertical', ...props }: ScrollBarProps) {
  return (
    <div
      data-slot="scroll-area-scrollbar"
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute flex touch-none p-px transition-colors select-none',
        orientation === 'vertical' && 'inset-y-0 right-0 w-2.5 border-l border-l-transparent',
        orientation === 'horizontal' && 'inset-x-0 bottom-0 h-2.5 flex-col border-t border-t-transparent',
        className,
      )}
      {...props}
    >
      <div data-slot="scroll-area-thumb" className="bg-border relative flex-1 rounded-full" />
    </div>
  )
}

export { ScrollArea, ScrollBar }
