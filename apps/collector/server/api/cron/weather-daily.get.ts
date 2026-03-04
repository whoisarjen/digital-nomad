import { fetchWeatherApi } from 'openmeteo'

const DAILY_FIELDS = [
  'weather_code',
  'apparent_temperature_max',
  'rain_sum',
  'wind_gusts_10m_max',
  'snowfall_sum',
  'wind_direction_10m_dominant',
  'daylight_duration',
  'apparent_temperature_min',
  'temperature_2m_max',
  'temperature_2m_min',
  'apparent_temperature_mean',
  'sunshine_duration',
  'precipitation_hours',
  'shortwave_radiation_sum',
  'wind_speed_10m_max',
  'precipitation_sum',
  'temperature_2m_mean',
] as const

const WEATHER_API_URL = 'https://archive-api.open-meteo.com/v1/archive'
// Archive API availability varies by region — 7 days ago is reliably settled globally.
const TARGET_OFFSET_DAYS = 7
// Max cities per Open-Meteo bulk call (URL length safety)
const CHUNK_SIZE = 100

// All Decimal fields in the schema are nullable — coerce NaN to null instead of crashing.
const toDecimal = (v: number) => (Number.isNaN(v) ? null : v)

export default defineEventHandler(async () => {
  const startedAt = Date.now()
  const targetDate = new Date()
  targetDate.setUTCDate(targetDate.getUTCDate() - TARGET_OFFSET_DAYS)
  const dateStr = targetDate.toISOString().slice(0, 10)

  const cities = await prisma.city.findMany({
    select: {
      slug: true,
      latitude: true,
      longitude: true,
    },
  })

  let totalUpserted = 0
  let failedRecords = 0
  let failedChunks = 0

  for (let i = 0; i < cities.length; i += CHUNK_SIZE) {
    const chunk = cities.slice(i, i + CHUNK_SIZE)

    let responses: Awaited<ReturnType<typeof fetchWeatherApi>>
    try {
      responses = await fetchWeatherApi(WEATHER_API_URL, {
        latitude: chunk.map(c => Number(c.latitude)),
        longitude: chunk.map(c => Number(c.longitude)),
        start_date: dateStr,
        end_date: dateStr,
        daily: DAILY_FIELDS,
      })
    } catch (err) {
      console.error(`weather-daily: chunk ${i}–${i + CHUNK_SIZE - 1} API call failed:`, err)
      failedChunks++
      continue
    }

    const payloads = responses.map((response, idx) => {
      const city = chunk[idx]!
      const daily = response.daily()!
      const utcOffsetSeconds = response.utcOffsetSeconds()
      const date = new Date((Number(daily.time()) + utcOffsetSeconds) * 1000)

      return {
        citySlug: city.slug,
        date,
        weatherCode:              toDecimal(daily.variables(0)!.valuesArray()![0]!),
        apparentTemperatureMax:   toDecimal(daily.variables(1)!.valuesArray()![0]!),
        rainSum:                  toDecimal(daily.variables(2)!.valuesArray()![0]!),
        windGusts10mMax:          toDecimal(daily.variables(3)!.valuesArray()![0]!),
        snowfallSum:              toDecimal(daily.variables(4)!.valuesArray()![0]!),
        windDirection10mDominant: toDecimal(daily.variables(5)!.valuesArray()![0]!),
        daylightDuration:         toDecimal(daily.variables(6)!.valuesArray()![0]!),
        apparentTemperatureMin:   toDecimal(daily.variables(7)!.valuesArray()![0]!),
        temperature2mMax:         toDecimal(daily.variables(8)!.valuesArray()![0]!),
        temperature2mMin:         toDecimal(daily.variables(9)!.valuesArray()![0]!),
        apparentTemperatureMean:  toDecimal(daily.variables(10)!.valuesArray()![0]!),
        sunshineDuration:         toDecimal(daily.variables(11)!.valuesArray()![0]!),
        precipitationHours:       toDecimal(daily.variables(12)!.valuesArray()![0]!),
        shortwaveRadiationSum:    toDecimal(daily.variables(13)!.valuesArray()![0]!),
        windSpeed10mMax:          toDecimal(daily.variables(14)!.valuesArray()![0]!),
        precipitationSum:         toDecimal(daily.variables(15)!.valuesArray()![0]!),
        temperature2mMean:        toDecimal(daily.variables(16)!.valuesArray()![0]!),
      }
    })

    await processInBatches(payloads, async ({ citySlug, date, ...data }) => {
      try {
        await prisma.weather.upsert({
          where: { citySlug_date: { citySlug, date } },
          create: { citySlug, date, ...data },
          update: data,
        })
      } catch (err) {
        console.error(`weather-daily: upsert failed for ${citySlug}:`, err)
        failedRecords++
      }
    }, 50, false)

    totalUpserted += payloads.length
  }

  return { collected: totalUpserted, failed: failedRecords, failedChunks, date: dateStr, durationMs: Date.now() - startedAt }
})
