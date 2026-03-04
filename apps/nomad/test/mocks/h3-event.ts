import type { H3Event } from 'h3'

export function createMockH3Event(options: {
  params?: Record<string, string>
  query?: Record<string, string>
  headers?: Record<string, string>
  method?: string
} = {}): H3Event {
  return {
    node: {
      req: {
        headers: { 'content-type': 'application/json', ...options.headers },
        method: options.method ?? 'GET',
      },
      res: {},
    },
    context: {
      params: options.params ?? {},
    },
  } as unknown as H3Event
}
