import type { Prisma } from "@prisma/client";

export const DEFAULT_SORT_VALUE = 'desc'
export const SEARCH_BAR_MAXIMUM_Q_LENGTH = 120

export const OPTIONS_RANKS = [
  { value: '2', label: '⭐⭐' }, 
  { value: '3', label: '⭐⭐⭐' }, 
  { value: '4', label: '⭐⭐⭐⭐' },
]

export const OPTIONS_LEVEL_LTE = [
  { label: 'Low', value: 'low' }, 
  { label: 'Medium', value: 'medium' }, 
]

export const OPTIONS_LEVEL_GTE = [
  { label: 'Medium', value: 'medium' }, 
  { label: 'High', value: 'high' }, 
]

export const OPTIONS_ORDER_BY = [
    { label: 'Total Score', value: 'totalScore' },
    { label: 'Cost of Living', value: 'costForNomadInUsd' },
    { label: 'Internet Speed', value: 'internetSpeed' },
    { label: 'Safety Level', value: 'safetyLevel' },
    { label: 'Population Size', value: 'population' },
    { label: 'Pollution', value: 'pollution' },
    { label: 'Safety', value: 'safety' },
] satisfies { label: string; value: keyof Prisma.CityOrderByWithRelationInput }[]

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