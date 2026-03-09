import { describe, it, expect } from 'vitest'

// Mirrors the validFaqs filter used in blog/[slug].vue
// Both question AND answer must be present for a FAQ to be included in JSON-LD
function filterValidFaqs(faqs: Array<{ question: string | null; answer: string | null }>) {
  return faqs.filter(faq => faq.question && faq.answer)
}

describe('validFaqs filter', () => {
  it('includes faqs that have both question and answer', () => {
    const faqs = [{ question: 'Is it safe?', answer: 'Yes.' }]
    expect(filterValidFaqs(faqs)).toHaveLength(1)
  })

  it('excludes faqs with null question', () => {
    const faqs = [{ question: null, answer: 'Yes.' }]
    expect(filterValidFaqs(faqs)).toHaveLength(0)
  })

  it('excludes faqs with null answer (Google Search Console: missing text in acceptedAnswer)', () => {
    const faqs = [{ question: 'Is it safe?', answer: null }]
    expect(filterValidFaqs(faqs)).toHaveLength(0)
  })

  it('excludes faqs with empty string answer', () => {
    const faqs = [{ question: 'Is it safe?', answer: '' }]
    expect(filterValidFaqs(faqs)).toHaveLength(0)
  })

  it('keeps only fully valid faqs from a mixed array', () => {
    const faqs = [
      { question: 'Q1', answer: 'A1' },
      { question: 'Q2', answer: null },
      { question: null, answer: 'A3' },
      { question: 'Q4', answer: 'A4' },
    ]
    const result = filterValidFaqs(faqs)
    expect(result).toHaveLength(2)
    expect(result[0]!.question).toBe('Q1')
    expect(result[1]!.question).toBe('Q4')
  })
})
