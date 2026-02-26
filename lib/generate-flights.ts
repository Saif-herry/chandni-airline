import type { NormalizedFlight, Fare, FlightSegment, Benefit } from "@/types/flight"

// Airline pool for generating realistic data
const AIRLINES = [
  { code: "AI", name: "Air India" },
  { code: "6E", name: "IndiGo" },
  { code: "SG", name: "SpiceJet" },
  { code: "UK", name: "Vistara" },
  { code: "QP", name: "Akasa Air" },
  { code: "IX", name: "Air India Express" },
  { code: "QR", name: "Qatar Airways" },
  { code: "EK", name: "Emirates" },
  { code: "EY", name: "Etihad Airways" },
]

const STOP_AIRPORTS = ["BOM", "DEL", "HYD", "BLR", "MAA", "CCU", "DOH", "DXB", "AUH", "SIN"]

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return Math.abs(hash)
}

function padTwo(n: number): string {
  return n.toString().padStart(2, "0")
}

function addMinutes(isoDate: string, hourOffset: number, minOffset: number, addMins: number): string {
  const totalMinutes = hourOffset * 60 + minOffset + addMins
  const h = Math.floor(totalMinutes / 60) % 24
  const m = totalMinutes % 60
  // Might overflow to next day
  const datePart = isoDate.substring(0, 10)
  const dayOverflow = Math.floor((hourOffset * 60 + minOffset + addMins) / 1440)
  if (dayOverflow > 0) {
    const d = new Date(datePart + "T12:00:00Z")
    d.setUTCDate(d.getUTCDate() + dayOverflow)
    const newDate = `${d.getUTCFullYear()}-${padTwo(d.getUTCMonth() + 1)}-${padTwo(d.getUTCDate())}`
    return `${newDate}T${padTwo(h)}:${padTwo(m)}:00`
  }
  return `${datePart}T${padTwo(h)}:${padTwo(m)}:00`
}

function generateFares(
  rand: () => number,
  basePrice: number,
  origin: string,
  dest: string,
  flightUniqueId: string
): Fare[] {
  const classicPrice = basePrice
  const conveniencePrice = Math.round(basePrice * (1.15 + rand() * 0.1))
  const comfortPrice = Math.round(basePrice * (1.35 + rand() * 0.15))

  const makeFare = (
    brandName: string,
    fareGroup: string,
    pricePerAdult: number,
    seatFree: boolean,
    mealFree: boolean,
    refundable: boolean
  ): Fare => {
    const ctc = Math.round(pricePerAdult * (2.2 + rand() * 0.5))
    const rbd = brandName.charAt(0)
    return {
      fareId: `${fareGroup}-ECONOMY-${rbd}-${flightUniqueId}`,
      fareGroup,
      baggages: {},
      paxFare: [
        {
          paxType: "ADT",
          paxCount: 1,
          priceComponents: [
            { category: "BF", code: "", amount: Math.round(pricePerAdult * 0.7), currency: "INR" },
            { category: "TAX", code: "K3", amount: Math.round(pricePerAdult * 0.15), currency: "INR" },
            { category: "TAX", code: "YQ", amount: Math.round(pricePerAdult * 0.15), currency: "INR" },
          ],
        },
      ],
      benefits: [
        {
          benefitType: "SEAT",
          value: seatFree ? "FREE" : "PAID",
          description: seatFree ? "Free Seat" : "Paid Seat",
          shortDescription: seatFree ? "Free Seat" : "Paid Seat",
          amount: 0,
          currency: "",
        },
        {
          benefitType: "MEAL",
          value: mealFree ? "FREE" : "PAID",
          description: mealFree ? "Free Meal" : "Paid Meal",
          shortDescription: mealFree ? "Free Meal" : "Paid Meal",
          amount: 0,
          currency: "",
        },
      ] as Benefit[],
      price: {
        CTC: String(ctc),
        SUPPLIER: "GENERATED",
        pricePerAdult: String(pricePerAdult),
      },
      transitVisaRequired: false,
      refundable,
      checkInBaggageAllowed: true,
      fareIdentifiers: {
        cabinType: "ECONOMY",
        fareClass: rbd,
        fareBasisCode: `${rbd}GEN`,
        rbd,
        availableSeatCount: Math.floor(rand() * 15) + 1,
        brandName,
        brand: brandName,
      },
    }
  }

  return [
    makeFare("ECONOMY CLASSIC", "REGULAR_FARE", classicPrice, false, false, false),
    makeFare("ECONOMY CONVENIENCE", "FARE_FAMILY", conveniencePrice, true, true, true),
    makeFare("ECONOMY COMFORT", "FARE_FAMILY", comfortPrice, true, true, true),
  ]
}

