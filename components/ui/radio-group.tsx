'use client'

import * as React from 'react'
import { CircleIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type RadioGroupContextValue = {
  value?: string
  onValueChange?: (value: string) => void
  name?: string
  disabled?: boolean
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null)

function useRadioGroupContext(name: string) {
  const ctx = React.useContext(RadioGroupContext)
  if (!ctx) throw new Error(`${name} must be used within RadioGroup`)
  return ctx
}

type RadioGroupProps = React.ComponentProps<'div'> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  disabled?: boolean
}

function RadioGroup({ className, value, defaultValue, onValueChange, name, disabled, children, ...props }: RadioGroupProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const currentValue = value ?? internalValue

  return (
    <RadioGroupContext.Provider
      value={{
        value: currentValue,
        onValueChange: (next) => {
          if (value === undefined) setInternalValue(next)
          onValueChange?.(next)
        },
        name,
        disabled,
      }}
    >
      <div data-slot="radio-group" className={cn('grid gap-3', className)} role="radiogroup" {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

type RadioGroupItemProps = Omit<React.ComponentProps<'button'>, 'value'> & {
  value: string
}

function RadioGroupItem({ className, value, disabled, ...props }: RadioGroupItemProps) {
  const group = useRadioGroupContext('RadioGroupItem')
  const isSelected = group.value === value
  const isDisabled = disabled || group.disabled

  return (
    <button
      data-slot="radio-group-item"
      type="button"
      role="radio"
      aria-checked={isSelected}
      disabled={isDisabled}
      className={cn(
        'border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 relative',
        className,
      )}
      onClick={(e) => {
        props.onClick?.(e)
        if (!e.defaultPrevented && !isDisabled) group.onValueChange?.(value)
      }}
      {...props}
    >
      <input type="radio" hidden readOnly checked={isSelected} name={group.name} value={value} />
      {isSelected ? (
        <span data-slot="radio-group-indicator" className="relative flex items-center justify-center">
          <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
        </span>
      ) : null}
    </button>
  )
}

export { RadioGroup, RadioGroupItem }
