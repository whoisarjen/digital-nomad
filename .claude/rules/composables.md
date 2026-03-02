---
paths:
  - "src/composables/**/*.ts"
---

# Composable Rules

## Data-Fetching Composables
- Wrap all API calls with `useCustomQuery` (TanStack Vue Query wrapper)
- Pattern:
  ```ts
  import type { InternalApi } from 'nitropack';

  export const useFoo = (
    query: globalThis.Ref<Partial<FooSchema>>,
    queryOptions?: QueryOptions<InternalApi['/api/foo']['get']>,
  ) => {
    return useCustomQuery<InternalApi['/api/foo']['get']>(
      '/api/foo',
      query,
      queryOptions,
      fooSchema,
    );
  };
  ```
- Type the response with `InternalApi['/api/path']['get']` (inferred from server endpoints)
- Pass the Zod schema for query validation
- `QueryOptions` is auto-imported from `useCustomQuery`

## Naming
- File: `useFoo.ts`, export: `useFoo`
- One composable per file
