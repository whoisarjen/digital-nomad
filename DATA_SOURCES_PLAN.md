# Data Sources Rebuild Plan

This document contains all data source tasks for the digital nomad app. Each task is self-contained and can be picked up independently.

---

## PHASE 1: Restore Core Data (Quick Wins)

### TASK 1: Open-Meteo Weather API Integration

**Goal:** Rebuild weather data pipeline for all cities using Open-Meteo Historical Weather API.

**API Details:**
- Base URL: `https://archive-api.open-meteo.com/v1/archive`
- No API key required
- Rate limits: 10,000 calls/day, 5,000/hour, 600/minute
- License: Free for non-commercial use (CC BY 4.0)
- Coverage: Global, any lat/lng coordinate, data from 1940 to present

**What it replaces:** The `Weather` model daily data and `MonthSummary` aggregations.

**Data fields available (daily):**
- `temperature_2m_max`, `temperature_2m_min` (Celsius)
- `apparent_temperature_max`, `apparent_temperature_min` (Celsius)
- `precipitation_sum` (mm)
- `rain_sum` (mm)
- `snowfall_sum` (cm)
- `sunshine_duration` (seconds)
- `daylight_duration` (seconds)
- `wind_speed_10m_max` (km/h)
- `wind_gusts_10m_max` (km/h)
- `wind_direction_10m_dominant` (degrees)
- `shortwave_radiation_sum` (MJ/m2)
- `weather_code` (WMO standard codes)

**Example API call:**
```
https://archive-api.open-meteo.com/v1/archive?latitude=13.75&longitude=100.52&start_date=2023-01-01&end_date=2023-12-31&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,rain_sum,snowfall_sum,sunshine_duration,daylight_duration,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,shortwave_radiation_sum&timezone=auto
```

**Implementation steps:**
1. Create a cron endpoint `src/server/api/cron/sync-weather.ts`
2. For each city in the database, fetch last 3 years of daily weather using city's lat/lng
3. Upsert into the `Weather` model (unique on `[citySlug, date]`)
4. After daily data is stored, recompute `MonthSummary` aggregates (monthly means for temperature, rain, sunshine, etc.)
5. Derive `weatherIcon` enum from WMO weather codes (map code ranges to SUN/CLOUDY/WIND/RAIN/SNOW)
6. Compute `totalScore` per month from weighted combination of sunshine, temperature, low rain
7. Schedule to run monthly to keep data fresh

**Prisma fields this populates:**
- `Weather`: all 14 weather metric fields + `weatherCode` + `date`
- `MonthSummary`: all 14 aggregated fields + `weatherIcon` + `totalScore`

**Notes:**
- Batch cities to respect 600/minute rate limit (process ~500 cities over ~2 hours with delays)
- Query 1 full year per API call to minimize call count
- Requests spanning >14 days count as multiple API calls against the daily limit

---

### TASK 2: WAQI Air Quality API Integration

**Goal:** Populate real-time and historical air quality data for all cities.

