import Grid from '@/components/Grid'
import { PickerContinent } from '@/components/PickerContinent'
import { PickerMonth } from '@/components/PickerMonth'
import { PickerSortBy } from '@/components/PickerSortBy'
import { PickerWeather } from '@/components/PickerWeather'
import { Suspense } from 'react'
import { SheetSide } from '@/components/SheetSide'
import { Input } from '@/components/ui/input'
import { PickerOrder } from '@/components/PickerOrder'
import type { OrderOption } from '@/utils/order.utils'
import type { SortByOption } from '@/utils/sortBy.utils'
import type { WeatherOption } from '@/utils/weather.utils'
import type { MonthOption } from '@/utils/month.utils'
import type { ContinentOption } from '@/utils/continent.utils'
import { Button } from '@/components/ui/button'

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
} & URLSearchParams

type HomeProps = {
  searchParams: HomeSearchParams
}

export default function Home({
  searchParams,
}: HomeProps) {
    return (
      <main>
        {/* <section className="flex flex-col w-full min-h-screen"> */}
          {/* <div className="flex flex-1">
            <div className="flex flex-1 items-center justify-between container">
              <div className="max-w-96 text-7xl gap-16 flex flex-col font-bold capitalize">
                <h1>Finding destination is hard. We made it easy.</h1>
              </div>
              <Image
                src="https://dspncdn.com/a1/media/692x/c5/4b/76/c54b7637fdaa7b0c7aa43a08ab36f22f.jpg"
                alt="Digital Nomad"
                width={600}
                height={600}
              />
            </div>
          </div> */}
          <div className="flex p-4 gap-4 justify-center items-end">
            <Suspense>
              <SheetSide />
              <div className="flex w-full flex-row items-end space-x-2">
                <Input type="text" placeholder='Bangkok, Chiang Mai, Mexico City...' />
                <Button type="submit">Search</Button>
              </div>
              <PickerContinent searchParams={searchParams} />
              <PickerMonth searchParams={searchParams} />
              <PickerWeather searchParams={searchParams} />
              <PickerSortBy searchParams={searchParams} />
              <PickerOrder searchParams={searchParams} />
            </Suspense>
          </div>
        {/* </section> */}
        <Grid searchParams={searchParams} />
      </main>
    )
}
