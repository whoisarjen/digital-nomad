import { http, HttpResponse } from 'msw'

// Add MSW request handlers here as the project grows.
// Override per-test with: server.use(http.get(...))
export const handlers = [
  // Example:
  // http.get('https://external-api.com/data', () => HttpResponse.json({})),
]
