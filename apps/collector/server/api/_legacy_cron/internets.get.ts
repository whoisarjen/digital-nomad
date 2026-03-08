import * as cheerio from 'cheerio';

export default defineEventHandler(async () => {
  const html = await $fetch<any>(process.env.INTERNET_INDEX_URL!);
  const $ = cheerio.load(html);

  const data = [] as { ranking: number; country: string; speed: number }[];

  $('#column-fixedMedian tr.data-result.results').each((index, element) => {
    const ranking = $(element).find('td.rank.actual-rank').text().trim();
    const countryName = $(element).find('td.country').text().trim();
    const speed = $(element).find('td.speed').text().trim();

    if (ranking && countryName && speed) {
      data.push({
        ranking: parseInt(ranking, 10),
        country: countryName,
        speed: parseInt(speed),
      });
    }
  });

  const medianSpeedCity = data.filter(({ country }) => country.includes(','))
  const medianSpeedCountry = data.filter(({ country }) => !country.includes(','))

  // Update country-level internet speed on the Country table
  await processInBatches(medianSpeedCountry, async country => {
    await prisma.country.updateMany({
      where: {
        name: {
          contains: country.country,
          mode: 'insensitive',
        }
      },
      data: {
        internetSpeed: country.speed,
        internetSpeedRanking: country.ranking,
      },
    })
  })

  // Update city-level internet speed on the City table
  await processInBatches(medianSpeedCity, async city => {
    await prisma.city.updateMany({
      where: {
        name: {
          contains: city.country.split(',')[0]!.toLowerCase(),
          mode: 'insensitive',
        }
      },
      data: {
        internetSpeedCity: city.speed,
        internetSpeedCityRanking: city.ranking,
      },
    })
  })

  return {
    medianSpeedCity,
    medianSpeedCountry,
  }
})
