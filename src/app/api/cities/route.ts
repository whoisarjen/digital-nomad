import db from '@/../db.json'
import { supabase } from '@/utils/supabase.utils'
import { uniqBy } from 'lodash'

export async function GET() {
    // const res = await supabase
    //     .from('cities')
    //     .insert(uniqBy(db.cities, city => city.name).map(city => ({
    //         name: city.name,
    //         image: city.image,
    //         region: city.region,
    //         country: city.country,
    //         population: parseInt(city.population as unknown as string),
    //         wifi: parseInt(city.internet_speed as unknown as string),
    //         latitude: city.latitude.toString(),
    //         longitude: city.longitude.toString(),
    //         slug: city.slug,
    //         costForNomadInUSD: parseInt(city.cost_for_nomad_in_usd as unknown as string),
    //         costForExpatInUSD: parseInt(city.cost_for_expat_in_usd as unknown as string),
    //         costForLocalInUSD: parseInt(city.cost_for_local_in_usd as unknown as string),
    //         costForFamilyInUSD: parseInt(city.cost_for_family_in_usd as unknown as string),
    //         totalScore: Number(city.total_score) ?? 0,
    //         costScore: Number(city.cost_score) ?? 0,
    //         internetScore: Number(city.internet_score) ?? 0,
    //         likesScore: Number(city.likes_score) ?? 0,
    //         safetyLevel: Number(city.safety_level) ?? 0,
    //     })))

    return Response.json({ message: 'Successful' })
}
