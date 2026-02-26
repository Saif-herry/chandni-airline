'use client'

import * as React from 'react'
import { CheckIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type CheckboxProps = Omit<React.ComponentProps<'button'>, 'onChange' | 'value'> & {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  name?: string
  value?: string
}

function Checkbox({
  className,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  name,
  value,
  ...props
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
  const isChecked = checked ?? internalChecked

  return (
    <button
      data-slot="checkbox"
      type="button"
      role="checkbox"
      aria-checked={isChecked}
      disabled={disabled}
      className={cn(
        'peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 inline-flex items-center justify-center',
        isChecked ? 'bg-primary text-primary-foreground border-primary' : '',
        className,
      )}
      onClick={(e) => {
        props.onClick?.(e)
        if (e.defaultPrevented || disabled) return
        const next = !isChecked
        if (checked === undefined) setInternalChecked(next)
        onCheckedChange?.(next)
      }}
      {...props}
    >
      <input type="checkbox" hidden readOnly checked={isChecked} name={name} value={value} />
      {isChecked ? (
        <span data-slot="checkbox-indicator" className="flex items-center justify-center text-current transition-none">
          <CheckIcon className="size-3.5" />
        </span>
      ) : null}
    </button>
  )
}

export { Checkbox }
