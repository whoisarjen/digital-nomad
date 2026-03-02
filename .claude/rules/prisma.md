---
paths:
  - "prisma/**"
---

# Prisma Schema Rules

## Database
- PostgreSQL on Neon (serverless, `fra1` region)
- Driver adapters enabled (`previewFeatures = ["driverAdapters"]`)

## Bilingual Content Pattern
- Same-row fields with language suffix: `titleEn`, `titlePl`, `titleEs`, etc.
- 11 languages: en, pl, es, de, pt, fr, ko, ar, tr, ja, it
- New locale fields: add column per language with `@default("")`

## Conventions
- Primary keys: `slug` (String @id) for public entities, `id` (Int/String) for internal
- Timestamps: `createdAt` + `updatedAt` on every model
- Cascade deletes on child relations (`onDelete: Cascade`)
- Composite unique constraints for junction tables (e.g., `@@id([userId, citySlug])`)

## Schema Changes
- User runs `prisma db push` manually — never run migrations from CLI
