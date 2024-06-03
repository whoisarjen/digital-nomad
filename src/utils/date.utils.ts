export const PICKER_MONTHS_KEY = 'month'

export const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]

export const getMonth = () => MONTHS[new Date().getMonth()]

export const getCurrentMonth = (searchParams: URLSearchParams) => {
    const params = new URLSearchParams(searchParams)
    return params.get(PICKER_MONTHS_KEY) ?? getMonth()
}

export const getTodayAndPreviousDayDate = () => {
    const today: Date = new Date();
    const previousDay: Date = new Date(today);
    previousDay.setDate(today.getDate() - 1);

    const format = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const todayString = format(today);
    const previousDayString = format(previousDay);

    return { today: todayString, previousDay: previousDayString };
}

export const getBeginningAndEndOfSupportedMonth = (monthName: string) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonthIndex = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    // Find the index of the given month name
    const monthIndex = MONTHS.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
    if (monthIndex === -1) {
        throw new Error('Invalid month name provided.');
    }

    // Check if the current date is before the end of the current month
    const isMonthFullyOccurred = currentMonthIndex > monthIndex ||
                                  (currentMonthIndex === monthIndex && currentDay > new Date(currentYear, monthIndex + 1, 0).getDate());

    // Determine target year based on whether the month is fully occurred in the current year
    const targetYear = isMonthFullyOccurred ? currentYear : currentYear - 1;

    const beginningOfMonth = new Date(targetYear, monthIndex, 1).toISOString().split('T')[0];
    const endOfMonth = new Date(targetYear, monthIndex + 1, 0).toISOString().split('T')[0];

    const numberOfDaysInMonth = new Date(targetYear, monthIndex + 1, 0).getDate();

    return { beginning: beginningOfMonth, end: endOfMonth, numberOfDaysInMonth };
};

export const isToday = (date: Date) => {
    const today = new Date();

    if (today.toDateString() === date.toDateString()) {
        return true;
    }
  
    return false;
}
