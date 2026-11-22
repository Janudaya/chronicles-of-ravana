# RAVANA TRAIL — The Chronicle of Lanka 👑🇱🇰

> Cinematic, interactive tourism and historical storytelling web application mapping King Ravana's life journey to 12 modern-day sacred coordinates in Sri Lanka.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Lucide Icons**, and **React-Leaflet**.

---

## ✨ Features & Architecture

### 1. Visual Theme & Aesthetic
- **Theme:** Cinematic Dark & Royal Gold
- **Colors:** Deep Obsidian (`#0B0F19`), Translucent Dark Cards (`#111827/85` with `backdrop-blur-md`), Royal Gold Accents (`#F59E0B`), and Crisp Off-White Typography (`#F8FAFC`).
- **Typography:** Majestic `Cinzel` serif headers, `Inter` body text, and `Noto Sans Sinhala` for authentic Sinhala script rendering.

### 2. Core Layout & Scrollytelling
- **Floating Minimal Glass Navbar:**
  - Brand Logo with Golden Crown
  - Chapter Quick-Filter Pills: `All`, `Birth & Rise`, `Sovereignty & Science`, `The Great Conflict`, `Final Resting`
  - Dynamic `"My Trail (count)"` button linking directly to the custom trip itinerary drawer
  - Fit Sri Lanka overview button
- **Desktop Split-Screen View (`h-screen overflow-hidden`):**
  - **Left Panel (40% width, scrollable):** Chronological story cards from `src/data/ravanaLocations.ts` with order numbers (`#01` to `#12`), chapter badges, bilingual titles (English & Sinhala), district tags, difficulty ratings, and story previews. Includes real-time search.
  - **Right Panel (60% width, sticky full-height):** Interactive **React-Leaflet** map with **CartoDB Dark Matter** tiles centered on Sri Lanka (`[7.8731, 80.7718]`).
  - **Synchronized Map & Story:**
    - Custom glowing golden markers (`#F59E0B`) with subtle pulsing glow.
    - Subtle golden dashed polyline tracing Ravana's chronological footsteps.
    - `map.flyTo` animations smoothly transitioning between coordinates (zoom 12) upon card selection or marker interaction.
    - Synchronized dual-scrolling between list cards and map markers.
- **Mobile Responsive Layout:**
  - Auto-adapts to stacked top-map (45vh) and bottom-scrollable story cards (55vh) with an interactive "Expand Map / Show Stories" toggle pill.

### 3. Location Detail Slide-Over Drawer
Opens upon clicking `"Explore Location"` on cards or map popups:
- Site metadata (Bilingual Titles, District, formatted GPS coordinates with one-click copy, Difficulty, and Best Season).
- **Three Clean Tabs:**
  1. **`Story`**: Full mythological & historical narrative.
  2. **`Archaeology vs. Folklore`**: Direct comparison cards of verified archaeological excavations (`archaeologyNote`) vs oral traditions (`folkloreNote`), plus site highlight tags.
  3. **`Visitor Guide`**: Practical travel recommendations, season window, and two prominent actions:
     - **`Open in Google Maps`**: Directly navigates to `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`.
     - **`Add to My Trail / Remove from Trail`**: Toggles personal itinerary state (persisted in `localStorage`).

### 4. "My Trail" Custom Trip Planner Drawer
- Sequence of user-selected stops in chronological order.
- Estimated trip days calculation (e.g., 1 day per 2-3 stops) and total districts covered.
- **`View Route on Map`**: Toggles map route mode to filter map polyline and markers strictly to selected stops.
- **`Share Itinerary`**: Copies a formatted text/markdown itinerary summary to clipboard with toast confirmation.
- 1-Click "Add Recommended 5-Stop Highlights Trail" fallback.

---

## 🚀 How to Run

### Development Server
Double-click `run-dev.bat` or run in PowerShell:
```powershell
.\run-dev.ps1
```
Or with Node.js directly:
```powershell
$env:PATH = "C:\Users\JANUDAYA\.gemini\antigravity\scratch\nodejs;" + $env:PATH
$env:NEXT_FORCE_SWC_WASM = "1"
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Production Build
```powershell
$env:PATH = "C:\Users\JANUDAYA\.gemini\antigravity\scratch\nodejs;" + $env:PATH
$env:NEXT_FORCE_SWC_WASM = "1"
npm run build
```

---

## 📂 Project Structure
```
chronicles-of-ravana/
├── src/
│   ├── app/
│   │   ├── globals.css           # Tailwind + Leaflet dark theme + gold scrollbars
│   │   ├── layout.tsx            # Cinematic typography & metadata
│   │   └── page.tsx              # Split-screen responsive scrollytelling container
│   ├── components/
│   │   ├── Navbar.tsx            # Floating glassmorphic filter bar
│   │   ├── StoryPanel.tsx        # Left scrollytelling column + search
│   │   ├── StoryCard.tsx         # Chronological story card
│   │   ├── LocationDetailDrawer.tsx # 3-Tab detail slide-over
│   │   ├── MyTrailDrawer.tsx     # Custom itinerary planner drawer
│   │   └── Map/
│   │       ├── MapWrapper.tsx    # Dynamic SSR:false Leaflet wrapper
│   │       ├── RavanaMap.tsx     # Leaflet map, CartoDB tiles, gold markers & polylines
│   │       └── MapController.tsx # Smooth flyTo animation controller
│   └── data/
│       └── ravanaLocations.ts    # 12 sacred sites dataset
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
├── run-dev.bat
├── run-dev.ps1
└── README.md
```
