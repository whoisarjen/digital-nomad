import axios from 'axios';
import * as cheerio from 'cheerio';

type IndexName =
  | 'Purchasing Power Index'
  | 'Safety Index'
  | 'Health Care Index'
  | 'Climate Index'
  | 'Cost of Living Index'
  | 'Property Price to Income Ratio'
  | 'Traffic Commute Time Index'
  | 'Pollution Index'
  | 'Quality of Life Index';

interface IndexData {
  value: string;
  status: 'Low' | 'Moderate' | 'High' | 'Very Low' | 'Very High';
}

type Indices = {
  [key in IndexName]: IndexData;
}

export default defineEventHandler(async () => {
  const records = await prisma.qualityIndex.findMany({
    where: {
      isNumberData: true,
    },
  })
  const recordsToSeed = records.filter(option => !option.purchasingPowerIndex && !option.safetyIndex && !option.climateIndex && !option.pollutionIndex && !option.healthCareIndex)

  for (const { slug, citySlug } of recordsToSeed) {
    if (slug) {
      const url = `${process.env.QOL_DATA_URL!}/${slug}`;

      try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const indices: Partial<Indices> = {};

        $('table tbody tr').each((i, element) => {
          const columns = $(element).find('td');

          if (columns.length >= 2) {
            const indexName = $(columns[0]).text().trim();
            const indexValue = $(columns[1]).text().trim();
            const indexStatus = $(columns[2]).find('span').text().trim();

            if (indexName && indexValue && indexStatus) {
              if (['Purchasing Power Index', 'Safety Index', 'Health Care Index', 'Climate Index', 'Cost of Living Index', 'Property Price to Income Ratio', 'Traffic Commute Time Index', 'Pollution Index', 'Quality of Life Index'].includes(indexName)) {
                indices[indexName as IndexName] = {
                  value: indexValue,
                  status: indexStatus as 'Low' | 'Moderate' | 'High' | 'Very Low' | 'Very High',
                };
              }
            }
          }
        });

        await prisma.qualityIndex.update({
          where: {
            citySlug,
          },
          data: {
            purchasingPowerIndex: indices['Purchasing Power Index']?.value,
            safetyIndex: indices['Safety Index']?.value,
            healthCareIndex: indices['Health Care Index']?.value,
            climateIndex: indices['Climate Index']?.value,
            costOfLivingIndex: indices['Cost of Living Index']?.value,
            propertyPriceToIncomeRatio: indices['Property Price to Income Ratio']?.value,
            trafficCommuteTimeIndex: indices['Traffic Commute Time Index']?.value,
            pollutionIndex: indices['Pollution Index']?.value,
            isNumberData: !!$('.no-much-data').length,
            slug:
              undefined === indices['Purchasing Power Index']?.value &&
              undefined === indices['Safety Index']?.value &&
              undefined === indices['Health Care Index']?.value &&
              undefined === indices['Climate Index']?.value &&
              undefined === indices['Cost of Living Index']?.value &&
              undefined === indices['Property Price to Income Ratio']?.value &&
              undefined === indices['Traffic Commute Time Index']?.value &&
              undefined === indices['Pollution Index']?.value ? '' : undefined,
          }
        })

        await new Promise(res => setTimeout(() => res(true), 1000))
      } catch {
        // Skip cities that fail to fetch
      }
    }
  }

  return 'Done'
});
