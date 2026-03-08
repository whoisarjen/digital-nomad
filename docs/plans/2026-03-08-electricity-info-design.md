# Electricity Info on City Pages — Design

**Date:** 2026-03-08
**Status:** Approved

## Problem

City pages show cost, internet, safety, weather — but nothing about practical travel logistics. The most universally useful piece of pre-travel info is electricity: plug type and voltage. A nomad needs to know this before packing.

## Scope

Plug type, voltage, and frequency per country, displayed inside the existing Internet & Infrastructure card on city pages. Includes a computed travel tip sentence explaining what the data means practically.

## Data

Source: `packages/db/data/electricity.json` — 163 countries keyed by ISO 2-letter code, collected from worldstandards.eu. Already committed.

## Schema

Add 3 nullable fields to the existing `Country` model:

```prisma
plugTypes  String?   // "C,F" — comma-separated letters
voltage    Int?      // e.g. 230
frequency  Int?      // e.g. 50
```

Populated via a one-time seed script that reads the JSON and updates Country rows by matching `country.code` to JSON keys.

## API

Extend the existing city detail endpoint (`/api/cities/[slug]`) to select and return `plugTypes`, `voltage`, `frequency` from the Country relation. No new endpoint needed.

## UI

### Placement
Inside the existing **Internet & Infrastructure** card, appended after the current internet speed rows.

### New rows
- **Plug type** — each letter rendered as a small badge (e.g. `C` `F`)
- **Voltage** — e.g. `230V`; amber color for ≤127V (Americas/Japan), gray for ≥220V
- **Frequency** — e.g. `50 Hz` plain text

### Travel tip line
Separated by a thin divider at the bottom of the card:

> ⚡ "Bring a Type C/F adapter. Most modern electronics handle 230V automatically."

**Tip logic (computed utility function):**

Plug family mapping:
- `A`, `B` only → "North American adapter"
- `G` only → "UK-style adapter"
- `I` only → "Australian adapter"
- `C`, `E`, `F` (any combo) → "Type C/F adapter"
- Mixed/other → "Type [X] adapter" (list the types)

Voltage note:
- ≥ 220V → "Most modern electronics handle [X]V automatically."
- < 200V → "Check your devices support [X]V — some may need a converter."

## Testing

- Unit tests for the tip-generation utility (pure function, input/output)
- Server route test: city endpoint returns `plugTypes`, `voltage`, `frequency`
- Component test: rows render correctly, tip line appears

## What's not in scope

- SIM cards, taxi apps, tipping culture (deferred — no free data source)
- Personalized tips based on user's home country
- Country pages (IDEA-09) — electricity will display there too once that page exists
