import type { Prisma } from "@prisma/client";

export const DEFAULT_SORT_VALUE = 'desc'
export const SEARCH_BAR_MAXIMUM_Q_LENGTH = 120

export const ORDER_BY_OPTIONS = [
    {
        label: 'Total Score',
        value: 'totalScore',
    },
    {
        label: 'Cost of Living',
        value: 'costForNomadInUsd',
    },
    {
        label: 'Internet Speed',
        value: 'internetSpeed',
    },
    {
        label: 'Safety Level',
        value: 'safetyLevel',
    },
    {
        label: 'Population Size',
        value: 'population',
    },
] satisfies { label: string; value: keyof Prisma.CityOrderByWithRelationInput }[]

export const INDEX_MAP = {
    "purchasingPowerIndex": {
      "low_when_lower_than": 40,
      "high_when_higher_than": 70,
      "ideal_value": "Higher"
    },
    "safetyIndex": {
      "low_when_lower_than": 40,
      "high_when_higher_than": 70,
      "ideal_value": "Higher"
    },
    "healthCareIndex": {
      "low_when_lower_than": 40,
      "high_when_higher_than": 70,
      "ideal_value": "Higher"
    },
    "climateIndex": {
      "low_when_lower_than": 40,
      "high_when_higher_than": 70,
      "ideal_value": "Higher"
    },
    "costOfLivingIndex": {
      "low_when_lower_than": 40,
      "high_when_higher_than": 70,
      "ideal_value": "Lower"
    },
    "propertyPriceToIncomeRatio": {
      "low_when_lower_than": 5,
      "high_when_higher_than": 15,
      "ideal_value": "Lower"
    },
    "trafficCommuteTimeIndex": {
      "low_when_lower_than": 20,
      "high_when_higher_than": 50,
      "ideal_value": "Lower"
    },
    "pollutionIndex": {
      "low_when_lower_than": 30,
      "high_when_higher_than": 60,
      "ideal_value": "Lower"
    }
} as const  

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