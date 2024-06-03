import Grid from '@/components/Grid'
import { PickerContinent } from '@/components/PickerContinents'
import { PickerWifi } from '@/components/PickerWifi'
import { PickerMonth } from '@/components/PickerMonths'
import { PickerPopulation } from '@/components/PickerPopulation'
import { PickerTemperatures } from '@/components/PickerTemperatures'
import { PickerSortBy } from '@/components/PickerOrderBy'
import Image from 'next/image'
import { Navbar } from '@/components/Navbar'

type HomeProps = {
  searchParams: URLSearchParams
}

export default function Home({
  searchParams,
}: HomeProps) {
    return (
      <main>
        <section className="flex flex-col w-full min-h-screen">
          <Navbar />
          <div className="flex flex-1">
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
