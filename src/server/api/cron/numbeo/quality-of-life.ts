// server/api/scrape.ts
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

// Define a type for the individual index data
interface IndexData {
  value: string;
  status: 'Low' | 'Moderate' | 'High' | 'Very Low' | 'Very High';
}

// Define a type for the overall indices object with the specific keys
type Indices = {
  [key in IndexName]: IndexData;
}

export default defineEventHandler(async () => {
  const numbeos = await prisma.numbeo.findMany({
    where: {
      isNumberData: true,
    },
  })
  const numbeosToSeed = numbeos.filter(option => !option.purchasingPowerIndex && !option.safetyIndex && !option.climateIndex && !option.pollutionIndex && !option.healthCareIndex)

  let counter = 0
  for (const { slug, citySlug } of numbeosToSeed) {
    counter++
    if (slug) {
      console.log(`Left ${numbeosToSeed.length - counter}, working on ${slug}`)
      const url = `REDACTED_QOL_URL/${slug}`;

      try {
        // Fetch the HTML content of the page
        const { data } = await axios.get(url);

        // Load the HTML into cheerio for parsing
        const $ = cheerio.load(data);

        // Initialize an object to store the scraped data (using Partial to allow missing keys)
        const indices: Partial<Indices> = {};

        // Select all rows within the table for relevant indices
        $('table tbody tr').each((i, element) => {
          const columns = $(element).find('td');

          // Check if the row has data (skip rows with no data)
          if (columns.length >= 2) {
            const indexName = $(columns[0]).text().trim();
            const indexValue = $(columns[1]).text().trim();
            const indexStatus = $(columns[2]).find('span').text().trim();

            // Ensure that the indexName matches one of the valid keys in IndexName
            if (indexName && indexValue && indexStatus) {
              // Type assertion to ensure indexName matches one of the predefined keys
              if (['Purchasing Power Index', 'Safety Index', 'Health Care Index', 'Climate Index', 'Cost of Living Index', 'Property Price to Income Ratio', 'Traffic Commute Time Index', 'Pollution Index', 'Quality of Life Index'].includes(indexName)) {
                indices[indexName as IndexName] = {
                  value: indexValue,
                  status: indexStatus as 'Low' | 'Moderate' | 'High' | 'Very Low' | 'Very High',
                };
              }
            }
          }
        });

        // Return the scraped data
        await prisma.numbeo.update({
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
      } catch (error) {
        console.error('Error fetching data:', error);
        return { error: 'Error fetching data from the website' };
      }
    } else {
      console.log(`Skipped ${citySlug} as missing slug`)
    }
  }

  return 'Done'
});
