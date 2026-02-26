# ✈️ Flight Search UI – Frontend Developer Assignment

This project is a Flight Search & Listing module built using **Next.js (App Router)** as part of a frontend developer technical evaluation.

The goal was to build a scalable, clean, and production-ready flight search interface using a normalized airline JSON structure.

---

## 📌 Assignment Scope

Build only the **Flight Search & Listing module** with:

- Search filters
- Flight result listing
- Sorting functionality
- Pagination
- Loading state
- Empty state
- Error handling

No authentication, booking, or payment flow included (as per assignment scope).

---

## 🛠 Tech Stack

- **Next.js (App Router)**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **React Context API (State Management)**

---

## 🧠 Architecture Decisions

### 1️⃣ Data Transformation Layer

The provided API followed a **normalized airline structure**:

- `journeys`
- `sectors`
- `flights`
- `fares`
- `otherDetails`

Instead of rendering directly from nested data:

- Created a transformation utility in `lib/`
- Flattened sector-based structure into UI-friendly objects
- Derived stops from segment count
- Extracted pricing from fares
- Used `otherDetails` for sorting & filtering

This ensures:
- Clean UI layer
- No business logic inside JSX
- Better maintainability

---

### 2️⃣ State Management Strategy

Used **React Context API** to manage:

- Active filters
- Sorting state
- Pagination state
- Filtered results

This avoids:
- Prop drilling
- Over-complex state handling
- Tight coupling between components

---

### 3️⃣ Component Structure

components/
├── flights/ (Domain components)

├── ui/ (Reusable base components)

context/

hooks/

lib/ (Business logic & data transformation)

types/ (TypeScript models)


Separation ensures:

- UI components remain presentational
- Logic lives in utilities
- Strong typing across app

---

## ✨ Features Implemented

### 🔍 Search & Filters

- Source city
- Destination city
- Departure date
- Return date (optional)
- One-way / Round-trip
- Passenger count
- Price range filter
- Stops filter (Non-stop, 1 stop, 2+ stops)
- Departure time range filter

---

### 📊 Sorting

- Sort by Price
- Sort by Duration
- Sort by Departure Time
- Ascending / Descending toggle

---

### 📄 Pagination

- Client-side pagination
- Optimized rendering
- Controlled state updates

---

### 📦 Flight Card Includes

- Airline name
- Flight number
- Departure & arrival time
- Duration
- Stop count
- Price
- Select button

---

## ⚙️ Functional Requirements Coverage

| Feature | Implemented |
|----------|-------------|
| Filtering | ✅ |
| Sorting | ✅ |
| Pagination | ✅ |
| Loading State | ✅ |
| Empty State | ✅ |
| Error Handling | ✅ |

---

## 🧪 Code Quality Considerations

- TypeScript models for API structure
- No inline business logic in JSX
- Reusable UI components
- Proper separation of concerns
- Clean naming conventions
- Modular folder structure
- Maintainable state flow

---

## 🚀 Performance Considerations

- Derived state instead of unnecessary re-renders
- Filter + sort applied in controlled pipeline
- Avoided excessive state duplication
- Optimized component structure

---

## 🖥️ How to Run Locally

```bash
git clone https://github.com/Saif-herry/chandni-airline.git
cd chandni-airline
npm install
npm run dev
