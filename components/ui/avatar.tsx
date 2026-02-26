'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

type AvatarContextValue = {
  setImageLoaded: (loaded: boolean) => void
  imageLoaded: boolean
}

const AvatarContext = React.createContext<AvatarContextValue | null>(null)

function Avatar({ className, ...props }: React.ComponentProps<'span'>) {
  const [imageLoaded, setImageLoaded] = React.useState(false)

  return (
    <AvatarContext.Provider value={{ imageLoaded, setImageLoaded }}>
      <span
        data-slot="avatar"
        className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)}
        {...props}
      />
    </AvatarContext.Provider>
  )
}

function AvatarImage({ className, onLoad, onError, ...props }: React.ComponentProps<'img'>) {
  const ctx = React.useContext(AvatarContext)

  return (
    <img
      data-slot="avatar-image"
      className={cn('aspect-square size-full object-cover', className)}
      onLoad={(e) => {
        ctx?.setImageLoaded(true)
        onLoad?.(e)
      }}
      onError={(e) => {
        ctx?.setImageLoaded(false)
        onError?.(e)
      }}
      {...props}
    />
  )
}

function AvatarFallback({ className, ...props }: React.ComponentProps<'span'>) {
  const ctx = React.useContext(AvatarContext)
  if (ctx?.imageLoaded) return null

  return (
    <span
      data-slot="avatar-fallback"
      className={cn('bg-muted flex size-full items-center justify-center rounded-full', className)}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
