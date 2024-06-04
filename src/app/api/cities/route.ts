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

    await prisma.city.createMany({
        data: db.cities.map(city => ({
            name: city.name,
            image: city.image,
            region: city.region,
            country: city.country,
            nameChinese: city.name_chinese,
            population: Number(city.population),
            wifi: Number(city.internet_speed),
            latitude: city.latitude.toString(),
            longitude: city.longitude.toString(),
            slug: city.slug,
            costForNomadInUSD: city.cost_for_nomad_in_usd,
            costForExpatInUSD: city.cost_for_expat_in_usd,
            costForLocalInUSD: city.cost_for_local_in_usd,
            costForFamilyInUSD: city.cost_for_family_in_usd,
            totalScore: Number(city.total_score) ?? 0,
            costScore: Number(city.cost_score) ?? 0,
            internetScore: Number(city.internet_score) ?? 0,
            likesScore: Number(city.likes_score) ?? 0,
            safetyLevel: Number(city.safety_level) ?? 0,
        })),
    })

    const cities = await prisma.city.findMany()

    return Response.json({ cities })
}
