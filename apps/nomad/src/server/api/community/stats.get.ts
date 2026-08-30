import { CACHE_TAGS } from '~/constants/cache.constant';

export default defineCustomCacheEventHandler(async () => {
  const memberCount = await prisma.user.count()

  return { memberCount }
}, { tags: [CACHE_TAGS.COMMUNITY], ttlSeconds: 3600 })
