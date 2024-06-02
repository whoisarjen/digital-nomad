import db from '@/../db.json'
import { prisma } from '@/utils/prisma.utils'

export async function GET() {
    await prisma.city.deleteMany({
        where: {
            id: {
                gt: 0,
            }
        }
    })

    const createdMany = await prisma.city.createMany({
        data: db.cities.map(city => ({
            name: city.name,
            image: city.image,
            region: city.region,
            country: city.country,
            score: city.total_score,
            nameChinese: city.name_chinese,
            population: Number(city.population),
            temperatureJanuary: Number(city.temperatureC),
            temperatureFebruary: Number(city.temperatureC),
            temperatureMarch: Number(city.temperatureC),
            temperatureApril: Number(city.temperatureC),
            temperatureMay: Number(city.temperatureC),
            temperatureJune: Number(city.temperatureC),
            temperatureJuly: Number(city.temperatureC),
            temperatureAugust: Number(city.temperatureC),
            temperatureSeptember: Number(city.temperatureC),
            temperatureOctober: Number(city.temperatureC),
            temperatureNovember: Number(city.temperatureC),
            temperatureDecember: Number(city.temperatureC),
            wifi: Number(city.internet_speed),
            latitude: city.latitude.toString(),
            longitude: city.longitude.toString(),
            cost: city.cost_for_nomad_in_usd,
        })),
    })
    return Response.json({ createdMany })
}
