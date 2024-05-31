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
        })),
    })
    return Response.json({ createdMany })
}
