import { FlightProvider } from "@/context/flight-context"
import { FlightsPageContent } from "@/components/flights/flights-page-content"

export default function FlightsPage() {
  return (
    <FlightProvider>
      <FlightsPageContent />
    </FlightProvider>
  )
}
