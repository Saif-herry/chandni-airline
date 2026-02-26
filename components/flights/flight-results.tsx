"use client";

import { useFlights } from "@/context/flight-context";
import { FlightCard } from "./flight-card";
import { SortBar } from "./sort-bar";
import { FlightPagination } from "./pagination";
import { LoadingState } from "./loading-skeleton";
import { EmptyState } from "./empty-state";
import { JourneyTabs } from "./journey-tabs";

export function FlightResults() {
  const { state, paginatedFlights, filteredFlights } = useFlights();

  return (
    <div className="flex flex-col gap-5">
      {/* Journey Tabs */}
      <JourneyTabs />

      {/* Sort Bar */}
      <SortBar />

      {/* Loading State  */}
      {state.isLoading && <LoadingState />}

      {/* Error State */}
      {state.error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive font-medium">{state.error}</p>
        </div>
      )}

      {/* Empty State */}
      {!state.isLoading && !state.error && filteredFlights.length === 0 && (
        <EmptyState />
      )}

      {/* Flight Cards */}
      {!state.isLoading && !state.error && paginatedFlights.length > 0 && (
        <div className="flex flex-col gap-4">
          {paginatedFlights.map((flight) => (
            <FlightCard key={flight.id} flight={flight} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!state.isLoading && filteredFlights.length > 0 && <FlightPagination />}
    </div>
  );
}
