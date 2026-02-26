import type {
  FlightSearchResponse,
  NormalizedFlight,
  FlightOption,
  Sector,
  MetaData,
} from "@/types/flight";

/**
 * Format duration from minutes to "Xh Ym" string
 */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/**
 * Format time from ISO string to HH:MM
 */
export function formatTime(isoString: string): string {
  // e.g. "2025-06-20T15:45:00" -> extract "15:45"
  const match = isoString.match(/T(\d{2}):(\d{2})/);
  if (match) return `${match[1]}:${match[2]}`;
  // fallback
  const date = new Date(isoString);
  const h = date.getUTCHours().toString().padStart(2, "0");
  const m = date.getUTCMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Format date from ISO string to readable date
 */
export function formatDate(isoString: string): string {
  // Parse date parts directly from the string to avoid timezone issues
  const match = isoString.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    // Create date at noon UTC to avoid day-boundary shifts
    const date = new Date(Date.UTC(year, month, day, 12, 0, 0));
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${days[date.getUTCDay()]}, ${date.getUTCDate()} ${months[date.getUTCMonth()]}`;
  }
  const date = new Date(isoString);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${days[date.getUTCDay()]}, ${date.getUTCDate()} ${months[date.getUTCMonth()]}`;
}

/**
 * Format price in INR
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get the airline name from metadata
 */
export function getAirlineName(code: string, metaData: MetaData): string {
  return metaData.airlineDetail[code]?.name ?? code;
}

/**
 * Get the airport city name from metadata
 */
export function getAirportCity(code: string, metaData: MetaData): string {
  return metaData.airportDetail[code]?.city ?? code;
}

/**
 * Get hour from ISO time for filtering
 * Parses directly from string to avoid timezone issues.
 */
export function getHourFromISO(isoString: string): number {
  const match = isoString.match(/T(\d{2})/);
  if (match) return parseInt(match[1], 10);
  return new Date(isoString).getUTCHours();
}

/**
 * Get departure time range label
 */
export function getDepartureTimeLabel(hour: number): string {
  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Afternoon";
  if (hour >= 17 && hour < 21) return "Evening";
  return "Night";
}

/**
 * Normalize a single flight option into a flat UI-friendly structure
 */
function normalizeFlightOption(
  option: FlightOption,
  journeyKey: string,
  sectorKey: string,
  metaData: MetaData,
): NormalizedFlight {
  const segments = option.flights;
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];
  const lowestFare = option.fares.reduce((min, fare) => {
    const price = parseFloat(fare.price.pricePerAdult);
    return price < min ? price : min;
  }, Infinity);
  const cheapestFare = option.fares.reduce((best, fare) => {
    return parseFloat(fare.price.pricePerAdult) <
      parseFloat(best.price.pricePerAdult)
      ? fare
      : best;
  }, option.fares[0]);

  const totalDuration = segments.reduce((sum, s) => sum + s.durationInMin, 0);
  const layoverMins = option.otherDetails.stops.map((s) => s.layOverTimeInMins);
  const totalWithLayover =
    totalDuration + layoverMins.reduce((s, m) => s + m, 0);

  const uniqueAirlines = [...new Set(segments.map((s) => s.airlineCode))];

  return {
    id: option.flUnqiueId,
    journeyKey,
    sectorKey,
    airlineCodes: uniqueAirlines,
    airlineNames: uniqueAirlines.map((c) => getAirlineName(c, metaData)),
    flightNumbers: segments.map((s) => `${s.airlineCode}-${s.fltNo}`),
    departureCode: firstSegment.departureAirport.code,
    departureTime: firstSegment.departureAirport.time,
    departureTerminal: firstSegment.departureAirport.terminal.name,
    arrivalCode: lastSegment.arrivalAirport.code,
    arrivalTime: lastSegment.arrivalAirport.time,
    arrivalTerminal: lastSegment.arrivalAirport.terminal.name,
    totalDurationMin: totalWithLayover,
    totalStops: option.otherDetails.totalStops,
    stopCodes: option.otherDetails.stops.map((s) => s.code),
    layoverMins,
    lowestPrice: parseFloat(option.otherDetails.lowestPrice),
    pricePerAdult: lowestFare,
    totalPrice: parseFloat(cheapestFare.price.CTC),
    fares: option.fares,
    segments,
    refundable: cheapestFare.refundable,
    cabinType: cheapestFare.fareIdentifiers.cabinType,
    brandName: cheapestFare.fareIdentifiers.brandName,
    benefits: cheapestFare.benefits,
    availableSeats: cheapestFare.fareIdentifiers.availableSeatCount,
  };
}

/**
 * Normalize all flight data from the API response
 */
export function normalizeFlights(
  response: FlightSearchResponse,
): Record<string, NormalizedFlight[]> {
  const result = response.data.result;
  const { journeys, sectors, metaData } = result;
  const normalized: Record<string, NormalizedFlight[]> = {};

  for (const [journeyKey, journey] of Object.entries(journeys)) {
    const sectorKey = journey.sector;
    const sector: Sector | undefined = sectors[sectorKey];
    if (!sector) continue;

    const flights: NormalizedFlight[] = [];
    for (const option of Object.values(sector)) {
      flights.push(
        normalizeFlightOption(option, journeyKey, sectorKey, metaData),
      );
    }
    normalized[journeyKey] = flights;
  }

  return normalized;
}

/**
 * Get the min and max prices from normalized flights
 */
export function getPriceRange(flights: NormalizedFlight[]): [number, number] {
  if (flights.length === 0) return [0, 500000];
  const prices = flights.map((f) => f.pricePerAdult);
  return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
}
