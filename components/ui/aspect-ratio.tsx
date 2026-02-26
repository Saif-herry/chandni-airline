'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type AspectRatioProps = React.HTMLAttributes<HTMLDivElement> & {
  ratio?: number
}

function AspectRatio({ ratio = 1, className, children, style, ...props }: AspectRatioProps) {
  return (
    <div
      data-slot="aspect-ratio"
      className={cn('relative w-full', className)}
      style={{ ...style, aspectRatio: String(ratio) }}
      {...props}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  )
}

export { AspectRatio }
