"use client"

import { useFlights } from "@/context/flight-context"
import { formatPrice } from "@/lib/flight-utils"
import Slider from "@mui/material/Slider"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import {
  SlidersHorizontal,
  RotateCcw,
  Clock,
  CircleDot,
  IndianRupee,
} from "lucide-react"
import type { StopsFilter, DepartureTimeRange } from "@/types/flight"

const STOPS_OPTIONS: { value: StopsFilter; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "non-stop", label: "Non-stop" },
  { value: "1-stop", label: "1 Stop" },
  { value: "2+-stops", label: "2+ Stops" },
]

const TIME_OPTIONS: { value: DepartureTimeRange; label: string; sub: string }[] = [
  { value: "any", label: "Any Time", sub: "" },
  { value: "morning", label: "Morning", sub: "5AM - 12PM" },
  { value: "afternoon", label: "Afternoon", sub: "12PM - 5PM" },
  { value: "evening", label: "Evening", sub: "5PM - 9PM" },
  { value: "night", label: "Night", sub: "9PM - 5AM" },
]

export function FilterSidebar() {
  const {
    state,
    priceRange,
    filteredFlights,
    setStops,
    setPriceRange,
    setDepartureTime,
    resetFilters,
  } = useFlights()

  const { filters } = state
  const [globalMin, globalMax] = priceRange

  const hasActiveFilters =
    filters.stops !== "any" ||
    filters.departureTimeRange !== "any" ||
    filters.priceRange[0] !== globalMin ||
    filters.priceRange[1] !== globalMax

  return (
    <aside className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        </div>
        {hasActiveFilters && (
          <Button
            variant="text"
            size="small"
            onClick={resetFilters}
            startIcon={<RotateCcw className="size-3.5" />}
            sx={{
              color: "var(--muted-foreground)",
              textTransform: "none",
              fontSize: "0.875rem",
              "&:hover": { color: "var(--foreground)" },
            }}
          >
            Reset
          </Button>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        {filteredFlights.length} flight{filteredFlights.length !== 1 ? "s" : ""}{" "}
        found
      </div>

      {/* Price Range */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <IndianRupee className="size-4 text-primary" />
          <h3 className="font-medium text-card-foreground">Price Range</h3>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <span>{formatPrice(filters.priceRange[0])}</span>
          <span>{formatPrice(filters.priceRange[1])}</span>
        </div>
        <Slider
          min={globalMin}
          max={globalMax}
          step={500}
          value={filters.priceRange}
          onChange={(_e, newValue) => setPriceRange(newValue as [number, number])}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => formatPrice(v)}
          sx={{
            color: "var(--primary)",
            "& .MuiSlider-thumb": { width: 16, height: 16 },
            "& .MuiSlider-rail": { opacity: 0.3 },
          }}
        />
        <p className="text-xs text-muted-foreground mt-2">Per adult</p>
      </div>

      {/* Stops */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <CircleDot className="size-4 text-primary" />
          <h3 className="font-medium text-card-foreground">Stops</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {STOPS_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              label={opt.label}
              onClick={() => setStops(opt.value)}
              variant={filters.stops === opt.value ? "filled" : "outlined"}
              sx={{
                cursor: "pointer",
                ...(filters.stops === opt.value
                  ? { backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }
                  : {
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                      "&:hover": { backgroundColor: "var(--secondary)" },
                    }),
              }}
            />
          ))}
        </div>
      </div>

      {/* Departure Time */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="size-4 text-primary" />
          <h3 className="font-medium text-card-foreground">Departure Time</h3>
        </div>
        <div className="flex flex-col gap-2">
          {TIME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDepartureTime(opt.value)}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                filters.departureTimeRange === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <span className="font-medium">{opt.label}</span>
              {opt.sub && (
                <span
                  className={
                    filters.departureTimeRange === opt.value
                      ? "text-primary-foreground/70 text-xs"
                      : "text-muted-foreground text-xs"
                  }
                >
                  {opt.sub}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
