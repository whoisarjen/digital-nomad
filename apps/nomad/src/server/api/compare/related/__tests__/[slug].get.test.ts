import { describe, it, expect, vi, beforeAll } from 'vitest'
import { createMockH3Event } from '../../../../../../test/mocks/h3-event'

const { prismaMock, getValidatedRouterParamsMock } = vi.hoisted(() => ({
  prismaMock: {
    city: {
      findFirstOrThrow: vi.fn(),
      findMany: vi.fn(),
    },
  },
  getValidatedRouterParamsMock: vi.fn(),
}))

vi.mock('#imports', () => ({
  defineEventHandler: (handler: Function) => handler,
  prisma: prismaMock,
  getValidatedRouterParams: getValidatedRouterParamsMock,
}))

describe('GET /api/compare/related/[slug]', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/compare/related/[slug].get')
  })

  it('returns related comparison pairs for a city', async () => {
    getValidatedRouterParamsMock.mockResolvedValue({ slug: 'bangkok' })
    prismaMock.city.findFirstOrThrow.mockResolvedValue({
      slug: 'bangkok',
      name: 'Bangkok',
      region: 'Asia',
      costForNomadInUsd: 1500,
    })
    prismaMock.city.findMany.mockResolvedValue([
      { slug: 'bali', name: 'Bali', country: 'Indonesia', costForNomadInUsd: 1200 },
      { slug: 'chiang-mai', name: 'Chiang Mai', country: 'Thailand', costForNomadInUsd: 900 },
    ])

    const result = await handler.default(createMockH3Event({ params: { slug: 'bangkok' } }))

    expect(result).toHaveLength(2)
    expect(result[0]).toHaveProperty('slugs')
    expect(result[0]).toHaveProperty('cityAName')
    expect(result[0]).toHaveProperty('cityBName')
  })

  it('builds canonical slugs (alphabetical order)', async () => {
    getValidatedRouterParamsMock.mockResolvedValue({ slug: 'bangkok' })
    prismaMock.city.findFirstOrThrow.mockResolvedValue({
      slug: 'bangkok',
      name: 'Bangkok',
      region: 'Asia',
      costForNomadInUsd: 1500,
    })
    prismaMock.city.findMany.mockResolvedValue([
      { slug: 'bali', name: 'Bali', country: 'Indonesia', costForNomadInUsd: 1200 },
    ])

    const result = await handler.default(createMockH3Event({ params: { slug: 'bangkok' } }))

    // 'bali' < 'bangkok' alphabetically, so bali comes first
    expect(result[0]!.slugs).toBe('bali-vs-bangkok')
    expect(result[0]!.cityAName).toBe('Bali')
    expect(result[0]!.cityBName).toBe('Bangkok')
  })

  it('returns empty array when no related cities exist', async () => {
    getValidatedRouterParamsMock.mockResolvedValue({ slug: 'nowhere' })
    prismaMock.city.findFirstOrThrow.mockResolvedValue({
      slug: 'nowhere',
      name: 'Nowhere',
      region: 'Africa',
      costForNomadInUsd: 1000,
    })
    prismaMock.city.findMany.mockResolvedValue([])

    const result = await handler.default(createMockH3Event({ params: { slug: 'nowhere' } }))

    expect(result).toEqual([])
  })
})
