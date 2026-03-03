---
paths:
  - "src/shared/**/*.ts"
---

# Shared Schema Rules

## Zod Schemas
- All API validation schemas live in `src/shared/global.schema.ts`
- Shared between client (composables) and server (endpoints)
- Export both schema and inferred type:
  ```ts
  export const fooSchema = z.object({ ... });
  export type FooSchema = z.infer<typeof fooSchema>;
  ```

## Query Param Conventions
- `page`/`limit`: string -> number transform with `.positive()` and `.default()`
- `q`: string with max length `SEARCH_BAR_MAXIMUM_Q_LENGTH`
- Enum filters: use `z.enum()` with values from option constants in `global.utils.ts`

## Utilities
- `global.utils.ts` holds filter option constants, sort defaults, and range helpers
- `global.constant.ts` holds locale config (`LOCALES`, `LOCALE_SUFFIX_MAP`, `Language`, `Suffix`)
