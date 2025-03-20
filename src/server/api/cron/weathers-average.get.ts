export default defineEventHandler(async () => {
  const cities = await prisma.city.findMany({
    select: {
      slug: true,
      weathers: true,
    },
    where: {
      isWeather2024Collected: true,
    },
  })

  for (const city of cities) {
    // Group weather data by month (extract month from date)
    const monthlyTemps = Array(12).fill(0).map(() => ({
      weatherCodeMap: {} as any,
      apparentTemperatureMax: 0,
      rainSum: 0,
      windGusts10mMax: 0,
      snowfallSum: 0,
      windDirection10mDominant: 0,
      daylightDuration: 0,
      apparentTemperatureMin: 0,
      temperature2mMax: 0,
      temperature2mMin: 0,
      apparentTemperatureMean: 0,
      sunshineDuration: 0,
      precipitationHours: 0,
      shortwaveRadiationSum: 0,
      windSpeed10mMax: 0,
      precipitationSum: 0,
      temperature2mMean: 0,
      count: 0,
    })); // Initialize an array for each month
    city.weathers.forEach((weather) => {
      const month = new Date(weather.date).getMonth(); // Get the month (0-11)
      
      // Track frequency of weather codes
      const weatherCode = Number(weather.weatherCode);
      monthlyTemps[month].weatherCodeMap[weatherCode] = 
        (monthlyTemps[month].weatherCodeMap[weatherCode] || 0) + 1;
    
      // Existing logic
      monthlyTemps[month].apparentTemperatureMax += Number(weather.apparentTemperatureMax);
      monthlyTemps[month].rainSum += Number(weather.rainSum);
      monthlyTemps[month].windGusts10mMax += Number(weather.windGusts10mMax);
      monthlyTemps[month].snowfallSum += Number(weather.snowfallSum);
      monthlyTemps[month].windDirection10mDominant += Number(weather.windDirection10mDominant);
      monthlyTemps[month].daylightDuration += Number(weather.daylightDuration);
      monthlyTemps[month].apparentTemperatureMin += Number(weather.apparentTemperatureMin);
      monthlyTemps[month].temperature2mMax += Number(weather.temperature2mMax);
      monthlyTemps[month].temperature2mMin += Number(weather.temperature2mMin);
      monthlyTemps[month].apparentTemperatureMean += Number(weather.apparentTemperatureMean);
      monthlyTemps[month].sunshineDuration += Number(weather.sunshineDuration);
      monthlyTemps[month].precipitationHours += Number(weather.precipitationHours);
      monthlyTemps[month].shortwaveRadiationSum += Number(weather.shortwaveRadiationSum);
      monthlyTemps[month].windSpeed10mMax += Number(weather.windSpeed10mMax);
      monthlyTemps[month].precipitationSum += Number(weather.precipitationSum);
      monthlyTemps[month].temperature2mMean += Number(weather.temperature2mMean);
      monthlyTemps[month].count += 1; // Increment the count of records for that month
    });
    
    // Calculate the most common weather code
    const avgTemperatures = monthlyTemps.map((data, index) => {
      const mostCommonWeatherCode = data.weatherCodeMap 
        ? Object.entries(data.weatherCodeMap).reduce((a: any, b: any) => (a[1] > b[1] ? a : b))[0]
        : null;
    
      return {
        month: index + 1 < 10 ? `0${index + 1}` : `${index + 1}`,  // Month number (1-12)
        weatherCode: mostCommonWeatherCode,  // <- Most common weather code logic
        apparentTemperatureMax: data.count > 0 ? data.apparentTemperatureMax / data.count : null,
        rainSum: data.count > 0 ? data.rainSum / data.count : null,
        windGusts10mMax: data.count > 0 ? data.windGusts10mMax / data.count : null,
        snowfallSum: data.count > 0 ? data.snowfallSum / data.count : null,
        windDirection10mDominant: data.count > 0 ? data.windDirection10mDominant / data.count : null,
        daylightDuration: data.count > 0 ? data.daylightDuration / data.count : null,
        apparentTemperatureMin: data.count > 0 ? data.apparentTemperatureMin / data.count : null,
        temperature2mMax: data.count > 0 ? data.temperature2mMax / data.count : null,
        temperature2mMin: data.count > 0 ? data.temperature2mMin / data.count : null,
        apparentTemperatureMean: data.count > 0 ? data.apparentTemperatureMean / data.count : null,
        sunshineDuration: data.count > 0 ? data.sunshineDuration / data.count : null,
        precipitationHours: data.count > 0 ? data.precipitationHours / data.count : null,
        shortwaveRadiationSum: data.count > 0 ? data.shortwaveRadiationSum / data.count : null,
        windSpeed10mMax: data.count > 0 ? data.windSpeed10mMax / data.count : null,
        precipitationSum: data.count > 0 ? data.precipitationSum / data.count : null,
        temperature2mMean: data.count > 0 ? data.temperature2mMean / data.count : null,
      };
    });
    

    // Now you can do something with the avgTemperatures for each city
    // Example: Save the averages into a new table or update the existing city record
    await processInBatches(avgTemperatures, async option => {
      const data = {
        citySlug: city.slug,
        month: option.month,
        weatherIcon: getIconBasedOnWeatherCode(Number(option.weatherCode ?? -1)),
        weatherCode: Number(option.weatherCode ?? -1),
        apparentTemperatureMax: option.apparentTemperatureMax ?? 0,
        rainSum: option.rainSum ?? 0,
        windGusts10mMax: option.windGusts10mMax ?? 0,
        snowfallSum: option.snowfallSum ?? 0,
        windDirection10mDominant: option.windDirection10mDominant ?? 0,
        daylightDuration: option.daylightDuration ?? 0,
        apparentTemperatureMin: option.apparentTemperatureMin ?? 0,
        temperature2mMax: option.temperature2mMax ?? 0,
        temperature2mMin: option.temperature2mMin ?? 0,
        apparentTemperatureMean: option.apparentTemperatureMean ?? 0,
        sunshineDuration: option.sunshineDuration ?? 0,
        precipitationHours: option.precipitationHours ?? 0,
        shortwaveRadiationSum: option.shortwaveRadiationSum ?? 0,
        windSpeed10mMax: option.windSpeed10mMax ?? 0,
        precipitationSum: option.precipitationSum ?? 0,
        temperature2mMean: option.temperature2mMean ?? 0,
      }
      await prisma.weatherAverage.upsert({
        where: {
          citySlug_month: {
            citySlug: city.slug,
            month: option.month,
          },
        },
        create: data,
        update: data,
      })
    }, 20, false)
  }

  return 'Hello Nitro'
})
