import _ from "lodash";

const median = (numbers: number[]): number => {
  // Sort the array in ascending order
  const sortedNumbers = [...numbers].sort((a, b) => a - b);

  const middleIndex = Math.floor(sortedNumbers.length / 2);

  // If the array length is odd, return the middle element
  if (sortedNumbers.length % 2 !== 0) {
    return sortedNumbers[middleIndex];
  }

  // If the array length is even, return the average of the two middle elements
  return (sortedNumbers[middleIndex - 1] + sortedNumbers[middleIndex]) / 2;
}

export default defineEventHandler(async () => {
  const cities = (await Promise.all(_.range(5).map(index => 
    prisma.city.findMany({
      select: {
        slug: true,
        weathers: {
          select: {
            apparentTemperatureMax: true,
            rainSum: true,
            windGusts10mMax: true,
            snowfallSum: true,
            windDirection10mDominant: true,
            daylightDuration: true,
            apparentTemperatureMin: true,
            temperature2mMax: true,
            temperature2mMin: true,
            apparentTemperatureMean: true,
            sunshineDuration: true,
            precipitationHours: true,
            shortwaveRadiationSum: true,
            windSpeed10mMax: true,
            precipitationSum: true,
            temperature2mMean: true,
            date: true,
            weatherCode: true,
          }
        },
      },
      where: {
        isWeather2024Collected: true,
      },
      take: 400,
      skip: index * 400,
    })))).flatMap(option => option)

  await processInBatches(cities, async city => {
    // Group weather data by month (extract month from date)
    const monthlyTemps = Array(12).fill(0).map(() => ({
      weatherCodeMap: {} as any,
      apparentTemperatureMax: [] as number[],
      rainSum: [] as number[],
      windGusts10mMax: [] as number[],
      snowfallSum: [] as number[],
      windDirection10mDominant: [] as number[],
      daylightDuration: [] as number[],
      apparentTemperatureMin: [] as number[],
      temperature2mMax: [] as number[],
      temperature2mMin: [] as number[],
      apparentTemperatureMean: [] as number[],
      sunshineDuration: [] as number[],
      precipitationHours: [] as number[],
      shortwaveRadiationSum: [] as number[],
      windSpeed10mMax: [] as number[],
      precipitationSum: [] as number[],
      temperature2mMean: [] as number[],
    })); // Initialize an array for each month
    city.weathers.forEach((weather) => {
      const month = new Date(weather.date).getMonth(); // Get the month (0-11)
      
      // Track frequency of weather codes
      const weatherCode = Number(weather.weatherCode);
      monthlyTemps[month].weatherCodeMap[weatherCode] = 
        (monthlyTemps[month].weatherCodeMap[weatherCode] || 0) + 1;
    
      // Existing logic
      !_.isNil(weather.apparentTemperatureMax) && monthlyTemps[month].apparentTemperatureMax.push(Number(weather.apparentTemperatureMax));
      !_.isNil(weather.rainSum) && monthlyTemps[month].rainSum.push(Number(weather.rainSum));
      !_.isNil(weather.windGusts10mMax) && monthlyTemps[month].windGusts10mMax.push(Number(weather.windGusts10mMax));
      !_.isNil(weather.snowfallSum) && monthlyTemps[month].snowfallSum.push(Number(weather.snowfallSum));
      !_.isNil(weather.windDirection10mDominant) && monthlyTemps[month].windDirection10mDominant.push(Number(weather.windDirection10mDominant));
      !_.isNil(weather.daylightDuration) && monthlyTemps[month].daylightDuration.push(Number(weather.daylightDuration));
      !_.isNil(weather.apparentTemperatureMin) && monthlyTemps[month].apparentTemperatureMin.push(Number(weather.apparentTemperatureMin));
      !_.isNil(weather.temperature2mMax) && monthlyTemps[month].temperature2mMax.push(Number(weather.temperature2mMax));
      !_.isNil(weather.temperature2mMin) && monthlyTemps[month].temperature2mMin.push(Number(weather.temperature2mMin));
      !_.isNil(weather.apparentTemperatureMean) && monthlyTemps[month].apparentTemperatureMean.push(Number(weather.apparentTemperatureMean));
      !_.isNil(weather.sunshineDuration) && monthlyTemps[month].sunshineDuration.push(Number(weather.sunshineDuration));
      !_.isNil(weather.precipitationHours) && monthlyTemps[month].precipitationHours.push(Number(weather.precipitationHours));
      !_.isNil(weather.shortwaveRadiationSum) && monthlyTemps[month].shortwaveRadiationSum.push(Number(weather.shortwaveRadiationSum));
      !_.isNil(weather.windSpeed10mMax) && monthlyTemps[month].windSpeed10mMax.push(Number(weather.windSpeed10mMax));
      !_.isNil(weather.precipitationSum) && monthlyTemps[month].precipitationSum.push(Number(weather.precipitationSum));
      !_.isNil(weather.temperature2mMean) && monthlyTemps[month].temperature2mMean.push(Number(weather.temperature2mMean));
    });
    
    // Calculate the most common weather code
    const medianTemperatures = monthlyTemps.map((data, index) => {
      const mostCommonWeatherCode = data.weatherCodeMap 
        ? Object.entries(data.weatherCodeMap).reduce((a: any, b: any) => (a[1] > b[1] ? a : b))[0]
        : null;
    
      return {
        month: index + 1 < 10 ? `0${index + 1}` : `${index + 1}`,  // Month number (1-12)
        weatherCode: mostCommonWeatherCode,  // <- Most common weather code logic
        apparentTemperatureMax: median(data.apparentTemperatureMax),
        rainSum: median(data.rainSum),
        windGusts10mMax: median(data.windGusts10mMax),
        snowfallSum: median(data.snowfallSum),
        windDirection10mDominant: median(data.windDirection10mDominant),
        daylightDuration: median(data.daylightDuration),
        apparentTemperatureMin: median(data.apparentTemperatureMin),
        temperature2mMax: median(data.temperature2mMax),
        temperature2mMin: median(data.temperature2mMin),
        apparentTemperatureMean: median(data.apparentTemperatureMean),
        sunshineDuration: median(data.sunshineDuration),
        precipitationHours: median(data.precipitationHours),
        shortwaveRadiationSum: median(data.shortwaveRadiationSum),
        windSpeed10mMax: median(data.windSpeed10mMax),
        precipitationSum: median(data.precipitationSum),
        temperature2mMean: median(data.temperature2mMean),
      };
    });

    await processInBatches(medianTemperatures, async option => {
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
      await prisma.monthSummary.upsert({
        where: {
          citySlug_month: {
            citySlug: city.slug,
            month: option.month,
          },
        },
        create: data,
        update: data,
      })
    }, medianTemperatures.length, false)
  })

  return 'Hello Nitro'
})
