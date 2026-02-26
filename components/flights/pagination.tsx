"use client"

import { useFlights } from "@/context/flight-context"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function FlightPagination() {
  const { state, totalPages, setPage } = useFlights()
  const { currentPage } = state

  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <IconButton
        size="small"
        disabled={currentPage <= 1}
        onClick={() => setPage(currentPage - 1)}
        sx={{
          border: "1px solid var(--border)",
          borderRadius: "0.5rem",
          width: 36,
          height: 36,
        }}
      >
        <ChevronLeft className="size-4" />
        <span className="sr-only">Previous page</span>
      </IconButton>

      {pages.map((p) => (
        <Button
          key={p}
          variant={p === currentPage ? "contained" : "outlined"}
          size="small"
          onClick={() => setPage(p)}
          sx={{
            minWidth: 36,
            height: 36,
            borderRadius: "0.5rem",
            textTransform: "none",
            ...(p === currentPage
              ? {
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                  "&:hover": { backgroundColor: "var(--primary)", opacity: 0.9 },
                }
              : {
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                  "&:hover": { backgroundColor: "var(--secondary)" },
                }),
          }}
        >
          {p}
        </Button>
      ))}

      <IconButton
        size="small"
        disabled={currentPage >= totalPages}
        onClick={() => setPage(currentPage + 1)}
        sx={{
          border: "1px solid var(--border)",
          borderRadius: "0.5rem",
          width: 36,
          height: 36,
        }}
      >
        <ChevronRight className="size-4" />
        <span className="sr-only">Next page</span>
      </IconButton>
    </div>
  )
}
