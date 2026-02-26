"use client";

import { useState } from "react";
import type { NormalizedFlight, Fare } from "@/types/flight";
import { useFlights } from "@/context/flight-context";
import {
  formatDuration,
  formatTime,
  formatDate,
  formatPrice,
  getAirportCity,
} from "@/lib/flight-utils";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import {
  Plane,
  Clock,
  ChevronDown,
  ChevronUp,
  Luggage,
  Utensils,
  Armchair,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

interface FlightCardProps {
  flight: NormalizedFlight;
}

function FareOption({
  fare,
  isSelected,
  onSelect,
}: {
  fare: Fare;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const seatBenefit = fare.benefits.find((b) => b.benefitType === "SEAT");
  const mealBenefit = fare.benefits.find((b) => b.benefitType === "MEAL");

  return (
    <button
      onClick={onSelect}
      className={`flex flex-col rounded-lg border p-3 text-left transition-all ${
        isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
          {fare.fareIdentifiers.brandName}
        </span>
        <span className="text-sm font-bold text-foreground">
          {formatPrice(parseFloat(fare.price.pricePerAdult))}
        </span>
      </div>
      <p className="text-[10px] text-muted-foreground mb-2">per adult</p>
      <div className="flex flex-wrap gap-1.5">
        {fare.refundable && (
          <Chip
            icon={<RefreshCw className="size-2.5" />}
            label="Refundable"
            size="small"
            sx={{
              fontSize: "0.625rem",
              height: 20,
              "& .MuiChip-icon": { fontSize: 10 },
              backgroundColor: "var(--secondary)",
              color: "var(--secondary-foreground)",
            }}
          />
        )}
        {seatBenefit && (
          <Chip
            icon={<Armchair className="size-2.5" />}
            label={seatBenefit.shortDescription}
            size="small"
            sx={{
              fontSize: "0.625rem",
              height: 20,
              "& .MuiChip-icon": { fontSize: 10 },
              backgroundColor: "var(--secondary)",
              color: "var(--secondary-foreground)",
            }}
          />
        )}
        {mealBenefit && (
          <Chip
            icon={<Utensils className="size-2.5" />}
            label={mealBenefit.shortDescription}
            size="small"
            sx={{
              fontSize: "0.625rem",
              height: 20,
              "& .MuiChip-icon": { fontSize: 10 },
              backgroundColor: "var(--secondary)",
              color: "var(--secondary-foreground)",
            }}
          />
        )}
      </div>
      <p className="text-[10px] text-muted-foreground mt-2">
        {fare.fareIdentifiers.availableSeatCount} seats left
      </p>
    </button>
  );
}

export function FlightCard({ flight }: FlightCardProps) {
  const { state } = useFlights();
  const { metaData } = state;
  const [expanded, setExpanded] = useState(false);
  const [selectedFareIdx, setSelectedFareIdx] = useState(0);

  const departCity = getAirportCity(flight.departureCode, metaData);
  const arrivalCity = getAirportCity(flight.arrivalCode, metaData);

  const selectedFare = flight.fares[selectedFareIdx];

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      {/* Main Row */}
      <div className="p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Airline Info */}
          <div className="flex items-center gap-3 md:w-44 shrink-0">
            <div className="flex items-center justify-center rounded-lg bg-primary/10 p-2.5">
              <Plane className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm text-card-foreground">
                {flight.airlineNames.join(", ")}
              </p>
              <p className="text-xs text-muted-foreground">
                {flight.flightNumbers.join(" / ")}
              </p>
            </div>
          </div>

          {/* Route Timeline */}
          <div className="flex flex-1 items-center gap-3">
            {/* Departure */}
            <div className="text-center min-w-[70px]">
              <p className="text-xl font-bold text-card-foreground">
                {formatTime(flight.departureTime)}
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                {flight.departureCode}
              </p>
              <p className="text-[10px] text-muted-foreground">{departCity}</p>
              {flight.departureTerminal && (
                <p className="text-[10px] text-muted-foreground">
                  T{flight.departureTerminal}
                </p>
              )}
            </div>

            {/* Duration Line */}
            <div className="flex flex-1 flex-col items-center gap-1 px-2">
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Clock className="size-3" />
                {formatDuration(flight.totalDurationMin)}
              </p>
              <div className="relative w-full flex items-center">
                <div className="flex-1 h-px bg-border" />
                {flight.totalStops > 0 &&
                  flight.stopCodes.map((code, i) => (
                    <div
                      key={i}
                      className="relative flex flex-col items-center mx-1"
                    >
                      <div className="size-2.5 rounded-full bg-accent border-2 border-card" />
                    </div>
                  ))}
                <div className="flex-1 h-px bg-border" />
                <Plane className="size-3 text-primary -rotate-0 ml-0.5" />
              </div>
              <p className="text-[10px] text-muted-foreground">
                {flight.totalStops === 0
                  ? "Non-stop"
                  : `${flight.totalStops} stop${flight.totalStops > 1 ? "s" : ""}`}
                {flight.stopCodes.length > 0 &&
                  ` via ${flight.stopCodes.join(", ")}`}
              </p>
            </div>

            {/* Arrival */}
            <div className="text-center min-w-[70px]">
              <p className="text-xl font-bold text-card-foreground">
                {formatTime(flight.arrivalTime)}
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                {flight.arrivalCode}
              </p>
              <p className="text-[10px] text-muted-foreground">{arrivalCity}</p>
              {flight.arrivalTerminal && (
                <p className="text-[10px] text-muted-foreground">
                  T{flight.arrivalTerminal}
                </p>
              )}
            </div>
          </div>

          {/* Price & Select */}
          <div className="flex flex-col items-end gap-1 md:w-40 shrink-0">
            <p className="text-2xl font-bold text-foreground">
              {formatPrice(flight.pricePerAdult)}
            </p>
            <p className="text-xs text-muted-foreground">per adult</p>
            <div className="flex items-center gap-1.5 mt-1">
              {flight.refundable && (
                <Chip
                  label="Refundable"
                  size="small"
                  sx={{
                    fontSize: "0.625rem",
                    height: 20,
                    backgroundColor: "var(--secondary)",
                    color: "var(--secondary-foreground)",
                  }}
                />
              )}
              <Chip
                label={flight.cabinType}
                size="small"
                sx={{
                  fontSize: "0.625rem",
                  height: 20,
                  backgroundColor: "var(--secondary)",
                  color: "var(--secondary-foreground)",
                }}
              />
            </div>
            <Button
              size="small"
              variant="contained"
              onClick={() => setExpanded(!expanded)}
              endIcon={
                expanded ? (
                  <ChevronUp className="size-3.5" />
                ) : (
                  <ChevronDown className="size-3.5" />
                )
              }
              sx={{
                mt: 1,
                width: "100%",
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                textTransform: "none",
                borderRadius: "0.5rem",
                fontSize: "0.8125rem",
                "&:hover": { backgroundColor: "var(--primary)", opacity: 0.9 },
              }}
            >
              {expanded ? "Hide Fares" : "View Fares"}
            </Button>
          </div>
        </div>

        {/* Date info */}
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span>Departs: {formatDate(flight.departureTime)}</span>
          <span>Arrives: {formatDate(flight.arrivalTime)}</span>
          {flight.availableSeats <= 5 && (
            <span className="flex items-center gap-1 text-destructive font-medium">
              <AlertTriangle className="size-3" />
              Only {flight.availableSeats} seats left
            </span>
          )}
        </div>
      </div>

      {/* Expanded Fare Options */}
      {expanded && (
        <div className="border-t border-border bg-muted/30 p-4 md:p-5">
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Choose your fare
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {flight.fares.map((fare, i) => (
              <FareOption
                key={`${fare.fareId}-${i}`}
                fare={fare}
                isSelected={selectedFareIdx === i}
                onSelect={() => setSelectedFareIdx(i)}
              />
            ))}
          </div>

          {/* Selected fare total */}
          {selectedFare && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total for all travellers
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedFare.fareIdentifiers.brandName} fare
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-foreground">
                  {formatPrice(parseFloat(selectedFare.price.CTC))}
                </p>
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    mt: 1,
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                    textTransform: "none",
                    borderRadius: "0.5rem",
                    "&:hover": {
                      backgroundColor: "var(--primary)",
                      opacity: 0.9,
                    },
                  }}
                >
                  Select Flight
                </Button>
              </div>
            </div>
          )}

          {/* Segment Details */}
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Flight Segments
            </h4>
            <div className="flex flex-col gap-3">
              {flight.segments.map((seg, i) => {
                const depCity = getAirportCity(
                  seg.departureAirport.code,
                  metaData,
                );
                const arrCity = getAirportCity(
                  seg.arrivalAirport.code,
                  metaData,
                );

                return (
                  <div
                    key={seg.flightId}
                    className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 rounded-lg bg-card border border-border p-3 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Plane className="size-4 text-primary" />
                      <span className="font-medium text-card-foreground">
                        {seg.airlineCode}-{seg.fltNo}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-medium text-card-foreground">
                        {formatTime(seg.departureAirport.time)}
                      </span>
                      <span>
                        {seg.departureAirport.code} ({depCity})
                      </span>
                    </div>
                    <Plane className="size-3 text-muted-foreground hidden md:block" />
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-medium text-card-foreground">
                        {formatTime(seg.arrivalAirport.time)}
                      </span>
                      <span>
                        {seg.arrivalAirport.code} ({arrCity})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="size-3" />
                      {formatDuration(seg.durationInMin)}
                    </div>
                    {i < flight.segments.length - 1 &&
                      flight.layoverMins[i] !== undefined && (
                        <Chip
                          icon={<Luggage className="size-2.5" />}
                          label={`Layover: ${formatDuration(flight.layoverMins[i])}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: "0.625rem",
                            height: 20,
                            "& .MuiChip-icon": { fontSize: 10 },
                            borderColor: "var(--border)",
                          }}
                        />
                      )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
