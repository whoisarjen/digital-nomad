export const SEARCH_BAR_MAXIMUM_Q_LENGTH = 120

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