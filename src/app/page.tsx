import db from '@/../db.json'
import Image from 'next/image'

import { AspectRatio } from "@/components/ui/aspect-ratio"

export default function Home() {
  return (
    <main>
      {/* <section className="flex min-h-screen bg-red-100 w-full">
        Main
      </section>

      <section className="w-full bg-yellow-100">
        {db.cities.length}
      </section> */}

      <section className="flex flex-wrap gap-4 bg-green-100 justify-center p-4">
        {db.cities.map(city => {
          return (
            <div key={city.slug} className="flex w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 bg-red-100 relative">
              <AspectRatio ratio={16 / 9} className="bg-muted">
                <Image
                  fill
                  alt={city.name}
                  src={city.image}
                  className="rounded-md object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-15 rounded-md" />
                <div className="text-white absolute inset-0 flex flex-col items-center justify-center bg-opacity-50">
                  <h2 className="text-2xl font-bold">{city.name}</h2>
                  <p className="text-lg">{city.country}</p>
                </div>
              </AspectRatio>
            </div>
          )
        })}
      </section>
    </main>
  );
}
