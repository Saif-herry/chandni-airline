"use client"

import { useFlights } from "@/context/flight-context"
import { ArrowUpDown } from "lucide-react"
import type { SortBy } from "@/types/flight"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "price", label: "Price: Low to High" },
  { value: "duration", label: "Duration: Shortest" },
  { value: "departure", label: "Departure: Earliest" },
]

export function SortBar() {
  const { state, setSort, filteredFlights } = useFlights()

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">
          {filteredFlights.length}
        </span>{" "}
        flight{filteredFlights.length !== 1 ? "s" : ""} available
      </p>
      <div className="flex items-center gap-2">
        <ArrowUpDown className="size-4 text-muted-foreground" />
        <Select value={state.filters.sortBy} onValueChange={(value) => setSort(value as SortBy)}>
          <SelectTrigger className="min-w-[220px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
