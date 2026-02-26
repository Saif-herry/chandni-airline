'use client'

import * as React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type CalendarProps = React.ComponentProps<'div'> & {
  selected?: Date
  onSelect?: (date: Date) => void
  month?: Date
  onMonthChange?: (month: Date) => void
  showOutsideDays?: boolean
  captionLayout?: 'label' | 'dropdown'
  buttonVariant?: React.ComponentProps<typeof Button>['variant']
  classNames?: Record<string, string>
  formatters?: {
    formatCaption?: (date: Date) => string
  }
}

type CalendarDayButtonProps = React.ComponentProps<typeof Button> & {
  day: Date
  selected?: boolean
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function buildCalendarGrid(month: Date) {
  const start = startOfMonth(month)
  const end = endOfMonth(month)
  const startWeekday = start.getDay()

  const days: Date[] = []

  for (let i = 0; i < startWeekday; i += 1) {
    const d = new Date(start)
    d.setDate(start.getDate() - (startWeekday - i))
    days.push(d)
  }

  for (let day = 1; day <= end.getDate(); day += 1) {
    days.push(new Date(month.getFullYear(), month.getMonth(), day))
  }

  while (days.length % 7 !== 0) {
    const next = new Date(days[days.length - 1])
    next.setDate(next.getDate() + 1)
    days.push(next)
  }

  return days
}

function Calendar({
  className,
  selected,
  onSelect,
  month,
  onMonthChange,
  showOutsideDays = true,
  buttonVariant = 'ghost',
  classNames,
  formatters,
  ...props
}: CalendarProps) {
  const [internalMonth, setInternalMonth] = React.useState(startOfMonth(month ?? new Date()))
  const currentMonth = month ? startOfMonth(month) : internalMonth

  React.useEffect(() => {
    if (month) setInternalMonth(startOfMonth(month))
  }, [month])

  const days = React.useMemo(() => buildCalendarGrid(currentMonth), [currentMonth])
  const monthLabel =
    formatters?.formatCaption?.(currentMonth) ??
    currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  const changeMonth = (delta: number) => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1)
    if (!month) setInternalMonth(next)
    onMonthChange?.(next)
  }

  return (
    <div
      data-slot="calendar"
      className={cn('bg-background w-fit rounded-md border p-3', className, classNames?.root)}
      {...props}
    >
      <div className={cn('mb-3 flex items-center justify-between gap-2', classNames?.nav)}>
        <Button variant={buttonVariant} size="icon" onClick={() => changeMonth(-1)}>
          <ChevronLeftIcon className="size-4" />
        </Button>
        <div className={cn('text-sm font-medium', classNames?.caption_label)}>{monthLabel}</div>
        <Button variant={buttonVariant} size="icon" onClick={() => changeMonth(1)}>
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className={cn('py-1', classNames?.weekday)}>
            {day}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const outside = day.getMonth() !== currentMonth.getMonth()
          if (outside && !showOutsideDays) {
            return <div key={day.toISOString()} className="size-9" />
          }

          const isSelected = !!selected && isSameDay(day, selected)

          return (
            <CalendarDayButton
              key={day.toISOString()}
              day={day}
              selected={isSelected}
              variant="ghost"
              size="icon"
              className={cn(
                'size-9 text-sm',
                outside ? 'text-muted-foreground/60' : '',
                isSelected ? 'bg-primary text-primary-foreground hover:bg-primary/90' : '',
              )}
              onClick={() => onSelect?.(day)}
            >
              {day.getDate()}
            </CalendarDayButton>
          )
        })}
      </div>
    </div>
  )
}

function CalendarDayButton({ className, day, selected, ...props }: CalendarDayButtonProps) {
  return (
    <Button
      data-slot="calendar-day-button"
      data-day={day.toISOString().slice(0, 10)}
      data-selected={selected}
      className={cn(className)}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
