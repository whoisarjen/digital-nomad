import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useSchengenCalculator } from '~/composables/useSchengenCalculator'

describe('useSchengenCalculator', () => {
  const makeEntries = (pairs: Array<[string, string]>) =>
    ref(pairs.map(([from, to]) => ({ from, to })))

  it('returns 90 days remaining when no entries', () => {
    const entries = ref([])
    const { daysUsed, daysRemaining, isOverLimit } = useSchengenCalculator(entries)

    expect(daysUsed.value).toBe(0)
    expect(daysRemaining.value).toBe(90)
    expect(isOverLimit.value).toBe(false)
  })

  it('counts days inclusively (entry + exit day both count)', () => {
    // Jan 10 to Jan 12 = 3 days (10th, 11th, 12th)
    const entries = makeEntries([['2026-01-10', '2026-01-12']])
    const checkDate = ref(new Date(Date.UTC(2026, 5, 1))) // well within 180-day window

    const { daysUsed, daysRemaining } = useSchengenCalculator(entries, checkDate)

    expect(daysUsed.value).toBe(3)
    expect(daysRemaining.value).toBe(87)
  })

  it('sums multiple entry/exit pairs', () => {
    const entries = makeEntries([
      ['2026-01-10', '2026-01-12'], // 3 days
      ['2026-02-01', '2026-02-05'], // 5 days
    ])
    const checkDate = ref(new Date(Date.UTC(2026, 5, 1)))

    const { daysUsed } = useSchengenCalculator(entries, checkDate)

    expect(daysUsed.value).toBe(8)
  })

  it('clips entries to the 180-day rolling window', () => {
    // Entry that started 200 days before check date — only last 180 days count
    // Check date: July 1 2026 → window start: Jan 3 2026 (D-179 to D = 180 days)
    // Entry: Dec 1 2025 to Jan 10 2026 → only Jan 3-10 count = 8 days
    const entries = makeEntries([['2025-12-01', '2026-01-10']])
    const checkDate = ref(new Date(Date.UTC(2026, 6, 1))) // July 1

    const { daysUsed } = useSchengenCalculator(entries, checkDate)

    expect(daysUsed.value).toBe(8)
  })

  it('excludes entries entirely outside the 180-day window', () => {
    // Entry over a year ago — should not count at all
    const entries = makeEntries([['2024-01-01', '2024-01-30']])
    const checkDate = ref(new Date(Date.UTC(2026, 5, 1)))

    const { daysUsed } = useSchengenCalculator(entries, checkDate)

    expect(daysUsed.value).toBe(0)
  })

  it('detects over-limit when daysUsed exceeds 90', () => {
    // 91 days in one stretch
    const entries = makeEntries([['2026-01-01', '2026-04-01']]) // 91 days
    const checkDate = ref(new Date(Date.UTC(2026, 5, 1)))

    const { isOverLimit, daysUsed } = useSchengenCalculator(entries, checkDate)

    expect(daysUsed.value).toBe(91)
    expect(isOverLimit.value).toBe(true)
  })

  it('clips entries that extend past the check date', () => {
    // Entry from Jan 1 to Dec 31, but check date is Jan 10 → only 10 days count
    const entries = makeEntries([['2026-01-01', '2026-12-31']])
    const checkDate = ref(new Date(Date.UTC(2026, 0, 10))) // Jan 10

    const { daysUsed } = useSchengenCalculator(entries, checkDate)

    expect(daysUsed.value).toBe(10)
  })

  it('computes nextSafeEntry when at or over limit', () => {
    // 90 days: Jan 1 to Mar 31 2026 = 90 days
    const entries = makeEntries([['2026-01-01', '2026-03-31']])
    const checkDate = ref(new Date(Date.UTC(2026, 3, 1))) // April 1

    const { nextSafeEntry, daysUsed } = useSchengenCalculator(entries, checkDate)

    expect(daysUsed.value).toBe(90)
    // Oldest day (Jan 1) falls off the window on July 1 (180 days later)
    // So the next safe date should be when enough days have fallen off
    expect(nextSafeEntry.value).not.toBeNull()
    expect(nextSafeEntry.value instanceof Date).toBe(true)
  })

  it('returns null nextSafeEntry when under limit', () => {
    const entries = makeEntries([['2026-01-01', '2026-01-10']])
    const checkDate = ref(new Date(Date.UTC(2026, 5, 1)))

    const { nextSafeEntry } = useSchengenCalculator(entries, checkDate)

    expect(nextSafeEntry.value).toBeNull()
  })

  it('ignores entries with invalid dates (from > to)', () => {
    const entries = makeEntries([['2026-03-15', '2026-03-10']]) // backwards
    const checkDate = ref(new Date(Date.UTC(2026, 5, 1)))

    const { daysUsed } = useSchengenCalculator(entries, checkDate)

    expect(daysUsed.value).toBe(0)
  })

  it('handles single-day entries (from === to)', () => {
    const entries = makeEntries([['2026-03-15', '2026-03-15']])
    const checkDate = ref(new Date(Date.UTC(2026, 5, 1)))

    const { daysUsed } = useSchengenCalculator(entries, checkDate)

    expect(daysUsed.value).toBe(1)
  })
})
