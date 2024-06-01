import Grid from '@/components/Grid'
import { PickerContinent } from '@/components/PickerContinents'
import { PickerWifi } from '@/components/PickerWifi'
import { PickerMonth } from '@/components/PickerMonths'
import { PickerPopulation } from '@/components/PickerPopulation'
import { PickerTemperatures } from '@/components/PickerTemperatures'
import { PickerSortBy } from '@/components/PickerOrderBy'

type HomeProps = {
  searchParams: URLSearchParams
}

export default function Home({
  searchParams,
}: HomeProps) {
    return (
      <main>
        <section className="flex flex-col w-full min-h-screen">
          <div className="flex flex-1 bg-black">
            
          </div>
          <div className="flex p-4 gap-4 justify-center">
            <PickerContinent />
            <PickerMonth />
            <PickerTemperatures />
            <PickerPopulation />
            <PickerWifi />
            <PickerSortBy />
          </div>
        </section>
        <Grid searchParams={searchParams} />
      </main>
    )
}
