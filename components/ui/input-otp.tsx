'use client'

import * as React from 'react'
import { MinusIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type OTPInputSlot = {
  char: string
  hasFakeCaret: boolean
  isActive: boolean
}

type OTPInputContextValue = {
  slots: OTPInputSlot[]
}

const OTPInputContext = React.createContext<OTPInputContextValue | null>(null)

type InputOTPProps = Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> & {
  value?: string
  onChange?: (value: string) => void
  maxLength: number
  containerClassName?: string
  children?: React.ReactNode
}

function InputOTP({
  className,
  containerClassName,
  value,
  onChange,
  maxLength,
  disabled,
  name,
  children,
  ...props
}: InputOTPProps) {
  const [internalValue, setInternalValue] = React.useState('')
  const [focused, setFocused] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(0)

  const currentValue = (value ?? internalValue).slice(0, maxLength)

  const updateValue = React.useCallback(
    (next: string) => {
      const normalized = next.replace(/\s+/g, '').slice(0, maxLength)
      if (value === undefined) {
        setInternalValue(normalized)
      }
      onChange?.(normalized)
      setActiveIndex(Math.min(normalized.length, Math.max(maxLength - 1, 0)))
    },
    [maxLength, onChange, value],
  )

  const slots = React.useMemo<OTPInputSlot[]>(() => {
    return Array.from({ length: maxLength }).map((_, index) => {
      const char = currentValue[index] ?? ''
      const isActive = focused && index === activeIndex
      return {
        char,
        isActive,
        hasFakeCaret: isActive && !char,
      }
    })
  }, [activeIndex, currentValue, focused, maxLength])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return

    const key = event.key

    if (key === 'ArrowLeft') {
      event.preventDefault()
      setActiveIndex((prev) => Math.max(prev - 1, 0))
      return
    }

    if (key === 'ArrowRight') {
      event.preventDefault()
      setActiveIndex((prev) => Math.min(prev + 1, maxLength - 1))
      return
    }

    if (key === 'Backspace') {
      event.preventDefault()
      if (!currentValue.length) return

      const chars = currentValue.split('')
      const target = currentValue[activeIndex]
        ? activeIndex
        : Math.max(activeIndex - 1, 0)
      chars.splice(target, 1)
      updateValue(chars.join(''))
      setActiveIndex(target)
      return
    }

    if (key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault()
      const chars = currentValue.split('')
      chars.splice(activeIndex, 0, key)
      updateValue(chars.join(''))
      setActiveIndex((prev) => Math.min(prev + 1, maxLength - 1))
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    if (disabled) return
    event.preventDefault()
    const pasted = event.clipboardData.getData('text')
    updateValue(pasted)
  }

  return (
    <OTPInputContext.Provider value={{ slots }}>
      <div
        data-slot="input-otp"
        tabIndex={disabled ? -1 : 0}
        className={cn('outline-none', className)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        aria-disabled={disabled}
      >
        <input
          type="hidden"
          name={name}
          value={currentValue}
          disabled={disabled}
          {...props}
        />
        <div
          className={cn(
            'flex items-center gap-2 has-disabled:opacity-50',
            containerClassName,
          )}
        >
          {children}
        </div>
      </div>
    </OTPInputContext.Provider>
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn('flex items-center', className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {
    char: '',
    hasFakeCaret: false,
    isActive: false,
  }

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        'data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]',
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
