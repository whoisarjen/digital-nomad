import { supabase } from "@/utils/supabase.utils";

export const dynamic = 'force-dynamic'

const transformOpenMeteoToDB = (data: any, index: number) => {
    return {
        weatherCode: data.weather_code[index],
        temperatureMax: data.temperature_2m_max[index],
        temperatureMin: data.temperature_2m_min[index],
        temperatureMean: data.temperature_2m_mean[index],
        apparentTemperatureMax: data.apparent_temperature_max[index],
        apparentTemperatureMin: data.apparent_temperature_min[index],
        apparentTemperatureMean: data.apparent_temperature_mean[index],
        sunrise: data.sunrise[index].slice(-5),
        sunset: data.sunset[index].slice(-5),
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
    const { data: cities } = await supabase
        .from('cities')
        .select('*, weathers(id)')

    const citiesWithoutWeathers = cities?.filter(({ weathers }) => !weathers.length) ?? []
    const selectedCity = citiesWithoutWeathers[Math.floor(Math.random() * citiesWithoutWeathers.length)]

    if (!selectedCity) {
        return Response.json({ message: 'No selectedCity' })
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.latitude}&longitude=${selectedCity.longitude}&daily=weather_code&daily=temperature_2m_max&daily=temperature_2m_min&daily=temperature_2m_mean&daily=apparent_temperature_max&daily=apparent_temperature_min&daily=apparent_temperature_mean&daily=sunrise&daily=sunset&daily=daylight_duration&daily=sunshine_duration&daily=precipitation_sum&daily=rain_sum&daily=snowfall_sum&daily=precipitation_hours&daily=wind_speed_10m_max&daily=wind_gusts_10m_max&daily=wind_direction_10m_dominant&daily=shortwave_radiation_sum&daily=et0_fao_evapotranspiration&start_date=2023-06-07&end_date=2024-06-07`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.daily) {
        return Response.json({ message: 'data.daily not existing', data })
    }

    const weathers = await supabase
        .from('weathers')
        .upsert(
            data.daily.time.map((when: string, i: number) => {
                return {
                    cityId: selectedCity.id,
                    when,
                    ...transformOpenMeteoToDB(data.daily, i),
                }
            }))
        .select()

    return Response.json({ weathers })
}
