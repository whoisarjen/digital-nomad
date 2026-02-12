# Contributing to Digital Nomad

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your credentials
4. Push the schema to your database: `npx prisma db push`
5. Start the dev server: `npm run dev`

## Code Style

- **Vue 3 Composition API** — Use `<script setup lang="ts">` for all components
- **TypeScript** — Strict types, no `any` or `unknown`
- **Tailwind CSS** — Mobile-first, utility classes
- **Data fetching** — Use the `useCustomQuery` composable (wraps TanStack Vue Query), not `useFetch` or `$fetch` directly in components

## Making Changes

1. Create a feature branch from `main`
2. Make your changes
3. Run type checking: `npm run typecheck`
4. Test locally with `npm run dev`
5. Open a pull request with a clear description

## Reporting Issues

Open an issue on GitHub with:
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS info (if relevant)
