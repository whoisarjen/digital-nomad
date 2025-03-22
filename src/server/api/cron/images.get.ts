import _ from "lodash"

type Result = {
  id: string;
  slug: string;
  alternative_slugs: {
      [key: string]: string;
  };
  created_at: string;
  updated_at: string;
  promoted_at: string;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description: string;
  alt_description: string;
  breadcrumbs: any[];
  urls: {
      raw: string;
      full: string;
      regular: string;
      small: string;
      thumb: string;
      small_s3: string;
  };
  links: {
      self: string;
      html: string;
      download: string;
      download_location: string;
  };
  likes: number;
  liked_by_user: boolean;
  current_user_collections: any[];
  sponsorship: any | null;
  topic_submissions: any;
  asset_type: "photo";
  user: {
      id: string;
      updated_at: string;
      username: string;
      name: string;
      first_name: string;
      last_name: string;
      twitter_username: string | null;
      portfolio_url: string | null;
      bio: string;
      location: string;
      links: {
          self: string;
          html: string;
          photos: string;
          likes: string;
          portfolio: string;
          following: string;
          followers: string;
      };
      profile_image: {
          small: string;
          medium: string;
          large: string;
      };
      instagram_username: string;
      total_collections: number;
      total_likes: number;
      total_photos: number;
      total_promoted_photos: number;
      total_illustrations: number;
      total_promoted_illustrations: number;
      accepted_tos: boolean;
      for_hire: boolean;
      social: {
          instagram_username: string;
          portfolio_url: string | null;
          twitter_username: string | null;
          paypal_email: string | null;
      };
  };
};

async function tryUpdateImage(slug: string, photo: Result) {
  const data = {
    width: photo.width,
    height: photo.height,
    url: photo.urls.raw,
    blurHash: photo.blur_hash,
    downloadLocation: photo.links.download_location,
    ownerName: photo.user.name,
    ownerUsername: photo.user.username,
  };

  try {
    await prisma.image.upsert({
      where: { citySlug: slug },
      create: { ...data, city: { connect: { slug } } },
      update: { ...data, city: { connect: { slug } } },
    });
    return true; // Success
  } catch {
    return false; // Failure
  }
}

export default defineEventHandler(async () => {
  const images = await prisma.image.findMany({
    select: {
      city: {
        select: {
          slug: true,
          name: true,
          image: true
        },
      },
    },
    orderBy: {
      updatedAt: 'asc',
    },
  });

  const cities = _.compact(images.map(({ city }) => city));

  let counter = 0
  for (const { slug, name } of cities) {
    counter++
    console.log(`Left ${cities.length - counter}`)
    const data = await $fetch<{ results: Result[] }>('REDACTED_IMAGE_API_URL', {
      query: {
        client_id: 'REDACTED_UNSPLASH_KEY',
        query: name,
        collections: 'REDACTED_COLLECTION_IDS',
      }
    });

    const results = _.orderBy(data.results.length ? data.results : (await $fetch<{ results: Result[] }>('REDACTED_IMAGE_API_URL', {
      query: {
        client_id: 'REDACTED_UNSPLASH_KEY',
        query: name,
      }
    })).results, ['likes'], ['desc']);

    for (const photo of results) {
      const success = await tryUpdateImage(slug, photo);
      if (success) break; // Stop if successful
    }
  };

  return 'Done';
});
