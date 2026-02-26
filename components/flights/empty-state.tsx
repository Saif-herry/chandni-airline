"use client"

import { useFlights } from "@/context/flight-context"
import Button from "@mui/material/Button"
import { SearchX, RotateCcw } from "lucide-react"

export function EmptyState() {
  const { resetFilters } = useFlights()

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex items-center justify-center rounded-full bg-muted p-4 mb-4">
        <SearchX className="size-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No flights found
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        No flights match your current filters. Try adjusting your search
        criteria or reset all filters to see available flights.
      </p>
      <Button
        onClick={resetFilters}
        variant="outlined"
        startIcon={<RotateCcw className="size-4" />}
        sx={{
          textTransform: "none",
          borderColor: "var(--border)",
          color: "var(--foreground)",
          borderRadius: "0.5rem",
          "&:hover": { backgroundColor: "var(--secondary)", borderColor: "var(--border)" },
        }}
      >
        Reset Filters
      </Button>
    </div>
  )
}
