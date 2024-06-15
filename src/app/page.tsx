import Grid from '@/components/Grid'
import { PickerContinent } from '@/components/PickerContinent'
import { PickerMonth } from '@/components/PickerMonth'
import { PickerSortBy } from '@/components/PickerSortBy'
import { PickerWeather } from '@/components/PickerWeather'
import { Suspense } from 'react'
import { SheetSide } from '@/components/SheetSide'
import { PickerOrder } from '@/components/PickerOrder'
import type { OrderOption } from '@/utils/order.utils'
import type { SortByOption } from '@/utils/sortBy.utils'
import type { WeatherOption } from '@/utils/weather.utils'
import type { MonthOption } from '@/utils/month.utils'
import type { ContinentOption } from '@/utils/continent.utils'
import { PickerName } from '@/components/PickerName'

// setInterval(async () => {
//   const res = await fetch('http://localhost:3000/api/weathers', {
//     next: {
//       revalidate: 0,
//     }
//   })
//   console.log(await res.json())
// }, 10000)

export type HomeSearchParams = {
  month?: MonthOption
  continent?: ContinentOption
  sort?: OrderOption['value']
  sortBy?: SortByOption['value']
  weather?: WeatherOption['value']
  name?: string
  wifi?: string
} & URLSearchParams

type HomeProps = {
  searchParams: HomeSearchParams
}

export default function Home({
  searchParams,
}: HomeProps) {
    return (
      <main>
        <section className="flex p-4 gap-4 justify-center items-end sticky top-0 bg-white z-50">
          <Suspense>
            <SheetSide />
            <PickerName searchParams={searchParams} />
            <PickerContinent searchParams={searchParams} />
            <PickerMonth searchParams={searchParams} />
            <PickerWeather searchParams={searchParams} />
            <PickerSortBy searchParams={searchParams} />
            <PickerOrder searchParams={searchParams} />
          </Suspense>
        </section>
        <Grid searchParams={searchParams} />
      </main>
    )
}