**API Details:**
- Base URL: `https://api.waqi.info/`
- Auth: Free token required (register at https://aqicn.org/data-platform/token/)
- Rate limits: 1,000 requests/second (extremely generous)
- Coverage: 11,000+ monitoring stations, 1,000+ cities, 100+ countries
- License: Free for non-commercial use, attribution required

**What it replaces:** The `City` model fields `airQualityNow`, `airQuality`, `airQualityScore`, `airQualityNowScore`.

**Key endpoints:**
```
# Get AQI by city name
https://api.waqi.info/feed/bangkok/?token=YOUR_TOKEN

# Get AQI by lat/lng (finds nearest station)
https://api.waqi.info/feed/geo:13.75;100.52/?token=YOUR_TOKEN

# Search stations by keyword
https://api.waqi.info/search/?keyword=bangkok&token=YOUR_TOKEN

# Get stations within bounding box
https://api.waqi.info/v2/map/bounds?latlng=13.5,100.3,14.0,100.8&networks=all&token=YOUR_TOKEN
```

**Response includes:**
- `aqi` (integer, US EPA AQI scale 0-500)
- `iaqi` object with individual pollutants: pm25, pm10, o3, no2, so2, co
- `time` object with measurement timestamp
- `city` object with name, geo coordinates, station URL

**Implementation steps:**
1. Create cron endpoint `src/server/api/cron/sync-air-quality.ts`
2. For each city, query WAQI by lat/lng to get nearest station AQI
3. Store current AQI as `airQualityNow` (integer, raw AQI value)
4. Compute `airQualityNowScore` as a normalized 0-5 scale:
   - 0-50 AQI = 5 (Good)
   - 51-100 = 4 (Moderate)
   - 101-150 = 3 (Unhealthy for sensitive)
   - 151-200 = 2 (Unhealthy)
   - 201-300 = 1 (Very unhealthy)
   - 301+ = 0 (Hazardous)
5. Maintain rolling average for `airQuality` (float, long-term average)
6. Derive `airQualityScore` (integer 0-5) from the rolling average
7. Schedule to run daily

**Fallback:** For cities without a nearby WAQI station, use Open-Meteo Air Quality API:
```
https://air-quality-api.open-meteo.com/v1/air-quality?latitude=13.75&longitude=100.52&hourly=us_aqi,pm2_5,pm10
```
Open-Meteo AQ uses model-based data (CAMS) so it covers everywhere, but is less accurate than real station data.

**Notes:**
- Store the WAQI token in environment variables
- Some cities may have multiple stations -- use the one closest to city center coordinates
- WAQI attribution required: link to https://aqicn.org/ somewhere on the page

---

### TASK 3: Unsplash Image Pipeline (Already Working)

**Goal:** Ensure the existing Unsplash integration continues working and fill gaps for cities missing images.

**API Details:**
- Base URL: `https://api.unsplash.com/`
- Auth: API key required (register at https://unsplash.com/developers)
- Rate limits: 50 req/hour (dev), 5,000 req/hour (production approval)
- License: Free, attribution appreciated but not legally required

**What it populates:** The `Image` model (url, blurHash, downloadLocation, ownerName, ownerUsername, width, height).

**Key endpoints:**
```
# Search photos by city name
GET https://api.unsplash.com/search/photos?query=Bangkok+skyline&per_page=1&orientation=landscape

# Trigger download tracking (required by API guidelines)
GET https://api.unsplash.com/photos/:id/download
```

**Implementation steps:**
1. Create cron endpoint `src/server/api/cron/sync-images.ts`
2. Query cities that have no `image` relation
3. For each, search Unsplash for `"{cityName} city skyline"` with landscape orientation
4. Pick the first high-quality result (width >= 1920)
5. Store image data including `blurHash` for placeholder loading
6. Trigger the download endpoint to comply with Unsplash API guidelines
7. Run once to fill gaps, then on-demand for new cities

**Backup source -- Pexels API:**
- URL: `https://api.pexels.com/v1/search?query=Bangkok&per_page=1`
- Auth: API key (free registration)
- Rate limits: 200/hour, 20,000/month (can request unlimited)
- Use for cities where Unsplash has no good results

---

### TASK 4: City Seed Data from Wikidata + GeoNames

**Goal:** Populate/verify city geographic data (lat/lng, population, country, state, countryCode, region) from authoritative open sources.

**Wikidata SPARQL:**
- Endpoint: `https://query.wikidata.org/sparql`
- No auth required
- Format: JSON with `format=json` parameter

**Example query to get all cities with population > 100K:**
```sparql
SELECT ?city ?cityLabel ?countryLabel ?population ?coord ?timezone WHERE {
  ?city wdt:P31/wdt:P279* wd:Q515 .
  ?city wdt:P17 ?country .
  ?city wdt:P1082 ?population .
  ?city wdt:P625 ?coord .
  OPTIONAL { ?city wdt:P421 ?timezone . }
  FILTER(?population > 100000)
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
}
ORDER BY DESC(?population)
LIMIT 2000
```

**GeoNames API:**
- Base URL: `http://api.geonames.org/`
- Auth: Free username (register at geonames.org)
- Rate limits: 10,000 credits/day, 1,000/hour
- Coverage: 11+ million place names globally

**Key endpoint:**
```
http://api.geonames.org/searchJSON?q=Bangkok&maxRows=1&username=YOUR_USERNAME&style=FULL
```

**Returns:** name, country, countryCode, population, lat, lng, timezone, elevation, adminName1 (state/province).

**Implementation steps:**
1. Create a one-time seed script `scripts/seed-cities.ts`
2. Query Wikidata for cities with population > 50K (covers your 500+ city target)
3. For each city, also query GeoNames to get `countryCode`, `stateCode`, `state`, timezone
4. Map to your `City` model fields: slug (generate from name), name, country, countryCode, latitude, longitude, population, state, stateCode, region (derive from country/continent)
5. Upsert into database (don't overwrite manually curated data)
6. Output a report of cities added/updated

**Notes:**
- Wikidata query timeout is 60 seconds -- use LIMIT and paginate if needed
- Generate slugs as lowercase kebab-case: "Bangkok" -> "bangkok", "Ho Chi Minh City" -> "ho-chi-minh-city"
- Map countries to your Region enum using a country-to-continent lookup

---

## PHASE 2: Rebuild Quality Metrics

### TASK 5: Internet Speed from Ookla Open Data

**Goal:** Populate city-level internet speed data from Ookla's open Speedtest dataset.

**Data Source:**
- AWS S3 bucket: `s3://ookla-open-data/`
- Format: Apache Parquet with WKT geometries
- License: CC BY-NC-SA 4.0 (non-commercial)
- Updated: Quarterly (latest: most recent completed quarter)
- No auth required (`--no-sign-request`)

**Data fields per tile:**
- `avg_d_kbps` -- average download speed (kilobits/sec)
- `avg_u_kbps` -- average upload speed (kilobits/sec)
- `avg_lat_ms` -- average latency (milliseconds)
- `tests` -- number of speed tests in tile
- `devices` -- number of unique devices
- `tile` -- WKT geometry (Web Mercator, ~610m x 610m)

**Two layers:**
- `performance/type=fixed/` -- WiFi/ethernet (for `internetSpeedCity`)
- `performance/type=mobile/` -- cellular connections

**Download command:**
```bash
aws s3 cp s3://ookla-open-data/parquet/performance/type=fixed/year=2025/quarter=1/ ./ookla-data/ --recursive --no-sign-request
```

**Implementation steps:**
1. Download latest quarter's fixed-broadband Parquet files
2. Load into a processing environment (Python with geopandas/DuckDB, or PostGIS)
3. For each city in the database, define a circular boundary (e.g., 15km radius from city center lat/lng)
4. Select all tiles whose centroid falls within the city boundary
5. Compute weighted average download speed: `SUM(avg_d_kbps * tests) / SUM(tests)`
6. Convert from kbps to Mbps: `result / 1000`
7. Store as `internetSpeedCity` in the City model
8. For country-level: aggregate all tiles within each country's boundaries
9. Store as `internetSpeedCountry`
10. Compute rankings by sorting cities/countries by speed descending
11. Store as `internetSpeedCityRanking` and `internetSpeedCountryRanking`

**Alternative (simpler, less accurate):** Use Cable.co.uk country-level data (CSV download from https://bestbroadbanddeals.co.uk/broadband/speed/worldwide-speed-league/) for country speeds, and leave city-level speeds to be crowdsourced from users.

**Notes:**
- Parquet files for a single quarter are several GB -- needs adequate disk space
- This is a quarterly batch job, not a real-time API
- Consider pre-processing and storing the city-level results as a JSON/CSV that the sync script reads

---

### TASK 6: Safety Scores from Multiple Sources

**Goal:** Build composite safety scores for each city's country from free institutional data.

**Source 1: World Bank -- Intentional Homicide Rate**
- API: `https://api.worldbank.org/v2/country/all/indicator/VC.IHR.PSRC.P5?format=json&per_page=300&date=2022`
- No auth, free
- Returns: homicides per 100,000 people per country
- Updated annually

**Source 2: Global Peace Index (GPI)**
- Download: CSV from https://www.kaggle.com/datasets/natalyreguerin/global-peace-index-gpi
- Or from QoG Data Finder: https://datafinder.qog.gu.se/dataset/gpi
- Coverage: 163 countries, score 1-5 (lower = more peaceful)
- Updated annually (June)

**Source 3: Transparency International Corruption Perceptions Index**
- CSV from: https://github.com/datasets/corruption-perceptions-index
- Coverage: 180 countries, score 0-100 (higher = less corrupt)
- Updated annually (January)

**Source 4: World Bank -- Political Stability Index**
- API: `https://api.worldbank.org/v2/country/all/indicator/PV.EST?format=json&per_page=300`
- Scale: -2.5 (weak) to +2.5 (strong)
- Part of Worldwide Governance Indicators

**Composite score calculation:**
```
safetyRaw = (
  normalizedHomicideRate * 0.35 +    // inverted: lower homicide = higher score
  normalizedGPI * 0.30 +              // inverted: lower GPI = higher score
  normalizedCPI * 0.20 +              // direct: higher CPI = higher score
  normalizedPoliticalStability * 0.15  // direct: higher = better
)

safety = safetyRaw >= 0.66 ? 'HIGH' : safetyRaw >= 0.33 ? 'MIDDLE' : 'LOW'
```

**Implementation steps:**
1. Create script `scripts/compute-safety-scores.ts`
2. Fetch homicide rates from World Bank API for all countries
3. Download and parse GPI CSV
4. Download and parse CPI CSV from GitHub
5. Fetch political stability from World Bank API
6. Normalize each metric to 0-1 range across all countries
7. Compute weighted composite score
8. Map to LOW/MIDDLE/HIGH enum
9. Update all cities' `safety` field based on their country
10. Also populate `QualityIndex.safetyIndex` with the raw composite score (0-100)

**Also populate QualityIndex fields:**
- `safetyIndex` from the composite above

**Notes:**
- This is country-level, not city-level. All cities in the same country get the same safety score.
- Run annually after GPI and CPI release new data
- Store the raw data files in `data/` directory for reproducibility

---

### TASK 7: Healthcare Quality from WHO + World Bank

**Goal:** Build healthcare quality scores from WHO and World Bank indicators.

**Source 1: WHO Global Health Observatory API**
- Base URL: `https://ghoapi.azureedge.net/api/`
- No auth required
- Format: JSON (OData)

**Key indicators:**
```
# Doctors per 10,000 population
https://ghoapi.azureedge.net/api/HWF_0001?$filter=TimeDim ge 2018

# Hospital beds per 10,000 population
https://ghoapi.azureedge.net/api/WHS6_102?$filter=TimeDim ge 2018

# Life expectancy at birth
https://ghoapi.azureedge.net/api/WHOSIS_000001?$filter=TimeDim ge 2020

# Universal Health Coverage index
https://ghoapi.azureedge.net/api/UHC_INDEX_REPORTED?$filter=TimeDim ge 2019
```

**Source 2: World Bank API**
```
# Health expenditure per capita (current US$)
https://api.worldbank.org/v2/country/all/indicator/SH.XPD.CHEX.PC.CD?format=json&per_page=300&date=2021

# Health expenditure as % of GDP
https://api.worldbank.org/v2/country/all/indicator/SH.XPD.CHEX.GD.ZS?format=json&per_page=300
```

**Composite score calculation:**
```
healthcareRaw = (
  normalizedDoctorsPer10K * 0.25 +
  normalizedHospitalBedsPer10K * 0.20 +
  normalizedLifeExpectancy * 0.20 +
  normalizedUHCIndex * 0.20 +
  normalizedHealthExpPerCapita * 0.15
)

healthCare = healthcareRaw >= 0.66 ? 'HIGH' : healthcareRaw >= 0.33 ? 'MIDDLE' : 'LOW'
```

**Implementation steps:**
1. Create script `scripts/compute-healthcare-scores.ts`
2. Fetch all 5 indicators from WHO and World Bank APIs
3. Join on ISO3 country code (WHO uses ISO3, World Bank uses ISO3 alpha-3)
4. Normalize each to 0-1 range
5. Compute weighted composite
6. Map to LOW/MIDDLE/HIGH for the `healthCare` field on City
7. Store raw composite as `QualityIndex.healthCareIndex` (0-100)

**Notes:**
- WHO uses ISO3 country codes (e.g., "THA" for Thailand)
- World Bank uses ISO2 or ISO3 (both work)
- Some indicators have gaps for small countries -- use available data, fallback to regional averages
- Run annually

---

### TASK 8: Cost of Living from Teleport API + Kaggle Seed

**Goal:** Populate cost of living data. This is the hardest category -- no great free city-level API exists.

**Strategy:** Seed from multiple free sources, plan for crowdsourcing long-term.

**Source 1: Teleport API (test if still alive)**
- Base URL: `https://api.teleport.org/api/`
- No auth required
- Coverage: ~266 urban areas
- Status: Possibly stale (company acquired by Topia)

**Test endpoint:**
```
https://api.teleport.org/api/urban_areas/slug:bangkok/scores/
```

**Returns 17 quality-of-life scores (0-10) including:**
- Cost of Living
- Housing
- Safety
- Healthcare
- Education
- Environmental Quality
- Economy
- Taxation
- Internet Access
- Tolerance
- Commute
- Business Freedom
- Travel Connectivity

**If Teleport is alive:** Use it for the 266 cities it covers. It gives both cost scores AND quality metrics.

**Source 2: Kaggle Cost of Living Dataset**
- URL: https://www.kaggle.com/datasets/mvieira101/global-cost-of-living
- Format: CSV
- Coverage: 4,000+ cities with 55 cost items (originally from Numbeo)
- Status: Static snapshot (last updated varies)

**Cost items include:** meal at restaurant, cappuccino, beer, monthly transit pass, utilities, internet, gym, 1BR apartment rent (center/outside), taxi, groceries, etc.

**How to compute monthly costs from item prices:**
```
costForNomadInUsd = (
  rent_1br_center +          // housing
  utilities_basic +           // utilities
  internet_monthly +          // internet
  (meal_inexpensive * 60) +   // eating out ~2x/day
  (cappuccino * 20) +         // coffee
  (monthly_transit_pass) +    // transport
  (gym_monthly) +             // gym
  (beer_domestic * 8)         // entertainment
)

costForExpatInUsd = costForNomadInUsd * 1.15   // ~15% more (better housing)
costForLocalInUsd = costForNomadInUsd * 0.60   // locals spend ~60% of nomad
costForFamilyInUsd = costForNomadInUsd * 2.2   // family ~2.2x single nomad
```

**Source 3: World Bank PPP Data (country-level supplement)**
```
# GDP per capita, PPP (current international $)
https://api.worldbank.org/v2/country/all/indicator/NY.GDP.PCAP.PP.CD?format=json&per_page=300

# Consumer Price Index
https://api.worldbank.org/v2/country/all/indicator/FP.CPI.TOTL.ZG?format=json&per_page=300
```

**Implementation steps:**
1. Create script `scripts/seed-cost-of-living.ts`
2. First, test Teleport API -- if alive, fetch scores for all 266 urban areas
3. Download Kaggle CSV, parse item prices per city
4. Compute nomad/expat/local/family monthly costs using the formula above
5. Match Kaggle cities to your existing city slugs (fuzzy match on name + country)
6. Upsert into `City.costForNomadInUsd`, `costForExpatInUsd`, `costForLocalInUsd`, `costForFamilyInUsd`
7. For cities not in Kaggle, estimate from country-level PPP data (scale regional average by PPP ratio)
8. Also derive `costOfLiving` enum (LOW/MIDDLE/HIGH) from relative cost ranking

**Long-term plan:** Build crowdsourced price submissions from users (see Task 18).

**Notes:**
- Kaggle data is a snapshot -- prices may be outdated
- Apply inflation adjustment using World Bank CPI data for the gap years
- Flag cities with old data so users know freshness

---

### TASK 9: Remaining QualityIndex Fields

**Goal:** Populate the remaining QualityIndex fields that previously came from Numbeo.

**Fields to populate:**
- `climateIndex` -- derive from Open-Meteo weather data (Task 1)
- `pollutionIndex` -- derive from WAQI air quality data (Task 2)
- `purchasingPowerIndex` -- derive from World Bank PPP data
- `costOfLivingIndex` -- derive from cost of living data (Task 8)
- `propertyPriceToIncomeRatio` -- derive from World Bank/Numbeo data or estimates
- `trafficCommuteTimeIndex` -- derive from TomTom Traffic Index (free data) or Google

**Climate Index calculation:**
```
climateIndex = weighted score based on:
  - Average annual temperature (ideal: 18-28C)
  - Sunshine hours per year
  - Rain days per year (fewer = better)
  - Humidity comfort range
  - Temperature variance (lower = more stable = better)
```

**Pollution level derivation:**
```
Based on annual average AQI:
  AQI 0-50: pollution = 'LOW' (good air)
  AQI 51-100: pollution = 'MIDDLE'
  AQI 101+: pollution = 'HIGH' (poor air)
```

**Purchasing Power from World Bank:**
```
# GDP per capita PPP
https://api.worldbank.org/v2/country/all/indicator/NY.GDP.PCAP.PP.CD?format=json&per_page=300
```
Normalize to index: `(countryPPP / maxPPP) * 100`

**Traffic/Commute from TomTom Traffic Index:**
- URL: https://www.tomtom.com/traffic-index/ranking/
- Format: Web (scrape or manual extraction)
- Coverage: 400+ cities worldwide
- Alternative: Use Google Maps Distance Matrix API (limited free tier)

**Implementation steps:**
1. Create script `scripts/compute-quality-indices.ts`
2. After Tasks 1, 2, and 8 are complete, compute derived indices
3. For each city, calculate all QualityIndex fields
4. Also derive the City-level enum fields: `climate`, `pollution`, `purchasingPower`, `costOfLiving`, `propertyPriceToIncome`, `trafficCommuteTime`
5. Upsert into `QualityIndex` model and update `City` enum fields

---

## PHASE 3: New Differentiating Data

### TASK 10: Visa Requirements from Passport Index Dataset

**Goal:** Add visa requirement data so users can see "Do I need a visa?" for each destination.

**Data Source:**
- GitHub: https://github.com/ilyankou/passport-index-dataset
- License: MIT
- Format: CSV (matrix format and tidy format available)
- Coverage: 199 countries, all passport-destination pairs
- Updated: Regularly maintained

**CSV structure (tidy format):**
```
Passport,Destination,Requirement
Afghanistan,Albania,visa required
Afghanistan,Algeria,visa on arrival
...
United States,Thailand,visa free
```

**Requirement values:** `visa free`, `visa on arrival`, `e-visa`, `visa required`, `no admission`, plus duration in days where applicable.

**Schema changes needed:**
```prisma
model VisaRequirement {
  id              Int     @id @default(autoincrement())
  passportCountry String  // ISO country code of passport holder
  destination     String  // ISO country code of destination
  requirement     String  // "visa_free", "visa_on_arrival", "e_visa", "visa_required", "no_admission"
  durationDays    Int?    // max stay in days (if visa free/on arrival)

  @@unique([passportCountry, destination])
  @@index([destination])
  @@index([passportCountry])
}
```

**Implementation steps:**
1. Add `VisaRequirement` model to Prisma schema
2. Create seed script `scripts/seed-visa-data.ts`
3. Download CSV from GitHub repo
4. Parse and normalize requirement values
5. Map country names to ISO country codes
6. Bulk insert into database
7. Create API endpoint `src/server/api/visa/[destination].get.ts` that accepts a `passport` query param
8. On city page, show visa status badge based on user's selected passport country
9. Add a passport country selector (stored in localStorage or user profile)
10. Schedule quarterly refresh

**UI integration:**
- City card: small visa badge (green = visa free, yellow = on arrival/e-visa, red = visa required)
- City detail page: full visa info section with duration and requirements
- Filter: "Visa free for [my passport]" toggle in FiltersDrawer

---

### TASK 11: Currency Exchange Rates via Frankfurter API

**Goal:** Let users see costs converted to their local currency in real-time.

**API Details:**
- Base URL: `https://api.frankfurter.dev/v1/`
- No auth required, no rate limits documented
- Source: European Central Bank
- Coverage: 30+ major currencies
- Updated: Daily on ECB working days
- License: Open source, fully free

**Key endpoints:**
```
# Latest rates from USD (your base currency)
https://api.frankfurter.dev/v1/latest?base=USD

# Specific currencies
https://api.frankfurter.dev/v1/latest?base=USD&symbols=EUR,GBP,PLN,THB,COP,MXN

# Historical rate
https://api.frankfurter.dev/v1/2024-01-15?base=USD
```

**For wider currency coverage (200+ currencies including THB, VND, COP):**
- Fallback: https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json
- No auth, CDN-served, CC0 license

**Implementation steps:**
1. Create a server utility `src/server/utils/exchange-rates.ts`
2. Fetch daily rates from Frankfurter (or fawazahmed0 for exotic currencies)
3. Cache rates in memory or KV store (refresh daily)
4. Create API endpoint `src/server/api/exchange-rates.get.ts`
5. On the frontend, add a currency selector (stored in localStorage)
6. Create composable `useExchangeRate()` that converts USD amounts to selected currency
7. Display converted amounts alongside USD on city cards and city detail pages
8. Show format: "$1,200/mo (~4,500 PLN)"

**Notes:**
- Frankfurter covers 30 currencies. For THB, VND, IDR etc. (common nomad destinations), use fawazahmed0 as primary
- ECB does not publish rates on weekends/holidays -- cache last known rate
- Consider showing "last updated" timestamp

---

### TASK 12: Country Metadata from REST Countries API

**Goal:** Enrich city data with timezone, local currency, languages, calling code, flag.

**API Details:**
- Base URL: `https://restcountries.com/v3.1/`
- No auth required
- No rate limits documented
- Coverage: 250 countries/territories
- Format: JSON

**Key endpoint:**
```
# Get all countries
https://restcountries.com/v3.1/all?fields=name,cca2,cca3,currencies,languages,timezones,idd,flag,flags,region,subregion,population,capital,latlng

# Get specific country
https://restcountries.com/v3.1/alpha/TH?fields=name,currencies,languages,timezones,idd,flag
```

**Returns per country:**
- `currencies` -- object with currency code, name, symbol (e.g., `{ "THB": { "name": "Thai baht", "symbol": "฿" } }`)
- `languages` -- object (e.g., `{ "tha": "Thai" }`)
- `timezones` -- array (e.g., `["UTC+07:00"]`)
- `idd` -- calling code (e.g., `{ "root": "+6", "suffixes": ["6"] }`)
- `flag` -- emoji flag
- `flags` -- SVG/PNG URLs
- `region`, `subregion`

**Schema changes needed:**
```prisma
// Add to City model or create CountryInfo model
model CountryInfo {
  countryCode     String   @id  // ISO 3166-1 alpha-2
  currencyCode    String        // "THB"
  currencyName    String        // "Thai baht"
  currencySymbol  String        // "฿"
  languages       String        // "Thai" (comma-separated)
  timezone        String        // "UTC+07:00"
  callingCode     String        // "+66"
  flagEmoji       String        // "🇹🇭"
  flagSvgUrl      String        // URL to SVG flag
}
```

**Implementation steps:**
1. Add `CountryInfo` model to Prisma schema
2. Create seed script `scripts/seed-country-info.ts`
3. Fetch all countries from REST Countries API
4. Parse and store relevant fields
5. Add relation from City to CountryInfo via `countryCode`
6. Expose in city detail API response
7. Display on city pages: flag, timezone, currency, language
8. Refresh annually (country data rarely changes)

---

### TASK 13: Coworking Space Count from OpenStreetMap

**Goal:** Add "number of coworking spaces" per city as a new data point.

**API Details:**
- Overpass API: `https://overpass-api.de/api/interpreter`
- No auth required
- Format: JSON
- Coverage: Global, crowd-sourced (best in Europe and SE Asia)
- Rate limits: Fair-use (no hard limits, but large queries may be throttled)

**Query to count coworking spaces within 15km of city center:**
```
[out:json][timeout:25];
(
  node["amenity"="coworking_space"](around:15000,{LAT},{LNG});
  way["amenity"="coworking_space"](around:15000,{LAT},{LNG});
  relation["amenity"="coworking_space"](around:15000,{LAT},{LNG});
);
out count;
```

**Additional amenity counts to fetch per city:**
```
amenity=cafe          -> cafeCount (potential work spots)
amenity=restaurant    -> restaurantCount
amenity=bar           -> barCount
amenity=nightclub     -> nightclubCount
amenity=hospital      -> hospitalCount
amenity=pharmacy      -> pharmacyCount
amenity=library       -> libraryCount
leisure=fitness_centre -> gymCount
shop=supermarket      -> supermarketCount
```

**Schema changes needed:**
```prisma
model CityAmenities {
  citySlug          String @id
  coworkingSpaces   Int    @default(0)
  cafes             Int    @default(0)
  restaurants       Int    @default(0)
  bars              Int    @default(0)
  nightclubs        Int    @default(0)
  hospitals         Int    @default(0)
  pharmacies        Int    @default(0)
  libraries         Int    @default(0)
  gyms              Int    @default(0)
  supermarkets      Int    @default(0)
  updatedAt         DateTime @updatedAt

  city City @relation(fields: [citySlug], references: [slug])
}
```

**Implementation steps:**
1. Add `CityAmenities` model to Prisma schema
2. Create script `scripts/sync-amenities.ts`
3. For each city, run Overpass queries for each amenity type
4. Use `out count` mode for efficiency (returns just the count, not full geometry)
5. Store counts in `CityAmenities`
6. Batch with delays to respect fair-use (e.g., 1 second between queries)
7. Create API inclusion in city detail endpoint
8. Display on city page: "42 coworking spaces", "180 cafes", "25 gyms"
9. Add "coworking spaces" as a filter/sort option
10. Refresh quarterly

**Derived scores:**
- `nightlifeScore` = (bars + nightclubs) per 100K population, normalized to 0-5
- `foodScene` = restaurants per 100K population, normalized to 0-5
- `nomadInfrastructure` = coworkingSpaces + (cafes * 0.3), normalized to 0-5

---

### TASK 14: English Proficiency from EF EPI

**Goal:** Add English proficiency level per country (and city where available).

**Data Source:**
- EF EPI 2025 Report: https://www.ef.com/wwen/epi/
- Also: https://worldpopulationreview.com/country-rankings/ef-english-proficiency-index-by-country (easier to scrape)
- Coverage: 113 countries + select cities
- Updated: Annually
- Format: PDF/web tables (no API)

**Proficiency bands:**
- Very High (score 600+)
- High (score 550-599)
- Moderate (score 500-549)
- Low (score 450-499)
- Very Low (score < 450)

**Schema changes needed:**
```prisma
// Add to CountryInfo or City model
// On CountryInfo:
  englishProficiency      String?   // "VERY_HIGH", "HIGH", "MODERATE", "LOW", "VERY_LOW"
  englishProficiencyScore Float?    // Raw EPI score (e.g., 623 for Netherlands)
```

**Implementation steps:**
1. Manually extract EPI data from the website/PDF into a CSV file `data/ef-epi-2025.csv`
2. Create seed script `scripts/seed-english-proficiency.ts`
3. Parse CSV, map country names to ISO codes
4. Update `CountryInfo` model with proficiency band and score
5. Display on city page: "English Proficiency: High" with a colored badge
6. Add as filter option: "English proficiency: High+" toggle
7. Refresh annually when new EPI report is released

---

### TASK 15: LGBTQ+ Friendliness from Equaldex

**Goal:** Add LGBTQ+ friendliness score per country.

**API Details:**
- URL: https://www.equaldex.com/equality-index-api
- API docs: Available on Stoplight
- Coverage: All countries worldwide
- Score: 0-100 Equality Index (composite of legal index + public opinion)
- License: Free for non-commercial use, attribution required
- Auth: Unknown (may need to contact for API key)

**Fallback source: Our World in Data**
- URL: https://ourworldindata.org/grapher/lgbt-rights-index
- Format: CSV download
- Coverage: Global, country-level
- License: CC BY

**Schema changes needed:**
```prisma
// Add to CountryInfo:
  lgbtqIndex       Int?     // 0-100 Equality Index
  lgbtqLevel       String?  // "VERY_FRIENDLY", "FRIENDLY", "MODERATE", "UNFRIENDLY", "DANGEROUS"
```

**Mapping:**
```
80-100: VERY_FRIENDLY (marriage equality, full protections)
60-79:  FRIENDLY (civil unions, anti-discrimination)
40-59:  MODERATE (some protections, mixed)
20-39:  UNFRIENDLY (no recognition, possible restrictions)
0-19:   DANGEROUS (criminalization)
```

**Implementation steps:**
1. Try Equaldex API first -- if accessible, use it
2. Fallback: download CSV from Our World in Data
3. Add fields to `CountryInfo` model
4. Create seed script `scripts/seed-lgbtq-index.ts`
5. Display on city page as a badge
6. Add as filter: "LGBTQ+ friendly" toggle (filters to FRIENDLY+)
7. Refresh annually

---

## PHASE 4: Community-Driven Data (Long-term Moat)

### TASK 16: User-Submitted Internet Speed Tests

**Goal:** Let logged-in users submit internet speed test results from their current city, building a crowdsourced speed database.

**How it works:**
1. User visits a city page or dashboard
2. Clicks "Test my speed" button
3. Frontend runs a speed test using a lightweight library (e.g., `speedtest.net` embed or custom WebRTC-based test)
4. Result is submitted with city slug, download/upload speed, latency
5. Stored in database with user ID and timestamp
6. City's internet speed becomes a weighted average of Ookla data + user submissions

**Schema changes needed:**
```prisma
model SpeedTest {
  id            Int      @id @default(autoincrement())
  userId        String
  citySlug      String
  downloadMbps  Float
  uploadMbps    Float
  latencyMs     Float?
  connectionType String? // "wifi", "mobile", "ethernet"
  location      String?  // "cafe", "coworking", "apartment", "hotel"
  createdAt     DateTime @default(now())

  user User @relation(fields: [userId], references: [id])
  city City @relation(fields: [citySlug], references: [slug])

  @@index([citySlug])
  @@index([userId])
}
```

**Implementation steps:**
1. Add `SpeedTest` model to Prisma schema
2. Create API endpoints:
   - `POST /api/speed-tests/submit.post.ts` (auth required)
   - `GET /api/speed-tests/[citySlug].get.ts` (public, returns aggregates)
3. Frontend: Add speed test button on city detail page
4. Use a lightweight JS speed test library or integrate with fast.com/speedtest.net widget
5. Show aggregate stats: "Average: 45 Mbps from 23 user tests"
6. Weight recent tests more heavily (exponential decay)
7. Show breakdown by location type (cafe vs coworking vs apartment)

---

### TASK 17: User City Reviews & Ratings

**Goal:** Let users review cities they've visited/lived in, building qualitative data.

**Schema changes needed:**
```prisma
model CityReview {
  id            Int      @id @default(autoincrement())
  userId        String
  citySlug      String
  overallRating Int      // 1-5 stars
  costRating    Int?     // 1-5
  safetyRating  Int?     // 1-5
  internetRating Int?    // 1-5
  weatherRating Int?     // 1-5
  foodRating    Int?     // 1-5
  nightlifeRating Int?   // 1-5
  friendlinessRating Int? // 1-5
  comment       String?  // max 2000 chars
  stayDuration  String?  // "1_week", "1_month", "3_months", "6_months", "1_year_plus"
  visitedAt     DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user User @relation(fields: [userId], references: [id])
  city City @relation(fields: [citySlug], references: [slug])

  @@unique([userId, citySlug])
  @@index([citySlug])
}
```

**Implementation steps:**
1. Add `CityReview` model to Prisma schema
2. Create API endpoints:
   - `POST /api/reviews/submit.post.ts` (auth required, one review per city per user)
   - `GET /api/reviews/[citySlug].get.ts` (public, returns reviews with pagination)
   - `GET /api/reviews/summary/[citySlug].get.ts` (public, returns average ratings)
3. Frontend: Add review form on city detail page (only for logged-in users)
4. Show aggregate ratings: "4.2/5 from 47 reviews"
5. Show individual reviews with user display name, duration of stay, and comment
6. Weight ratings by stay duration (longer stays = more weight)

---

### TASK 18: Crowdsourced Cost of Living Submissions

**Goal:** Build your own cost of living database through user price submissions.

**Schema changes needed:**
```prisma
model PriceSubmission {
  id          Int      @id @default(autoincrement())
  userId      String
  citySlug    String
  itemType    String   // "meal_cheap", "meal_mid", "cappuccino", "beer", "rent_1br_center",
                       // "rent_1br_outside", "utilities", "internet", "gym", "transport_monthly",
                       // "taxi_1km", "groceries_monthly"
  priceUsd    Float    // price in USD
  currency    String   // original currency code
  priceLocal  Float    // price in local currency
  note        String?  // optional context
  createdAt   DateTime @default(now())

  user User @relation(fields: [userId], references: [id])
  city City @relation(fields: [citySlug], references: [slug])

  @@index([citySlug, itemType])
  @@index([userId])
}
```

**Item types and descriptions:**
```
meal_cheap        - Meal at inexpensive restaurant
meal_mid          - Meal for 2, mid-range restaurant
cappuccino        - Cappuccino at a cafe
beer_domestic     - Domestic beer (0.5L, restaurant)
beer_import       - Imported beer (0.33L, restaurant)
rent_1br_center   - 1BR apartment, city center, per month
rent_1br_outside  - 1BR apartment, outside center, per month
utilities         - Basic utilities (electricity, heating, water, garbage) per month
internet          - Internet (60+ Mbps) per month
gym               - Gym monthly membership
transport_monthly - Monthly transit pass
taxi_1km          - Taxi 1km (normal tariff)
groceries_monthly - Estimated monthly groceries for 1 person
coworking_day     - Coworking day pass
coworking_monthly - Coworking monthly membership
```

**Implementation steps:**
1. Add `PriceSubmission` model to Prisma schema
2. Create API endpoints:
   - `POST /api/prices/submit.post.ts` (auth required)
   - `GET /api/prices/[citySlug].get.ts` (public, returns median prices)
3. Frontend: Add "Submit prices" form on city detail page
4. Use exchange rate data (Task 11) to convert local prices to USD
5. Compute median prices per item per city (discard outliers using IQR method)
6. Recalculate `costForNomadInUsd` when enough submissions exist (minimum 5 users)
7. Show data freshness: "Based on 23 submissions, last updated 2 weeks ago"
8. Gamification: show "Price Reporter" badge on user profile

---

## APPENDIX: Data Source Quick Reference

| Source | URL | Auth | Free Limits | Updates |
|--------|-----|------|-------------|---------|
| Open-Meteo Weather | archive-api.open-meteo.com | None | 10K/day | Daily |
| Open-Meteo Air Quality | air-quality-api.open-meteo.com | None | 10K/day | Daily |
| WAQI Air Quality | api.waqi.info | Free token | 1K/sec | Hourly |
| Unsplash | api.unsplash.com | API key | 5K/hr (prod) | - |
| Pexels | api.pexels.com | API key | 200/hr | - |
| Frankfurter FX | api.frankfurter.dev | None | Unlimited | Daily |
| fawazahmed0 FX | cdn.jsdelivr.net/npm/@fawazahmed0/currency-api | None | Unlimited | Daily |
| World Bank | api.worldbank.org | None | Unlimited | Annual |
| WHO GHO | ghoapi.azureedge.net | None | Unlimited | Annual |
| Wikidata | query.wikidata.org/sparql | None | 60s timeout | Live |
| GeoNames | api.geonames.org | Username | 10K/day | Live |
| REST Countries | restcountries.com | None | Unlimited | - |
| OSM Overpass | overpass-api.de | None | Fair use | Live |
| Teleport | api.teleport.org | None | Unlimited | Stale? |
| Passport Index | github.com/ilyankou/passport-index-dataset | None | CSV | Periodic |
| Equaldex | equaldex.com | Unknown | Unknown | Live |
| Ookla Open Data | s3://ookla-open-data/ | None | Bulk DL | Quarterly |
| Global Peace Index | kaggle.com | Account | CSV | Annual |
| Transparency Intl | github.com/datasets/corruption-perceptions-index | None | CSV | Annual |
| EF EPI | ef.com/wwen/epi | None | PDF | Annual |

---

## APPENDIX: New Prisma Models Summary

All new models to add across all tasks:

```prisma
model VisaRequirement {
  id              Int     @id @default(autoincrement())
  passportCountry String
  destination     String
  requirement     String
  durationDays    Int?
  @@unique([passportCountry, destination])
  @@index([destination])
  @@index([passportCountry])
}

model CountryInfo {
  countryCode            String   @id
  currencyCode           String
  currencyName           String
  currencySymbol         String
  languages              String
  timezone               String
  callingCode            String
  flagEmoji              String
  flagSvgUrl             String
  englishProficiency     String?
  englishProficiencyScore Float?
  lgbtqIndex             Int?
  lgbtqLevel             String?
  cities                 City[]
}

model CityAmenities {
  citySlug        String   @id
  coworkingSpaces Int      @default(0)
  cafes           Int      @default(0)
  restaurants     Int      @default(0)
  bars            Int      @default(0)
  nightclubs      Int      @default(0)
  hospitals       Int      @default(0)
  pharmacies      Int      @default(0)
  libraries       Int      @default(0)
  gyms            Int      @default(0)
  supermarkets    Int      @default(0)
  updatedAt       DateTime @updatedAt
  city            City     @relation(fields: [citySlug], references: [slug])
}

model SpeedTest {
  id             Int      @id @default(autoincrement())
  userId         String
  citySlug       String
  downloadMbps   Float
  uploadMbps     Float
  latencyMs      Float?
  connectionType String?
  location       String?
  createdAt      DateTime @default(now())
  user           User     @relation(fields: [userId], references: [id])
  city           City     @relation(fields: [citySlug], references: [slug])
  @@index([citySlug])
  @@index([userId])
}

model CityReview {
  id                 Int       @id @default(autoincrement())
  userId             String
  citySlug           String
  overallRating      Int
  costRating         Int?
  safetyRating       Int?
  internetRating     Int?
  weatherRating      Int?
  foodRating         Int?
  nightlifeRating    Int?
  friendlinessRating Int?
  comment            String?
  stayDuration       String?
  visitedAt          DateTime?
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
  user               User      @relation(fields: [userId], references: [id])
  city               City      @relation(fields: [citySlug], references: [slug])
  @@unique([userId, citySlug])
  @@index([citySlug])
}

model PriceSubmission {
  id         Int      @id @default(autoincrement())
  userId     String
  citySlug   String
  itemType   String
  priceUsd   Float
  currency   String
  priceLocal Float
  note       String?
  createdAt  DateTime @default(now())
  user       User     @relation(fields: [userId], references: [id])
  city       City     @relation(fields: [citySlug], references: [slug])
  @@index([citySlug, itemType])
  @@index([userId])
}
```
