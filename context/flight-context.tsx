"use client";

import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

import type {
  FilterState,
  NormalizedFlight,
  FlightSearchResponse,
  SortBy,
  StopsFilter,
  DepartureTimeRange,
  MetaData,
  SearchQuery,
} from "@/types/flight";

import {
  normalizeFlights,
  getPriceRange,
  getHourFromISO,
} from "@/lib/flight-utils";

import { generateFlightsForRoute } from "@/lib/generate-flights";

import flightData from "@/data/flights.json";

// ===== State =====
interface FlightState {
  rawData: FlightSearchResponse;
  allFlights: Record<string, NormalizedFlight[]>;
  filters: FilterState;
  searchQuery: SearchQuery;
  metaData: MetaData;
  hasSearched: boolean;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
}

// ===== Actions =====
type FlightAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ACTIVE_JOURNEY"; payload: "J1" | "J2" }
  | { type: "SET_SORT"; payload: SortBy }
  | { type: "SET_STOPS"; payload: StopsFilter }
  | { type: "SET_PRICE_RANGE"; payload: [number, number] }
  | { type: "SET_DEPARTURE_TIME"; payload: DepartureTimeRange }
  | { type: "SET_PAGE"; payload: number }
  | { type: "RESET_FILTERS" }
  | {
      type: "SET_SEARCH_RESULTS";
      payload: {
        origin: string;
        destination: string;
        departureDate: string;
        returnDate: string;
        tripType: "one-way" | "round-trip";
        passengers: { ADT: number; CHD: number; INF: number };
        outboundFlights: NormalizedFlight[];
        returnFlights: NormalizedFlight[];
      };
    };

// ===== Reducer =====
function flightReducer(state: FlightState, action: FlightAction): FlightState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_ACTIVE_JOURNEY":
      return {
        ...state,
        filters: { ...state.filters, activeJourney: action.payload },
        currentPage: 1,
      };
    case "SET_SORT":
      return {
        ...state,
        filters: { ...state.filters, sortBy: action.payload },
        currentPage: 1,
      };
    case "SET_STOPS":
      return {
        ...state,
        filters: { ...state.filters, stops: action.payload },
        currentPage: 1,
      };
    case "SET_PRICE_RANGE":
      return {
        ...state,
        filters: { ...state.filters, priceRange: action.payload },
        currentPage: 1,
      };
    case "SET_DEPARTURE_TIME":
      return {
        ...state,
        filters: { ...state.filters, departureTimeRange: action.payload },
        currentPage: 1,
      };
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "RESET_FILTERS": {
      const activeFlights = state.allFlights[state.filters.activeJourney] ?? [];
      const [min, max] = getPriceRange(activeFlights);
      return {
        ...state,
        filters: {
          ...state.filters,
          stops: "any",
          departureTimeRange: "any",
          priceRange: [min, max],
          sortBy: "price",
        },
        currentPage: 1,
      };
    }
    case "SET_SEARCH_RESULTS": {
      const {
        origin,
        destination,
        departureDate,
        returnDate,
        tripType,
        passengers,
        outboundFlights,
        returnFlights,
      } = action.payload;

      const newAllFlights: Record<string, NormalizedFlight[]> = {
        J1: outboundFlights,
      };
      if (tripType === "round-trip" && returnFlights.length > 0) {
        newAllFlights["J2"] = returnFlights;
      }

      const [min, max] = getPriceRange(outboundFlights);

      return {
        ...state,
        allFlights: newAllFlights,
        hasSearched: true,
        filters: {
          ...state.filters,
          origin,
          destination,
          departureDate,
          returnDate,
          tripType,
          passengers,
          stops: "any",
          departureTimeRange: "any",
          priceRange: [min, max],
          sortBy: "price",
          activeJourney: "J1",
        },
        searchQuery: {
          ...state.searchQuery,
          origin,
          destination,
          departureDate,
          returnDate,
          type: tripType === "round-trip" ? "R" : "O",
          ADT: String(passengers.ADT),
          CHD: String(passengers.CHD),
          INF: String(passengers.INF),
        },
        currentPage: 1,
      };
    }
    default:
      return state;
  }
}

