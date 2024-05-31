import Grid from '@/components/Grid'
import { PickerContinent } from '@/components/PickerContinents'

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
          <div className="flex p-4 gap-4">
            <PickerContinent />
          </div>
        </section>
        <Grid searchParams={searchParams} />
      </main>
    )
}
