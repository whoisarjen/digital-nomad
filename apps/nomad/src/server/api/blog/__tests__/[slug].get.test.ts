import { describe, it, expect, vi, beforeAll } from 'vitest'
import { createMockH3Event } from '../../../../../test/mocks/h3-event'

const { prismaMock, getLocaleMock, getLocalizedSelectMock, getValidatedRouterParamsMock } = vi.hoisted(() => ({
  prismaMock: {
    article: {
      findFirstOrThrow: vi.fn(),
    },
  },
  getLocaleMock: vi.fn(() => 'En' as const),
  getLocalizedSelectMock: vi.fn(() => 'En'),
  getValidatedRouterParamsMock: vi.fn(),
}))

vi.mock('#imports', () => ({
  defineEventHandler: (handler: Function) => handler,
  prisma: prismaMock,
  getLocale: getLocaleMock,
  getLocalizedSelect: getLocalizedSelectMock,
  getValidatedRouterParams: getValidatedRouterParamsMock,
}))

describe('GET /api/blog/[slug]', () => {
  let handler: { default: Function }

  beforeAll(async () => {
    handler = await import('~/server/api/blog/[slug].get')
  })

  it('returns article fields for a valid slug', async () => {
    getValidatedRouterParamsMock.mockResolvedValue({ slug: 'life-in-bangkok' })
    prismaMock.article.findFirstOrThrow.mockResolvedValue({
      slug: 'life-in-bangkok',
      titleEn: 'Life in Bangkok',
      excerptEn: 'A great city',
      contentEn: 'Full content here',
      metaTitleEn: 'Bangkok SEO title',
      metaDescEn: 'Bangkok SEO desc',
      featuredImageUrl: 'https://example.com/img.jpg',
      featuredImageAlt: 'Bangkok',
      featuredImageOwnerName: 'John',
      featuredImageOwnerUsername: 'john_doe',
      readingTimeMinutes: 5,
      publishedAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-02-01'),
      faqs: [],
      cities: [],
    })

    const result = await handler.default(
      createMockH3Event({ params: { slug: 'life-in-bangkok' } }),
    )

    expect(result.slug).toBe('life-in-bangkok')
    expect(result.title).toBe('Life in Bangkok')
    expect(result.excerpt).toBe('A great city')
    expect(result.faqs).toEqual([])
  })

  it('maps FAQs using the localized select suffix', async () => {
    getValidatedRouterParamsMock.mockResolvedValue({ slug: 'test-article' })
    prismaMock.article.findFirstOrThrow.mockResolvedValue({
      slug: 'test-article',
      titleEn: 'Test',
      excerptEn: null,
      contentEn: null,
      metaTitleEn: null,
      metaDescEn: null,
      featuredImageUrl: null,
      featuredImageAlt: null,
      featuredImageOwnerName: null,
      featuredImageOwnerUsername: null,
      readingTimeMinutes: 3,
      publishedAt: new Date(),
      updatedAt: new Date(),
      faqs: [{ questionEn: 'Is it safe?', answerEn: 'Yes.' }],
      cities: [],
    })

    const result = await handler.default(
      createMockH3Event({ params: { slug: 'test-article' } }),
    )

    expect(result.faqs).toEqual([{ question: 'Is it safe?', answer: 'Yes.' }])
  })
})
