export function FlightCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-3 md:w-44">
          <div className="size-10 rounded-lg bg-muted" />
          <div className="flex flex-col gap-2">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-3 w-16 rounded bg-muted" />
          </div>
        </div>
        <div className="flex flex-1 items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <div className="h-6 w-12 rounded bg-muted" />
            <div className="h-3 w-8 rounded bg-muted" />
          </div>
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="h-3 w-16 rounded bg-muted" />
            <div className="h-px w-full bg-muted" />
            <div className="h-3 w-12 rounded bg-muted" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="h-6 w-12 rounded bg-muted" />
            <div className="h-3 w-8 rounded bg-muted" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 md:w-40">
          <div className="h-7 w-24 rounded bg-muted" />
          <div className="h-3 w-14 rounded bg-muted" />
          <div className="h-8 w-full rounded bg-muted mt-2" />
        </div>
      </div>
    </div>
  )
}

export function LoadingState() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <FlightCardSkeleton key={i} />
      ))}
    </div>
  )
}
