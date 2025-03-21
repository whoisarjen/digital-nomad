import type { Prisma } from "@prisma/client";

export const DEFAULT_SORT_VALUE = 'desc'
export const SEARCH_BAR_MAXIMUM_Q_LENGTH = 120

export const OPTIONS_RANKS = [
  { value: '2', label: '⭐⭐' }, 
  { value: '3', label: '⭐⭐⭐' }, 
  { value: '4', label: '⭐⭐⭐⭐' },
]

export const OPTIONS_POLLUTIONS = [
  { label: 'Low', value: 'low' }, 
  { label: 'Medium', value: 'medium' }, 
]

export const OPTIONS_ORDER_BY = [
    { label: 'Total Score', value: 'totalScore' },
    { label: 'Cost of Living', value: 'costForNomadInUsd' },
    { label: 'Internet Speed', value: 'internetSpeed' },
    { label: 'Safety Level', value: 'safetyLevel' },
    { label: 'Population Size', value: 'population' },
    { label: 'Pollution', value: 'pollutionIndex' },
] satisfies { label: string; value: keyof Prisma.CityOrderByWithRelationInput }[]

export const INDEX_MAP = {
    "purchasingPowerIndex": {
      "low_until": 40,
      "medium_until": 70,
      "ideal_value": "Higher"
    },
    "safetyIndex": {
      "low_until": 40,
      "medium_until": 70,
      "ideal_value": "Higher"
    },
    "healthCareIndex": {
      "low_until": 40,
      "medium_until": 70,
      "ideal_value": "Higher"
    },
    "climateIndex": {
      "low_until": 40,
      "medium_until": 70,
      "ideal_value": "Higher"
    },
    "costOfLivingIndex": {
      "low_until": 40,
      "medium_until": 70,
      "ideal_value": "Lower"
    },
    "propertyPriceToIncomeRatio": {
      "low_until": 5,
      "medium_until": 15,
      "ideal_value": "Lower"
    },
    "trafficCommuteTimeIndex": {
      "low_until": 20,
      "medium_until": 50,
      "ideal_value": "Lower"
    },
    "pollutionIndex": {
      "low_until": 30,
      "medium_until": 60,
      "ideal_value": "Lower"
    }
} as const 

export const getIndexMapValue = (key: keyof typeof INDEX_MAP, option: string) => {
  if (option === 'low') {
    return {
      lte: INDEX_MAP[key].low_until,
    }
  }

  return {
    gt: INDEX_MAP[key].low_until,
    lte: INDEX_MAP[key].medium_until,
  }
}

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