export default defineEventHandler(async () => {
  const cities = await prisma.city.findMany({
    select: {
      slug: true,
      weathers: {
        select: {
          date: true,
          temperature2mMax: true,
        }
      },
    },
    where: {
      isWeather2024Collected: true,
    },
  })

  await processInBatches(cities, async city => {
    // Group weather data by month (extract month from date)
    const monthlyTemps = Array(12).fill(0).map(() => ({ sum: 0, count: 0 })); // Initialize an array for each month

    city.weathers.forEach((weather) => {
      const month = new Date(weather.date).getMonth(); // Get the month (0-11)
      monthlyTemps[month].sum += weather.temperature2mMax.toNumber();  // Add the temperature to the corresponding month
      monthlyTemps[month].count += 1;                    // Increment the count of records for that month
    });

    // Calculate the average for each month
    const avgTemperatures = monthlyTemps.map((data, index) => ({
      month: index + 1 < 10 ? `0${index + 1}` : `${index + 1}`,  // Month number (1-12)
      averageTemperatureC: data.count > 0 ? data.sum / data.count : null, // Avoid division by zero
    }));

    // Now you can do something with the avgTemperatures for each city
    // Example: Save the averages into a new table or update the existing city record
    await processInBatches(avgTemperatures, async option => {
      await prisma.weatherAverage.upsert({
        where: {
          citySlug_month: {
            citySlug: city.slug,
            month: option.month,
          },
        },
        create: {
          citySlug: city.slug,
          month: option.month,
          avgTemperatureC: option.averageTemperatureC ?? 0,
        },
        update: {
          citySlug: city.slug,
          month: option.month,
          avgTemperatureC: option.averageTemperatureC ?? 0,
        },
      })
    }, 20, false)
  })

  return 'Hello Nitro'
})
