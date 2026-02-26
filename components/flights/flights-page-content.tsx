"use client";

import { SearchHeader } from "./search-header";
import { FilterSidebar } from "./filter-sidebar";
import { FlightResults } from "./flight-results";

export function FlightsPageContent() {
  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-6">
              <FilterSidebar />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <FlightResults />
          </div>
        </div>
      </main>
    </div>
  );
}
