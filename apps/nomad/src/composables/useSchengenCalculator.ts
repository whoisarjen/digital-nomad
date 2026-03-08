import { computed, type Ref } from 'vue'

export interface SchengenEntry {
  from: string
  to: string
}

const MS_PER_DAY = 86_400_000

function toUTCMidnight(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(year!, month! - 1, day))
}

function daysBetweenInclusive(start: Date, end: Date): number {
  return Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY) + 1
}

export function useSchengenCalculator(
  entries: Ref<SchengenEntry[]>,
  checkDate?: Ref<Date>,
) {
  const check = computed(() => checkDate?.value ?? new Date())

  const windowStart = computed(() => {
    const d = new Date(check.value)
    d.setUTCDate(d.getUTCDate() - 179) // 180-day window inclusive of check date
    return d
  })

  const daysUsed = computed(() => {
    let total = 0

    for (const entry of entries.value) {
      const from = toUTCMidnight(entry.from)
      const to = toUTCMidnight(entry.to)

      if (from > to) continue // invalid entry

      const effectiveFrom = from < windowStart.value ? windowStart.value : from
      const effectiveTo = to > check.value ? check.value : to

      if (effectiveFrom > effectiveTo) continue // entirely outside window

      total += daysBetweenInclusive(effectiveFrom, effectiveTo)
    }

    return total
  })

  const daysRemaining = computed(() => Math.max(0, 90 - daysUsed.value))

  const isOverLimit = computed(() => daysUsed.value > 90)

  const nextSafeEntry = computed<Date | null>(() => {
    if (daysUsed.value < 90) return null

    // Find the earliest date when enough days fall off the window to get back under 90
    // Sort all entry days within the window chronologically
    const daysInWindow: Date[] = []

    for (const entry of entries.value) {
      const from = toUTCMidnight(entry.from)
      const to = toUTCMidnight(entry.to)
      if (from > to) continue

      const effectiveFrom = from < windowStart.value ? windowStart.value : from
      const effectiveTo = to > check.value ? check.value : to
      if (effectiveFrom > effectiveTo) continue

      // Collect each day
      const cursor = new Date(effectiveFrom)
      while (cursor <= effectiveTo) {
        daysInWindow.push(new Date(cursor))
        cursor.setUTCDate(cursor.getUTCDate() + 1)
      }
    }

    daysInWindow.sort((a, b) => a.getTime() - b.getTime())

    // We need daysUsed - 89 days to fall off (so we have exactly 89 used + 1 new entry day = 90)
    const daysToShed = daysUsed.value - 89
    if (daysToShed <= 0 || daysToShed > daysInWindow.length) return null

    // The (daysToShed)th oldest day falls off when the check date reaches that day + 180
    const pivotDay = daysInWindow[daysToShed - 1]!
    const safeDate = new Date(pivotDay)
    safeDate.setUTCDate(safeDate.getUTCDate() + 180)

    return safeDate
  })

  return {
    daysUsed,
    daysRemaining,
    isOverLimit,
    nextSafeEntry,
  }
}
