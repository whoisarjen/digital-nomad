import { random } from 'lodash'
import { Sun, Cloudy, Wind, CloudRain, Snowflake } from 'lucide-react'

export const IconWeather = (props: any) => {
    const icon = random(0, 4)

    if (icon === 0) {
        return <Sun {...props} />
    }

    if (icon === 1) {
        return <Cloudy {...props} />
    }

    if (icon === 2) {
        return <Wind {...props} />
    }

    if (icon === 3) {
        return <CloudRain {...props} />
    }

    return (
        <Snowflake {...props} />
    )
}
