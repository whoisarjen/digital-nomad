import type { Level, Prisma } from "@prisma/client";

export const DEFAULT_SORT_VALUE = 'desc'
export const SEARCH_BAR_MAXIMUM_Q_LENGTH = 120

export const OPTIONS_RANKS = [
  { value: '2', label: '⭐⭐' }, 
  { value: '3', label: '⭐⭐⭐' }, 
  { value: '4', label: '⭐⭐⭐⭐' },
]

export const OPTIONS_LEVEL_LTE = [
  { label: 'Low', value: 'LOW' }, 
  { label: 'Middle', value: 'MIDDLE' }, 
] satisfies { label: string; value: Level }[]

export const OPTIONS_LEVEL_GTE = [
  { label: 'Middle', value: 'MIDDLE' }, 
  { label: 'High', value: 'HIGH' }, 
] satisfies { label: string; value: Level }[]

export type OrderByOptionValue =
  keyof Pick<Prisma.CityOrderByWithRelationInput,
  | 'totalScore'
  | 'costForNomadInUsd'
  | 'internetSpeedCity'
  | 'safety'
  | 'pollution'
  | 'healthCare'
  | 'purchasingPower'
  | 'propertyPriceToIncome'
  | 'costOfLiving'
  | 'trafficCommuteTime'
  | 'population'>

export const OPTIONS_ORDER_BY = [
  { label: 'Total Score', value: 'totalScore' },
  { label: 'Cost of Living (Nomad)', value: 'costForNomadInUsd' },
  { label: 'Internet Speed', value: 'internetSpeedCity' },
  { label: 'Safety Level', value: 'safety' },
  { label: 'Pollution Level', value: 'pollution' },
  { label: 'Healthcare Quality', value: 'healthCare' },
  { label: 'Purchasing Power', value: 'purchasingPower' },
  { label: 'Property Affordability', value: 'propertyPriceToIncome' },
  { label: 'Cost of Living (Local)', value: 'costOfLiving' },
  { label: 'Traffic & Commute Time', value: 'trafficCommuteTime' },
  { label: 'Population Size', value: 'population' },
] satisfies { label: string; value: OrderByOptionValue }[]

export const getUserCurrentMonthString = () => {
    const currentMonth = new Date().getMonth() + 1;
    const currentMonthString = currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`;

    return currentMonthString
}

export const formatNumber = (number: number) => {
    if (number >= 1e9) {
        return (number / 1e9).toFixed(1) + 'b';
    }

    if (number >= 1e6) {
        return (number / 1e6).toFixed(1) + 'm';
    }

    if (number >= 1e3) {
        return (number / 1e3).toFixed(1) + 'k';
    }

    return number.toString();
}

export const getRangesFromQuery = (defaultMin: number, defaultMax: number) => (tempValues: string[]) => {
  const min = tempValues.find((val) => val.startsWith('gte:'))?.split(':')[1];
  const max = tempValues.find((val) => val.startsWith('lte:'))?.split(':')[1];

  return {
    min: Number(min ?? defaultMin),
    max: Number(max ?? defaultMax),
  };
}
