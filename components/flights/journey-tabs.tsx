"use client";

import { useFlights } from "@/context/flight-context";
import { getAirportCity, formatDate } from "@/lib/flight-utils";
import { Plane, ArrowRight } from "lucide-react";

export function JourneyTabs() {
  const { state, setActiveJourney } = useFlights();
  const { metaData, filters, allFlights } = state;

  if (!state.hasSearched) return null;

  // Only show tabs if there are J2 flights (round trip).
  const hasJ2 = (allFlights["J2"] ?? []).length > 0;
  if (!hasJ2) return null;

  const tabs = [
    {
      key: "J1" as const,
      originCode: filters.origin,
      destCode: filters.destination,
      originCity: getAirportCity(filters.origin, metaData),
      destCity: getAirportCity(filters.destination, metaData),
      date: filters.departureDate
        ? formatDate(filters.departureDate + "T00:00:00")
        : "",
    },
    {
      key: "J2" as const,
      originCode: filters.destination,
      destCode: filters.origin,
      originCity: getAirportCity(filters.destination, metaData),
      destCity: getAirportCity(filters.origin, metaData),
      date: filters.returnDate
        ? formatDate(filters.returnDate + "T00:00:00")
        : "",
    },
  ];

  return (
    <div className="flex gap-3">
      {tabs.map((tab) => {
        const isActive = filters.activeJourney === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => setActiveJourney(tab.key)}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
              isActive
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-card hover:border-primary/30"
            }`}
          >
            <div
              className={`flex items-center justify-center rounded-lg p-2 ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Plane
                className={`size-4 ${tab.key === "J2" ? "rotate-180" : ""}`}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-sm font-semibold">
                <span className={isActive ? "text-primary" : "text-foreground"}>
                  {tab.originCity}
                </span>
                <ArrowRight className="size-3 text-muted-foreground" />
                <span className={isActive ? "text-primary" : "text-foreground"}>
                  {tab.destCity}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{tab.date}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
