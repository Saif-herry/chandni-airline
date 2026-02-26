// ===== Airport & Terminal =====
export interface Terminal {
  name: string
  gate: string
}

export interface Airport {
  code: string
  terminal: Terminal
  zoneId: string
  time: string
}

// ===== Stop Info =====
export interface StopInfo {
  code: string
  terminal: Terminal
  zoneId: string
  time: string
  layOverTimeInMins: number
}

// ===== Layover =====
export interface LayoverInformation {
  stopSequenceId: number
  transitVisaRequired: boolean
  transitVisaMessage: string
  baggageReCheckInRequired: boolean
}

// ===== Flight Segment =====
export interface FlightSegment {
  sequence: number
  flightId: string
  fltNo: string
  aircraftType: string
  airlineCode: string
  departureAirport: Airport
  arrivalAirport: Airport
  stops: StopInfo | false
  durationInMin: number
  layoverInformation: LayoverInformation[]
}

// ===== Baggage =====
export interface BaggageAllowance {
  piece: number
  quantity: number
  text: string
  unit: string
}

export interface BaggageInfo {
  type: string
  allowedBaggages: BaggageAllowance[]
}

// ===== Fare Pricing =====
export interface PriceComponent {
  category: string
  code: string
  amount: number
  currency: string
}

export interface PaxFare {
  paxType: "ADT" | "CHD" | "INF"
  paxCount: number
  priceComponents: PriceComponent[]
}

export interface Benefit {
  benefitType: string
  value: string
  description: string
  shortDescription: string
  amount: number
  currency: string
}

export interface FareIdentifiers {
  cabinType: string
  fareClass: string
  fareBasisCode: string
  rbd: string
  availableSeatCount: number
  brandName: string
  brand: string
}

export interface FarePrice {
  CTC: string
  SUPPLIER: string
  pricePerAdult: string
}

export interface Fare {
  fareId: string
  fareGroup: string
  baggages: Record<string, BaggageInfo[]>
  paxFare: PaxFare[]
  benefits: Benefit[]
  price: FarePrice
  transitVisaRequired: boolean
  refundable: boolean
  checkInBaggageAllowed: boolean
  fareIdentifiers: FareIdentifiers
}

// ===== Other Details =====
export interface OtherDetails {
  stops: StopInfo[]
  lowestPrice: string
  departureTime: string
  airline: string[]
  aircraftType: string[]
  airportCode: string
  totalStops: number
}

// ===== Flight Option (one card in UI) =====
export interface FlightOption {
  flUnqiueId: string
  flights: FlightSegment[]
  otherDetails: OtherDetails
  fares: Fare[]
}

// ===== Sector =====
export type Sector = Record<string, FlightOption>

// ===== Journey =====
export interface Journey {
  sector: string
}

// ===== Search Query =====
export interface SearchQuery {
  type: string
  className: string
  ADT: string
  CHD: string
  INF: string
  noOfSegments: string
  origin: string
  originCountry: string
  destination: string
  destinationCountry: string
  departureDate: string
  returnDate: string
}

// ===== Metadata =====
export interface AirportDetail {
  code: string
  name: string
  city: string
  country: string
  countryCode: string
}

export interface AirlineDetail {
  code: string
  name: string
}

export interface MetaData {
  airportDetail: Record<string, AirportDetail>
  airlineDetail: Record<string, AirlineDetail>
}

// ===== Top-Level Result =====
export interface FlightResult {
  journeys: Record<string, Journey>
  sectors: Record<string, Sector>
  searchQuery: SearchQuery
  metaData: MetaData
  provider: string
}

export interface FlightSearchResponse {
  data: {
    searchId: string
    provider: string
    success: boolean
    result: FlightResult
  }
}

// ===== Flattened / Normalized for UI =====
export interface NormalizedFlight {
  id: string
  journeyKey: string
  sectorKey: string
  airlineCodes: string[]
  airlineNames: string[]
  flightNumbers: string[]
  departureCode: string
  departureTime: string
  departureTerminal: string
  arrivalCode: string
  arrivalTime: string
  arrivalTerminal: string
  totalDurationMin: number
  totalStops: number
  stopCodes: string[]
  layoverMins: number[]
  lowestPrice: number
  pricePerAdult: number
  totalPrice: number
  fares: Fare[]
  segments: FlightSegment[]
  refundable: boolean
  cabinType: string
  brandName: string
  benefits: Benefit[]
  availableSeats: number
}

// ===== Filter State =====
export type TripType = "one-way" | "round-trip"
export type SortBy = "price" | "duration" | "departure"
export type StopsFilter = "any" | "non-stop" | "1-stop" | "2+-stops"
export type DepartureTimeRange = "any" | "morning" | "afternoon" | "evening" | "night"

export interface FilterState {
  tripType: TripType
  origin: string
  destination: string
  departureDate: string
  returnDate: string
  passengers: { ADT: number; CHD: number; INF: number }
  priceRange: [number, number]
  stops: StopsFilter
  departureTimeRange: DepartureTimeRange
  sortBy: SortBy
  activeJourney: "J1" | "J2"
}
