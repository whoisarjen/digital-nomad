import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"

type CityProps = {
    params: {
        slug: string
    }
}

export default async function City ({ params: { slug } }: CityProps) {
    return (
        <section className="flex flex-col w-full min-h-screen">
            <div className="flex flex-1">
                <div className="flex flex-1 items-center justify-between container">
                    <div className="max-w-96 text-7xl gap-16 flex flex-col font-bold capitalize">
                        {/* <h1>{city.name}</h1> */}
                    </div>
                    {/* <Image
                        src={city.image}
                        alt={city.name}
                        width={600}
                        height={600}
                    /> */}
                </div>
            </div>
        </section>
    )
}