# IDEA-27: Affiliate Integration
**Status:** NOT_STARTED
**Priority:** 27/27
**Complexity:** S

## What's Already Implemented
Nothing. No affiliate links anywhere in the codebase.

## Revised Analysis
**Do not build until traffic milestone: 1,000+ daily visitors.** Building affiliate infrastructure before that is premature — the programs won't accept you, and it clutters the codebase for no revenue. This is a gate-on-traffic feature.

**Revenue potential once at traffic milestone:**
- SafetyWing: ~$50/referral. At 10 signups/month = $500/month
- Booking.com: 4–8% commission on bookings
- Wise: per-card referral commission

**Implementation is deliberately simple:** No affiliate tracking infrastructure needed in the app. Affiliate programs provide UTM links or redirect links — just place them statically in a component. No DB changes, no analytics hooks in the app.

**City-specific Booking.com links:** Booking.com's affiliate URL accepts destination as a query param: `https://www.booking.com/searchresults.html?aid=[YOUR_AID]&ss=[city name]`. Generate dynamically from `city.name`.

**Non-intrusive placement:** Small section at the bottom of city pages, clearly labeled. No popups, no banners, no interstitials. Trust is more valuable than aggressive monetization.

## Implementation Plan

### Database Changes
None.

### API Endpoints
None. Affiliate links are static or dynamically constructed client-side from city name.

### Frontend Components/Pages
**New file**: `apps/nomad/src/components/AffiliateLinks.vue`
- Props: `cityName: string`, `citySlug: string`
- Renders 2-3 contextual affiliate links:
  - "Book accommodation in {city}" → Booking.com (city-specific URL)
  - "Get travel insurance" → SafetyWing (static link)
  - "Open a travel bank account" → Wise (static link)
- Clearly labeled: "Our partners" or "Affiliate links — we earn a small commission at no cost to you"
- Minimal styling: small card at bottom of city page, not a banner

**Modify** `apps/nomad/src/pages/cities/[slug].vue`
- Add `<AffiliateLinks :city-name="data.name" :city-slug="slug" />` at the very bottom of city content, before footer

### i18n Changes
Add to all locale files:
```json
"affiliate": {
  "title": "Useful Links",
  "disclaimer": "We may earn a commission from these links at no cost to you.",
  "bookAccommodation": "Book accommodation in {city}",
  "travelInsurance": "Get travel insurance (SafetyWing)",
  "bankAccount": "Open a travel bank account (Wise)"
}
```

## Dependencies
None technical. Gate on traffic milestone (1,000+ daily visitors).

## Notes
- Apply for Booking.com affiliate program at affiliates.booking.com (requires existing traffic)
- Apply for SafetyWing affiliate at safetywing.com/nomad-health (lower traffic bar)
- Apply for Wise affiliate at wise.com/partners
- Keep it subtle — the trust built by ad-free UX is worth more than aggressive affiliate placement at this stage.
- Add a `/affiliate-disclosure` page for legal compliance (one-time, static content).
