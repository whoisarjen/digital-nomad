import { fetchWeatherApi } from 'openmeteo';

export default defineEventHandler(async () => {
  const cities = await prisma.city.findMany({
    where: {
      isWeather2024Collected: false,
    },
    select: {
      slug: true,
      latitude: true,
      longitude: true,
    },
  })

  for (const city of cities) {
    const params = {
      "latitude": city.latitude,
      "longitude": city.longitude,
      "start_date": "2024-01-01",
      "end_date": "2024-12-31",
      "daily": ["weather_code", "apparent_temperature_max", "rain_sum", "wind_gusts_10m_max", "snowfall_sum", "wind_direction_10m_dominant", "daylight_duration", "apparent_temperature_min", "temperature_2m_max", "temperature_2m_min", "apparent_temperature_mean", "sunshine_duration", "precipitation_hours", "shortwave_radiation_sum", "wind_speed_10m_max", "precipitation_sum", "temperature_2m_mean"]
    };
    const url = process.env.WEATHER_API_URL!;
    const responses = await fetchWeatherApi(url, params);
    
    // Helper function to form time ranges
    const range = (start: number, stop: number, step: number) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
    
    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];
    
    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    
    const daily = response.daily()!;
    
    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      daily: {
        date: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
          (t) => new Date((t + utcOffsetSeconds) * 1000)
        ),
        weatherCode: daily.variables(0)!.valuesArray()!,
        apparentTemperatureMax: daily.variables(1)!.valuesArray()!,
        rainSum: daily.variables(2)!.valuesArray()!,
        windGusts10mMax: daily.variables(3)!.valuesArray()!,
        snowfallSum: daily.variables(4)!.valuesArray()!,
        windDirection10mDominant: daily.variables(5)!.valuesArray()!,
        daylightDuration: daily.variables(6)!.valuesArray()!,
        apparentTemperatureMin: daily.variables(7)!.valuesArray()!,
        temperature2mMax: daily.variables(8)!.valuesArray()!,
        temperature2mMin: daily.variables(9)!.valuesArray()!,
        apparentTemperatureMean: daily.variables(10)!.valuesArray()!,
        sunshineDuration: daily.variables(11)!.valuesArray()!,
        precipitationHours: daily.variables(12)!.valuesArray()!,
        shortwaveRadiationSum: daily.variables(13)!.valuesArray()!,
        windSpeed10mMax: daily.variables(14)!.valuesArray()!,
        precipitationSum: daily.variables(15)!.valuesArray()!,
        temperature2mMean: daily.variables(16)!.valuesArray()!,
      },
    
    };
    
    const res = [] as any[]
    // `weatherData` now contains a simple structure with arrays for datetime and weather data
    for (let i = 0; i < weatherData.daily.date.length; i++) {
      const data = {
        date: weatherData.daily.date[i].toISOString(),
        weatherCode: weatherData.daily.weatherCode[i],
        apparentTemperatureMax: weatherData.daily.apparentTemperatureMax[i],
        rainSum: weatherData.daily.rainSum[i],
        windGusts10mMax: weatherData.daily.windGusts10mMax[i],
        snowfallSum: weatherData.daily.snowfallSum[i],
        windDirection10mDominant: weatherData.daily.windDirection10mDominant[i],
        daylightDuration: weatherData.daily.daylightDuration[i],
        apparentTemperatureMin: weatherData.daily.apparentTemperatureMin[i],
        temperature2mMax: weatherData.daily.temperature2mMax[i],
        temperature2mMin: weatherData.daily.temperature2mMin[i],
        apparentTemperatureMean: weatherData.daily.apparentTemperatureMean[i],
        sunshineDuration: weatherData.daily.sunshineDuration[i],
        precipitationHours: weatherData.daily.precipitationHours[i],
        shortwaveRadiationSum: weatherData.daily.shortwaveRadiationSum[i],
        windSpeed10mMax: weatherData.daily.windSpeed10mMax[i],
        precipitationSum: weatherData.daily.precipitationSum[i],
        temperature2mMean: weatherData.daily.temperature2mMean[i],
      };

      res.push(data)
    }

    await processInBatches(res, async option => {
      await prisma.weather.upsert({
        where: {
          citySlug_date: {
            date: option.date,
            citySlug: city.slug,
          },
        },
        create: {
          ...option,
          city: {
            connect: {
              slug: city.slug,
            }
          }
        },
        update: option,
      })
    }, res.length, false)

    await prisma.city.update({
      where: {
        slug: city.slug,
      },
      data: {
        isWeather2024Collected: true,
      },
    })
  }

  return 'Done'
})
