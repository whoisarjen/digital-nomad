import db from '@/../db.json'
import { supabase } from '@/utils/supabase.utils'
import { uniqBy } from 'lodash'
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic'

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

//     const removeParams = (url: string, keys: string[]): string => {
//         // Create a regular expression to match the specified keys
//         const regex = new RegExp(`(${keys.join('|')})=[^,\/]*([,\/])`, 'g')
        
//         // Remove matching parameters
//         let cleanedUrl = url.replace(regex, (_, key, separator) => separator === ',' ? '' : separator)
      
//         // Remove any trailing commas that might result from the replacement
//         cleanedUrl = cleanedUrl.replace(/,(\?|$)/, '$1').replace(/,+/g, ',')
      
//         // Return the cleaned URL
//         return cleanedUrl
//     }

//     const city = await supabase
//         .from('cities')
//         .select('*')
//         .not('image', 'is', null)
//         .limit(1)
//         .single()

//     if (!city) {
//         return Response.json({ message: 'OK' })
//     }

//     const currentImageURL = removeParams(city.data.image, ['width', 'height', 'quality'])

//     // const fetchImage = async (url: string): Promise<Buffer> => {
//     //     const response = await fetch(url, {
//     //         next: {
//     //             revalidate: 0,
//     //         }
//     //     })

//     //     if (!response.ok) {
//     //       throw new Error(`Failed to fetch image: ${response.statusText}`)
//     //     }

//     //     const buffer = await response.arrayBuffer()
//     //     return buffer
//     // }

//     // Fetch and convert the image to a buffer
//     // const imageBuffer = await fetchImage(currentImageURL);

//     // const uploadImageToBucket = async (imageBuffer: Buffer, fileName: string) => {
//     //     const { data, error } = await supabase.storage
//     //       .from('images')
//     //       .upload(fileName, imageBuffer, {
//     //         cacheControl: '3600',
//     //         upsert: true,
//     //       });
      
//     //     if (error) {
//     //       throw new Error(`Failed to upload image to bucket: ${error.message}`);
//     //     }
      
//     //     return data;
//     //   }

//     async function fetchAndSaveImage(url: string, fileName: string) {
//         console.log({ url })
//         const response = await fetch(url);
//         if (!response.ok) {
//             const error = await response.text()
//             if (error.includes('ERROR 9413')) {
//                 console.log('ERROR 9413 skipping')
//                 await supabase
//                     .from('cities')
//                     .update({ image: null })
//                     .eq('id', city.data.id)

//                 return 'skipped'
//             } else {
//                 throw new Error(error);
//             }
//         }
//         const arrayBuffer = await response.arrayBuffer();
//         const buffer = Buffer.from(arrayBuffer);
//         const filePath = path.join(process.cwd(), 'public', 'images', 'cities', fileName);
//         await fs.writeFile(filePath, buffer);
//         console.log(`Image saved to ${filePath}`);
//     }
// console.log(city.data.image, city.data.id)
//     const result = await fetchAndSaveImage(currentImageURL, `${city.data.id}.jpg`)
//     await supabase
//         .from('cities')
//         .update({ image: null })
//         .eq('id', city.data.id)

//     // const result = await uploadImageToBucket(imageBuffer, `cities/${city.id}.jpg`);

//     return Response.json({ currentImageURL, result, city })

    return Response.json({ message: 'Successful' })
}
