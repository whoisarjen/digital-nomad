import { prisma } from '@/utils/prisma.utils'

const getTodayAndPreviousYearDate = () => {
    const today = new Date();
    const previousYear = new Date(today);
    previousYear.setFullYear(previousYear.getFullYear() - 1);

    const format = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const todayString = format(today);
    const previousYearString = format(previousYear);

    return { today: todayString, previousYear: previousYearString };
}

const transformOpenMeteoToDB = (data: any, index: number) => {
    return {
        weatherCode: data.weather_code[index],
        temperatureMax: data.temperature_2m_max[index],
        temperatureMin: data.temperature_2m_min[index],
        temperatureMean: data.temperature_2m_mean[index],
        apparentTemperatureMax: data.apparent_temperature_max[index],
        apparentTemperatureMin: data.apparent_temperature_min[index],
        apparentTemperatureMean: data.apparent_temperature_mean[index],
        sunrise: new Date(data.sunrise[index]),
        sunset: new Date(data.sunset[index]),
        daylightDuration: data.daylight_duration[index],
        sunshineDuration: data.sunshine_duration[index],
        precipitationSum: data.precipitation_sum[index],
        rainSum: data.rain_sum[index],
        snowfallSum: data.snowfall_sum[index],
        precipitationHours: data.precipitation_hours[index],
        windSpeed10mMax: data.wind_speed_10m_max[index],
        windGusts10mMax: data.wind_gusts_10m_max[index],
        windDirection10mDominant: data.wind_direction_10m_dominant[index],
        shortwaveRadiationSum: data.shortwave_radiation_sum[index],
        et0FaoEvapotranspiration: data.et0_fao_evapotranspiration[index],
    }
}

export async function GET() {
    const cities = await prisma.city.findMany({
        where: {
            weathers: {
                none: {}
            },
        },
        take: 20,
    })

    const { today, previousYear } = getTodayAndPreviousYearDate()
    const promises = cities.map(async ({ latitude, longitude }) => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code&daily=temperature_2m_max&daily=temperature_2m_min&daily=temperature_2m_mean&daily=apparent_temperature_max&daily=apparent_temperature_min&daily=apparent_temperature_mean&daily=sunrise&daily=sunset&daily=daylight_duration&daily=sunshine_duration&daily=precipitation_sum&daily=rain_sum&daily=snowfall_sum&daily=precipitation_hours&daily=wind_speed_10m_max&daily=wind_gusts_10m_max&daily=wind_direction_10m_dominant&daily=shortwave_radiation_sum&daily=et0_fao_evapotranspiration&start_date=${previousYear}&end_date=${today}`;

        const response = await fetch(url);
        const data = await response.json();
        return data;
    })

    const weatherData = await Promise.all(promises);
    const weatherRecords = weatherData.filter(data => data.daily).flatMap((data, index) => {
        const days = [...data.daily.time]

        return days.map((when, i) => {
            return {
                cityId: cities[index].id,
                when: new Date(when),
                ...transformOpenMeteoToDB(data.daily, i),
            }
        })
    })

    const weathers = await prisma.weather.createMany({
        data: weatherRecords,
    })

    return Response.json({ length: cities.length, weathers })
}
