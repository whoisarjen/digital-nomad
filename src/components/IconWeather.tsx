import { SUN_CODES, CLOUDY_CODES, WIND_CODES, RAIN_CODES, SNOW_CODES } from '@/utils/weather.utils'
import { isNil } from 'lodash'
import { Sun, Cloudy, Wind, CloudRain, Snowflake } from 'lucide-react'

type IconWeatherProps = {
    weatherCode: number | null
    size?: number
}

export const IconWeather = ({ weatherCode, ...props }: IconWeatherProps) => {
    if (isNil(weatherCode)) {
        return null
    }

    if (SUN_CODES.includes(weatherCode)) {
        return <Sun {...props} />
    }

    if (CLOUDY_CODES.includes(weatherCode)) {
        return <Cloudy {...props} />
    }

    if (WIND_CODES.includes(weatherCode)) {
        return <Wind {...props} />
    }

    if (RAIN_CODES.includes(weatherCode)) {
        return <CloudRain {...props} />
    }

    if (SNOW_CODES.includes(weatherCode)) {
        return <Snowflake {...props} />
    }

    return null
}
