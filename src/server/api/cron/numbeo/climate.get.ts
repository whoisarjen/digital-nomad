import axios from 'axios';
import * as cheerio from 'cheerio';

export default defineEventHandler(async () => {
  const options = await prisma.numbeo.findMany({
    select: {
      slug: true,
      citySlug: true,
      climate: true,
    },
  })

  for (const { citySlug, slug } of options.filter(({ climate }) => !climate)) {
    const { data } = await axios.get(`REDACTED_CLIMATE_URL/${slug}`);

    const $ = cheerio.load(data);
    const firstTable = $('table').eq(2);

    const climate = [] as any[]
    firstTable.find('tbody tr').each((i, element) => {
      const columns = $(element).find('td');

      if ($(columns[0]).text().trim() !== 'Month') {
        climate.push({
          month: $(columns[0]).text().trim(),
          climateScore: $(columns[1]).text().trim(),
          weatherConditionOutline: $(columns[2]).find('span').text().trim().split('\n').filter(option => option),
        })
      }
    })

    await prisma.numbeo.update({
      where: {
        citySlug,
      },
      data: {
        climate,
      }
    })
  }

  return 'Done'
})
