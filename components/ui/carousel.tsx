'use client'

import * as React from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type CarouselApi = {
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: () => boolean
  canScrollNext: () => boolean
  scrollTo: (index: number) => void
  selectedScrollSnap: () => number
}

type CarouselOptions = {
  axis?: 'x' | 'y'
  loop?: boolean
}

type CarouselPlugin = unknown[]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: React.RefObject<HTMLDivElement | null>
  api: CarouselApi
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  currentIndex: number
  setSlidesCount: (count: number) => void
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />')
  }

  return context
}

function Carousel({
  orientation = 'horizontal',
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & CarouselProps) {
  const carouselRef = React.useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [slidesCount, setSlidesCount] = React.useState(0)

  const loop = !!opts?.loop

  const canScrollPrev = loop || currentIndex > 0
  const canScrollNext = loop || currentIndex < Math.max(slidesCount - 1, 0)

  const scrollPrev = React.useCallback(() => {
    setCurrentIndex((prev) => {
      if (loop) return prev <= 0 ? Math.max(slidesCount - 1, 0) : prev - 1
      return Math.max(prev - 1, 0)
    })
  }, [loop, slidesCount])

  const scrollNext = React.useCallback(() => {
    setCurrentIndex((prev) => {
      if (loop) return prev >= slidesCount - 1 ? 0 : prev + 1
      return Math.min(prev + 1, Math.max(slidesCount - 1, 0))
    })
  }, [loop, slidesCount])

  const api = React.useMemo<CarouselApi>(
    () => ({
      scrollPrev,
      scrollNext,
      canScrollPrev: () => canScrollPrev,
      canScrollNext: () => canScrollNext,
      scrollTo: (index: number) => {
        const clamped = Math.max(0, Math.min(index, Math.max(slidesCount - 1, 0)))
        setCurrentIndex(clamped)
      },
      selectedScrollSnap: () => currentIndex,
    }),
    [canScrollNext, canScrollPrev, currentIndex, scrollNext, scrollPrev, slidesCount],
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (orientation === 'horizontal') {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          scrollNext()
        }
      }

      if (orientation === 'vertical') {
        if (event.key === 'ArrowUp') {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === 'ArrowDown') {
          event.preventDefault()
          scrollNext()
        }
      }
    },
    [orientation, scrollNext, scrollPrev],
  )

  React.useEffect(() => {
    if (!setApi) return
    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, Math.max(slidesCount - 1, 0)))
  }, [slidesCount])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        plugins,
        orientation: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        currentIndex,
        setSlidesCount,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn('relative', className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, children, ...props }: React.ComponentProps<'div'>) {
  const { carouselRef, orientation, currentIndex, setSlidesCount } = useCarousel()

  const slides = React.Children.toArray(children)

  React.useEffect(() => {
    setSlidesCount(slides.length)
  }, [setSlidesCount, slides.length])

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          'flex transition-transform duration-300 ease-out',
          orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
          className,
        )}
        style={{
          transform:
            orientation === 'horizontal'
              ? `translateX(calc(-${currentIndex * 100}%))`
              : `translateY(calc(-${currentIndex * 100}%))`,
        }}
        {...props}
      >
        {slides}
      </div>
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<'div'>) {
  const { orientation } = useCarousel()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal' ? 'pl-4' : 'pt-4',
        className,
      )}
      {...props}
    />
  )
}

function CarouselPrevious({
  className,
  variant = 'outline',
  size = 'icon',
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        'absolute size-8 rounded-full',
        orientation === 'horizontal'
          ? 'top-1/2 -left-12 -translate-y-1/2'
          : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

function CarouselNext({
  className,
  variant = 'outline',
  size = 'icon',
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        'absolute size-8 rounded-full',
        orientation === 'horizontal'
          ? 'top-1/2 -right-12 -translate-y-1/2'
          : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