export function generateFlightsForRoute(
  origin: string,
  destination: string,
  departureDate: string,
  metaData: { airportDetail: Record<string, { code: string; name: string; city: string; country: string; countryCode: string }> },
  airlineDetail: Record<string, { code: string; name: string }>
): NormalizedFlight[] {
  const seed = hashString(`${origin}-${destination}-${departureDate}`)
  const rand = seededRandom(seed)

  const flightCount = 3 + Math.floor(rand() * 4) // 3-6 flights
  const flights: NormalizedFlight[] = []

  // Filter out stop airports that are origin or destination
  const possibleStops = STOP_AIRPORTS.filter((a) => a !== origin && a !== destination)

  for (let i = 0; i < flightCount; i++) {
    const airline = AIRLINES[Math.floor(rand() * AIRLINES.length)]
    const hasStop = rand() > 0.4 // ~60% have 1 stop
    const depHour = 5 + Math.floor(rand() * 18) // 05:00 - 22:59
    const depMin = Math.floor(rand() * 4) * 15 // 0, 15, 30, 45
    const fltNo = String(1000 + Math.floor(rand() * 8999))
    const baseFlightDuration = 60 + Math.floor(rand() * 300) // 1h to 6h

    const depTime = `${departureDate}T${padTwo(depHour)}:${padTwo(depMin)}:00`

    if (hasStop) {
      const stopCode = possibleStops[Math.floor(rand() * possibleStops.length)]
      const airline2 = rand() > 0.5 ? airline : AIRLINES[Math.floor(rand() * AIRLINES.length)]
      const seg1Duration = Math.floor(baseFlightDuration * (0.4 + rand() * 0.2))
      const layover = 60 + Math.floor(rand() * 180)
      const seg2Duration = baseFlightDuration - seg1Duration

      const seg1ArrTime = addMinutes(departureDate, depHour, depMin, seg1Duration)
      const seg2DepHour = depHour + Math.floor((depMin + seg1Duration + layover) / 60)
      const seg2DepMin = (depMin + seg1Duration + layover) % 60
      const seg2DepTime = addMinutes(departureDate, depHour, depMin, seg1Duration + layover)
      const arrTime = addMinutes(departureDate, depHour, depMin, seg1Duration + layover + seg2Duration)

      const totalDuration = seg1Duration + layover + seg2Duration
      const fltNo2 = String(1000 + Math.floor(rand() * 8999))

      const uniqueId = `${origin}-${stopCode}-${airline.code}-${fltNo}_${stopCode}-${destination}-${airline2.code}-${fltNo2}`

      const segments: FlightSegment[] = [
        {
          sequence: 1,
          flightId: `${origin}-${stopCode}-${airline.code}-${fltNo}`,
          fltNo,
          aircraftType: "",
          airlineCode: airline.code,
          departureAirport: {
            code: origin,
            terminal: { name: "", gate: "" },
            zoneId: "",
            time: depTime,
          },
          arrivalAirport: {
            code: stopCode,
            terminal: { name: "", gate: "" },
            zoneId: "",
            time: seg1ArrTime,
          },
          stops: {
            code: stopCode,
            terminal: { name: "", gate: "" },
            zoneId: "",
            time: seg1ArrTime,
            layOverTimeInMins: layover,
          },
          durationInMin: seg1Duration,
          layoverInformation: [
            {
              stopSequenceId: 1,
              transitVisaRequired: false,
              transitVisaMessage: "Transit Visa not required",
              baggageReCheckInRequired: false,
            },
          ],
        },
        {
          sequence: 2,
          flightId: `${stopCode}-${destination}-${airline2.code}-${fltNo2}`,
          fltNo: fltNo2,
          aircraftType: "",
          airlineCode: airline2.code,
          departureAirport: {
            code: stopCode,
            terminal: { name: "", gate: "" },
            zoneId: "",
            time: seg2DepTime,
          },
          arrivalAirport: {
            code: destination,
            terminal: { name: "", gate: "" },
            zoneId: "",
            time: arrTime,
          },
          stops: false,
          durationInMin: seg2Duration,
          layoverInformation: [],
        },
      ]

      const basePrice = 3000 + Math.floor(rand() * 12000)
      const fares = generateFares(rand, basePrice, origin, destination, uniqueId)
      const lowestPrice = Math.min(...fares.map((f) => parseFloat(f.price.pricePerAdult)))
      const cheapestFare = fares.reduce((best, f) =>
        parseFloat(f.price.pricePerAdult) < parseFloat(best.price.pricePerAdult) ? f : best,
        fares[0]
      )

      const uniqueAirlines = [...new Set([airline.code, airline2.code])]

      flights.push({
        id: uniqueId,
        journeyKey: "J1",
        sectorKey: `${origin}${destination}${departureDate.replace(/-/g, "")}`,
        airlineCodes: uniqueAirlines,
        airlineNames: uniqueAirlines.map(
          (c) => airlineDetail[c]?.name || AIRLINES.find((a) => a.code === c)?.name || c
        ),
        flightNumbers: [`${airline.code}-${fltNo}`, `${airline2.code}-${fltNo2}`],
        departureCode: origin,
        departureTime: depTime,
        departureTerminal: "",
        arrivalCode: destination,
        arrivalTime: arrTime,
        arrivalTerminal: "",
        totalDurationMin: totalDuration,
        totalStops: 1,
        stopCodes: [stopCode],
        layoverMins: [layover],
        lowestPrice: lowestPrice,
        pricePerAdult: lowestPrice,
        totalPrice: parseFloat(cheapestFare.price.CTC),
        fares,
        segments,
        refundable: cheapestFare.refundable,
        cabinType: cheapestFare.fareIdentifiers.cabinType,
        brandName: cheapestFare.fareIdentifiers.brandName,
        benefits: cheapestFare.benefits,
        availableSeats: cheapestFare.fareIdentifiers.availableSeatCount,
      })
    } else {
      // Non-stop flight
      const arrTime = addMinutes(departureDate, depHour, depMin, baseFlightDuration)
      const uniqueId = `${origin}-${destination}-${airline.code}-${fltNo}`

      const segments: FlightSegment[] = [
        {
          sequence: 1,
          flightId: uniqueId,
          fltNo,
          aircraftType: "",
          airlineCode: airline.code,
          departureAirport: {
            code: origin,
            terminal: { name: "", gate: "" },
            zoneId: "",
            time: depTime,
          },
          arrivalAirport: {
            code: destination,
            terminal: { name: "", gate: "" },
            zoneId: "",
            time: arrTime,
          },
          stops: false,
          durationInMin: baseFlightDuration,
          layoverInformation: [],
        },
      ]

      const basePrice = 2500 + Math.floor(rand() * 10000)
      const fares = generateFares(rand, basePrice, origin, destination, uniqueId)
      const lowestPrice = Math.min(...fares.map((f) => parseFloat(f.price.pricePerAdult)))
      const cheapestFare = fares.reduce((best, f) =>
        parseFloat(f.price.pricePerAdult) < parseFloat(best.price.pricePerAdult) ? f : best,
        fares[0]
      )

      flights.push({
        id: uniqueId,
        journeyKey: "J1",
        sectorKey: `${origin}${destination}${departureDate.replace(/-/g, "")}`,
        airlineCodes: [airline.code],
        airlineNames: [airlineDetail[airline.code]?.name || airline.name],
        flightNumbers: [`${airline.code}-${fltNo}`],
        departureCode: origin,
        departureTime: depTime,
        departureTerminal: "",
        arrivalCode: destination,
        arrivalTime: arrTime,
        arrivalTerminal: "",
        totalDurationMin: baseFlightDuration,
        totalStops: 0,
        stopCodes: [],
        layoverMins: [],
        lowestPrice: lowestPrice,
        pricePerAdult: lowestPrice,
        totalPrice: parseFloat(cheapestFare.price.CTC),
        fares,
        segments,
        refundable: cheapestFare.refundable,
        cabinType: cheapestFare.fareIdentifiers.cabinType,
        brandName: cheapestFare.fareIdentifiers.brandName,
        benefits: cheapestFare.benefits,
        availableSeats: cheapestFare.fareIdentifiers.availableSeatCount,
      })
    }
  }

  // Sort by price
  flights.sort((a, b) => a.pricePerAdult - b.pricePerAdult)
  return flights
}