// ===== Context =====
interface FlightContextValue {
  state: FlightState;
  filteredFlights: NormalizedFlight[];
  paginatedFlights: NormalizedFlight[];
  totalPages: number;
  activeFlights: NormalizedFlight[];
  priceRange: [number, number];
  dispatch: React.Dispatch<FlightAction>;
  setActiveJourney: (j: "J1" | "J2") => void;
  setSort: (s: SortBy) => void;
  setStops: (s: StopsFilter) => void;
  setPriceRange: (r: [number, number]) => void;
  setDepartureTime: (d: DepartureTimeRange) => void;
  setPage: (p: number) => void;
  resetFilters: () => void;
  setSearchParams: (params: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate: string;
    tripType: "one-way" | "round-trip";
    passengers: { ADT: number; CHD: number; INF: number };
  }) => void;
}

const FlightContext = createContext<FlightContextValue | null>(null);

// ===== Provider =====
export function FlightProvider({ children }: { children: ReactNode }) {
  const rawData = flightData as unknown as FlightSearchResponse;
  const allFlights = useMemo(() => normalizeFlights(rawData), [rawData]);
  const searchQuery = rawData.data.result.searchQuery;
  const metaData = rawData.data.result.metaData;

  const j1Flights = allFlights["J1"] ?? [];
  const [minP, maxP] = getPriceRange(j1Flights);

  const initialState: FlightState = {
    rawData,
    allFlights,
    filters: {
      tripType: searchQuery.type === "R" ? "round-trip" : "one-way",
      origin: searchQuery.origin,
      destination: searchQuery.destination,
      departureDate: searchQuery.departureDate,
      returnDate: searchQuery.returnDate,
      passengers: {
        ADT: parseInt(searchQuery.ADT),
        CHD: parseInt(searchQuery.CHD),
        INF: parseInt(searchQuery.INF),
      },
      priceRange: [minP, maxP],
      stops: "any",
      departureTimeRange: "any",
      sortBy: "price",
      activeJourney: "J1",
    },
    searchQuery,
    metaData,
    hasSearched: false,
    isLoading: false,
    error: null,
    currentPage: 1,
    pageSize: 5,
  };

  const [state, dispatch] = useReducer(flightReducer, initialState);

  // Simulate loading on mount
  useEffect(() => {
    dispatch({ type: "SET_LOADING", payload: true });
    const timer = setTimeout(() => {
      dispatch({ type: "SET_LOADING", payload: false });
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Get active journey flights
  const activeFlights = useMemo(
    () => state.allFlights[state.filters.activeJourney] ?? [],
    [state.allFlights, state.filters.activeJourney],
  );

  const priceRange = useMemo(
    () => getPriceRange(activeFlights),
    [activeFlights],
  );

  // Apply filters & sorting (no origin/destination filter needed since
  // generated data is already for the correct route)
  const filteredFlights = useMemo(() => {
    let flights = [...activeFlights];

    // Filter by stops
    if (state.filters.stops !== "any") {
      flights = flights.filter((f) => {
        switch (state.filters.stops) {
          case "non-stop":
            return f.totalStops === 0;
          case "1-stop":
            return f.totalStops === 1;
          case "2+-stops":
            return f.totalStops >= 2;
          default:
            return true;
        }
      });
    }

    // Filter by price range
    flights = flights.filter(
      (f) =>
        f.pricePerAdult >= state.filters.priceRange[0] &&
        f.pricePerAdult <= state.filters.priceRange[1],
    );

    // Filter by departure time
    if (state.filters.departureTimeRange !== "any") {
      flights = flights.filter((f) => {
        const hour = getHourFromISO(f.departureTime);
        switch (state.filters.departureTimeRange) {
          case "morning":
            return hour >= 5 && hour < 12;
          case "afternoon":
            return hour >= 12 && hour < 17;
          case "evening":
            return hour >= 17 && hour < 21;
          case "night":
            return hour >= 21 || hour < 5;
          default:
            return true;
        }
      });
    }

    // Sort
    switch (state.filters.sortBy) {
      case "price":
        flights.sort((a, b) => a.pricePerAdult - b.pricePerAdult);
        break;
      case "duration":
        flights.sort((a, b) => a.totalDurationMin - b.totalDurationMin);
        break;
      case "departure":
        flights.sort((a, b) => {
          // Parse directly from string to avoid timezone hydration issues
          const aMatch = a.departureTime.match(/T(\d{2}):(\d{2})/);
          const bMatch = b.departureTime.match(/T(\d{2}):(\d{2})/);
          const aMin = aMatch
            ? parseInt(aMatch[1]) * 60 + parseInt(aMatch[2])
            : 0;
          const bMin = bMatch
            ? parseInt(bMatch[1]) * 60 + parseInt(bMatch[2])
            : 0;
          return aMin - bMin;
        });
        break;
    }

    return flights;
  }, [activeFlights, state.filters]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredFlights.length / state.pageSize),
  );
  const paginatedFlights = useMemo(() => {
    const start = (state.currentPage - 1) * state.pageSize;
    return filteredFlights.slice(start, start + state.pageSize);
  }, [filteredFlights, state.currentPage, state.pageSize]);

  // Action creators
  const setActiveJourney = useCallback(
    (j: "J1" | "J2") => dispatch({ type: "SET_ACTIVE_JOURNEY", payload: j }),
    [],
  );
  const setSort = useCallback(
    (s: SortBy) => dispatch({ type: "SET_SORT", payload: s }),
    [],
  );
  const setStops = useCallback(
    (s: StopsFilter) => dispatch({ type: "SET_STOPS", payload: s }),
    [],
  );
  const setPriceRange = useCallback(
    (r: [number, number]) => dispatch({ type: "SET_PRICE_RANGE", payload: r }),
    [],
  );
  const setDepartureTime = useCallback(
    (d: DepartureTimeRange) =>
      dispatch({ type: "SET_DEPARTURE_TIME", payload: d }),
    [],
  );
  const setPage = useCallback(
    (p: number) => dispatch({ type: "SET_PAGE", payload: p }),
    [],
  );
  const resetFilters = useCallback(
    () => dispatch({ type: "RESET_FILTERS" }),
    [],
  );
  const setSearchParams = useCallback(
    (params: {
      origin: string;
      destination: string;
      departureDate: string;
      returnDate: string;
      tripType: "one-way" | "round-trip";
      passengers: { ADT: number; CHD: number; INF: number };
    }) => {
      dispatch({ type: "SET_LOADING", payload: true });

      // Generate flights dynamically based on the search
      setTimeout(() => {
        const outboundFlights = generateFlightsForRoute(
          params.origin,
          params.destination,
          params.departureDate,
          state.metaData,
          state.metaData.airlineDetail,
        );

        let returnFlights: NormalizedFlight[] = [];
        if (params.tripType === "round-trip" && params.returnDate) {
          returnFlights = generateFlightsForRoute(
            params.destination,
            params.origin,
            params.returnDate,
            state.metaData,
            state.metaData.airlineDetail,
          );
          // Fix journey keys for return flights
          returnFlights = returnFlights.map((f) => ({
            ...f,
            journeyKey: "J2",
          }));
        }

        dispatch({
          type: "SET_SEARCH_RESULTS",
          payload: {
            ...params,
            outboundFlights,
            returnFlights,
          },
        });
        dispatch({ type: "SET_LOADING", payload: false });
      }, 800);
    },
    [state.metaData],
  );

  const value = useMemo(
    () => ({
      state,
      filteredFlights,
      paginatedFlights,
      totalPages,
      activeFlights,
      priceRange,
      dispatch,
      setActiveJourney,
      setSort,
      setStops,
      setPriceRange,
      setDepartureTime,
      setPage,
      resetFilters,
      setSearchParams,
    }),
    [
      state,
      filteredFlights,
      paginatedFlights,
      totalPages,
      activeFlights,
      priceRange,
      setActiveJourney,
      setSort,
      setStops,
      setPriceRange,
      setDepartureTime,
      setPage,
      resetFilters,
      setSearchParams,
    ],
  );

  return (
    <FlightContext.Provider value={value}>{children}</FlightContext.Provider>
  );
}

export function useFlights() {
  const ctx = useContext(FlightContext);
  if (!ctx) throw new Error("useFlights must be used within a FlightProvider");
  return ctx;
}
