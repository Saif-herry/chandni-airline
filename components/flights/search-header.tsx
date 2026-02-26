"use client"

import { useState, useRef, useEffect } from "react"
import { useFlights } from "@/context/flight-context"
import { getAirportCity, formatDate } from "@/lib/flight-utils"
import {
  Plane,
  ArrowLeftRight,
  Calendar,
  Users,
  Search,
  ChevronDown,
  Minus,
  Plus,
} from "lucide-react"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Chip from "@mui/material/Chip"
import Popover from "@mui/material/Popover"
import TextField from "@mui/material/TextField"
import type { MetaData, AirportDetail } from "@/types/flight"

function getAirportList(metaData: MetaData): AirportDetail[] {
  return Object.values(metaData.airportDetail)
}

interface AirportSelectorProps {
  label: string
  value: string
  metaData: MetaData
  onChange: (code: string) => void
}

function AirportSelector({ label, value, metaData, onChange }: AirportSelectorProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [query, setQuery] = useState("")
  const airports = getAirportList(metaData)
  const filtered = airports.filter(
    (a) =>
      a.city.toLowerCase().includes(query.toLowerCase()) ||
      a.code.toLowerCase().includes(query.toLowerCase()) ||
      a.name.toLowerCase().includes(query.toLowerCase())
  )
  const selectedAirport = metaData.airportDetail[value]
  const open = Boolean(anchorEl)

  return (
    <>
      <button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        className="flex flex-col items-start gap-0.5 rounded-lg bg-primary-foreground/10 px-3 py-2 text-left transition-colors hover:bg-primary-foreground/20 min-w-[140px]"
      >
        <span className="text-[10px] uppercase tracking-wider text-primary-foreground/60">
          {label}
        </span>
        <span className="text-sm font-semibold text-primary-foreground">
          {selectedAirport ? selectedAirport.city : value}
        </span>
        <span className="text-[10px] text-primary-foreground/50">
          {value} {selectedAirport ? `- ${selectedAirport.name}` : ""}
        </span>
      </button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => { setAnchorEl(null); setQuery("") }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { className: "rounded-xl mt-1 shadow-lg" } }}
      >
        <div className="w-72 p-2">
          <TextField
            placeholder="Search city or airport..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size="small"
            fullWidth
            autoFocus
            className="mb-2"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.5rem" } }}
          />
          <div className="max-h-48 overflow-y-auto flex flex-col gap-0.5">
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-3">No airports found</p>
            )}
            {filtered.map((airport) => (
              <button
                key={airport.code}
                onClick={() => {
                  onChange(airport.code)
                  setAnchorEl(null)
                  setQuery("")
                }}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-left transition-colors ${
                  airport.code === value
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
              >
                <Plane className="size-4 shrink-0" />
                <div>
                  <p className="text-sm font-medium">
                    {airport.city}{" "}
                    <span className={airport.code === value ? "text-primary-foreground/70" : "text-muted-foreground"}>
                      ({airport.code})
                    </span>
                  </p>
                  <p className={`text-xs ${airport.code === value ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {airport.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Popover>
    </>
  )
}

interface PassengerPickerProps {
  passengers: { ADT: number; CHD: number; INF: number }
  onChange: (passengers: { ADT: number; CHD: number; INF: number }) => void
}

function PassengerPicker({ passengers, onChange }: PassengerPickerProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const total = passengers.ADT + passengers.CHD + passengers.INF
  const open = Boolean(anchorEl)

  const update = (type: "ADT" | "CHD" | "INF", delta: number) => {
    const newVal = Math.max(type === "ADT" ? 1 : 0, passengers[type] + delta)
    onChange({ ...passengers, [type]: Math.min(newVal, 9) })
  }

  const rows: { key: "ADT" | "CHD" | "INF"; label: string; sub: string }[] = [
    { key: "ADT", label: "Adults", sub: "12+ years" },
    { key: "CHD", label: "Children", sub: "2-11 years" },
    { key: "INF", label: "Infants", sub: "Under 2 years" },
  ]

  return (
    <>
      <button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        className="flex items-center gap-2 rounded-lg bg-primary-foreground/10 px-3 py-2 transition-colors hover:bg-primary-foreground/20"
      >
        <Users className="size-4 text-primary-foreground/70" />
        <div className="flex flex-col items-start">
          <span className="text-[10px] uppercase tracking-wider text-primary-foreground/60">
            Travellers
          </span>
          <span className="text-sm font-semibold text-primary-foreground">
            {total} Traveller{total > 1 ? "s" : ""}
          </span>
        </div>
        <ChevronDown className="size-3.5 text-primary-foreground/50" />
      </button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { className: "rounded-xl mt-1 shadow-lg" } }}
      >
        <div className="w-64 p-3 flex flex-col gap-3">
          {rows.map((row) => (
            <div key={row.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{row.label}</p>
                <p className="text-xs text-muted-foreground">{row.sub}</p>
              </div>
              <div className="flex items-center gap-2">
                <IconButton
                  size="small"
                  onClick={() => update(row.key, -1)}
                  disabled={row.key === "ADT" ? passengers[row.key] <= 1 : passengers[row.key] <= 0}
                  className="border border-border"
                  sx={{ width: 28, height: 28 }}
                >
                  <Minus className="size-3" />
                </IconButton>
                <span className="w-6 text-center text-sm font-semibold text-foreground">
                  {passengers[row.key]}
                </span>
                <IconButton
                  size="small"
                  onClick={() => update(row.key, 1)}
                  disabled={passengers[row.key] >= 9}
                  className="border border-border"
                  sx={{ width: 28, height: 28 }}
                >
                  <Plus className="size-3" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </Popover>
    </>
  )
}

export function SearchHeader() {
  const { state, setSearchParams } = useFlights()
  const { searchQuery, metaData, filters } = state

  const [origin, setOrigin] = useState(searchQuery.origin)
  const [destination, setDestination] = useState(searchQuery.destination)
  const [departureDate, setDepartureDate] = useState(searchQuery.departureDate)
  const [returnDate, setReturnDate] = useState(searchQuery.returnDate)
  const [tripType, setTripType] = useState<"one-way" | "round-trip">(filters.tripType)
  const [passengers, setPassengers] = useState({
    ADT: filters.passengers.ADT,
    CHD: filters.passengers.CHD,
    INF: filters.passengers.INF,
  })

  const handleSearch = () => {
    if (!origin || !destination || !departureDate) return
    if (origin === destination) return
    setSearchParams({
      origin,
      destination,
      departureDate,
      returnDate: tripType === "round-trip" ? returnDate : "",
      tripType,
      passengers,
    })
  }

  const swapCities = () => {
    setOrigin(destination)
    setDestination(origin)
  }

  return (
    <header className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center rounded-lg bg-primary-foreground/10 p-2">
            <Plane className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight font-sans">
              FlightSearch
            </h1>
            <p className="text-sm text-primary-foreground/70">
              Find the best flights for your journey
            </p>
          </div>
        </div>

        {/* Search Form */}
        <div className="rounded-xl bg-primary-foreground/10 px-4 py-4">
          {/* Trip Type Toggle */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setTripType("round-trip")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                tripType === "round-trip"
                  ? "bg-primary-foreground text-primary"
                  : "bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
              }`}
            >
              Round Trip
            </button>
            <button
              onClick={() => setTripType("one-way")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                tripType === "one-way"
                  ? "bg-primary-foreground text-primary"
                  : "bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
              }`}
            >
              One Way
            </button>
          </div>

          {/* Main Search Fields */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-3">
            {/* Origin & Destination */}
            <div className="flex items-center gap-2 flex-1">
              <AirportSelector
                label="From"
                value={origin}
                metaData={metaData}
                onChange={setOrigin}
              />
              <button
                onClick={swapCities}
                className="flex items-center justify-center rounded-full bg-primary-foreground/20 p-2 transition-colors hover:bg-primary-foreground/30"
                aria-label="Swap cities"
              >
                <ArrowLeftRight className="size-4" />
              </button>
              <AirportSelector
                label="To"
                value={destination}
                metaData={metaData}
                onChange={setDestination}
              />
            </div>

            {/* Dates */}
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-0.5 rounded-lg bg-primary-foreground/10 px-3 py-2">
                <label htmlFor="departure-date" className="text-[10px] uppercase tracking-wider text-primary-foreground/60">
                  Departure
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-primary-foreground/70" />
                  <input
                    id="departure-date"
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="bg-transparent text-sm font-semibold text-primary-foreground border-none outline-none [color-scheme:dark]"
                  />
                </div>
              </div>

              {tripType === "round-trip" && (
                <div className="flex flex-col gap-0.5 rounded-lg bg-primary-foreground/10 px-3 py-2">
                  <label htmlFor="return-date" className="text-[10px] uppercase tracking-wider text-primary-foreground/60">
                    Return
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-primary-foreground/70" />
                    <input
                      id="return-date"
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      min={departureDate}
                      className="bg-transparent text-sm font-semibold text-primary-foreground border-none outline-none [color-scheme:dark]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Passengers */}
            <PassengerPicker passengers={passengers} onChange={setPassengers} />

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              variant="contained"
              disabled={!origin || !destination || !departureDate || origin === destination}
              startIcon={<Search className="size-4" />}
              sx={{
                backgroundColor: "var(--primary-foreground)",
                color: "var(--primary)",
                fontWeight: 600,
                px: 3,
                py: 1.5,
                borderRadius: "0.5rem",
                textTransform: "none",
                "&:hover": { backgroundColor: "var(--primary-foreground)", opacity: 0.9 },
                "&.Mui-disabled": { backgroundColor: "var(--primary-foreground)", opacity: 0.5 },
              }}
            >
              Search Flights
            </Button>
          </div>

          {/* Validation message */}
          {origin === destination && origin !== "" && (
            <p className="text-xs text-primary-foreground/70 mt-2">
              Origin and destination cannot be the same
            </p>
          )}
        </div>

        {/* Current Search Summary */}
        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-primary-foreground/60">
          <span>Current search:</span>
          <Chip
            label={`${getAirportCity(searchQuery.origin, metaData)} (${searchQuery.origin})`}
            size="small"
            sx={{ backgroundColor: "rgba(255,255,255,0.15)", color: "var(--primary-foreground)", fontSize: "0.75rem", height: 24 }}
          />
          <ArrowLeftRight className="size-3" />
          <Chip
            label={`${getAirportCity(searchQuery.destination, metaData)} (${searchQuery.destination})`}
            size="small"
            sx={{ backgroundColor: "rgba(255,255,255,0.15)", color: "var(--primary-foreground)", fontSize: "0.75rem", height: 24 }}
          />
          <Chip
            label={`${formatDate(searchQuery.departureDate + "T00:00:00")}${searchQuery.returnDate ? ` - ${formatDate(searchQuery.returnDate + "T00:00:00")}` : ""}`}
            size="small"
            sx={{ backgroundColor: "rgba(255,255,255,0.15)", color: "var(--primary-foreground)", fontSize: "0.75rem", height: 24 }}
          />
          <Chip
            label={filters.tripType === "round-trip" ? "Round Trip" : "One Way"}
            size="small"
            sx={{ backgroundColor: "rgba(255,255,255,0.15)", color: "var(--primary-foreground)", fontSize: "0.75rem", height: 24 }}
          />
          <Chip
            label={`${filters.passengers.ADT + filters.passengers.CHD + filters.passengers.INF} Traveller${(filters.passengers.ADT + filters.passengers.CHD + filters.passengers.INF) > 1 ? "s" : ""}`}
            size="small"
            sx={{ backgroundColor: "rgba(255,255,255,0.15)", color: "var(--primary-foreground)", fontSize: "0.75rem", height: 24 }}
          />
        </div>
      </div>
    </header>
  )
}
