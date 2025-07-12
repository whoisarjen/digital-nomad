You have extensive expertise in Vue 3, Nuxt 3, TypeScript, Node.js, Vite, Vue Router, Pinia, VueUse, Nuxt UI, and Tailwind CSS. You possess a deep knowledge of best practices and performance optimization techniques across these technologies.

Code Style and Structure
- Write clean, maintainable, and technically accurate TypeScript code.
- Prioritize functional and declarative programming patterns; avoid using classes.
- Emphasize iteration and modularization to follow DRY principles and minimize code duplication.
- Prefer Composition API <script setup> style.
- Use Composables to encapsulate and share reusable client-side logic or state across multiple components in your Nuxt application.

Nuxt 3 Specifics
- Nuxt 3 provides auto imports, so theres no need to manually import 'ref', 'useState', or 'useRouter'.
- For color mode handling, use the built-in '@nuxtjs/color-mode' with the 'useColorMode()' function.
- Take advantage of VueUse functions to enhance reactivity and performance (except for color mode management).
- Use the Server API (within the server/api directory) to handle server-side operations like database interactions, authentication, or processing sensitive data that must remain confidential.
- use useRuntimeConfig to access and manage runtime configuration variables that differ between environments and are needed both on the server and client sides.
- For SEO use useHead and useSeoMeta.
- For images use <CustomNuxtImage> component and for Icons use Nuxt Icons module.
- use app.config.ts for app theme configuration.

Fetching Data
- All data fetching should be handled by the `useCustomQuery` composable, which is a wrapper around `@tanstack/vue-query`. This provides a consistent, powerful, and type-safe way to fetch, cache, and manage server state.
- The `useCustomQuery` composable simplifies data fetching by automatically generating query keys, handling schema validation with Zod, and integrating seamlessly with Nuxt's server-side rendering.

**`useCustomQuery` Usage:**

The composable is typically wrapped in another composable specific to the data being fetched.

**Parameters:**
- `url` (String): The API endpoint to fetch data from.
- `queryRaw` (Ref<Object>): A ref containing the query parameters for the request.
- `queryOptions` (Object): Options passed directly to `@tanstack/vue-query`, such as `enabled`, `select`, or `placeholderData`.
- `schema` (Zod Schema): A Zod schema to validate the query parameters.

**Example (`useCities.ts`):**

'''typescript
import type { InternalApi } from 'nitropack';
import { type GetCitiesSchema, getCitiesSchema } from '~/shared/global.schema';

export const useCities = (
  query: globalThis.Ref<Partial<GetCitiesSchema>>,
  queryOptions?: QueryOptions<InternalApi['/api/cities']['get']>,
) => {
  return useCustomQuery<InternalApi['/api/cities']['get'](
    '/api/cities',
    query,
    queryOptions,
    getCitiesSchema,
  )
};
'''

**In Components:**

Avoid using `useFetch`, `useAsyncData`, or `$fetch` directly. Instead, use the dedicated composables built with `useCustomQuery`.

'''vue
<script setup lang="ts">
const filters = ref({ search: 'london' });
const { data: cities, isLoading } = await useCities(filters);
</script>
'''

State Management
- **Server State**: The primary source of truth for all data originating from the backend is the server itself. Client-side server state is managed exclusively by `@tanstack/vue-query` through our custom `useCustomQuery` composables.
    -   To update or refresh stale data, re-trigger the relevant `useQuery` logic (e.g., by invalidating the query or changing its parameters) rather than manually managing state on the client.
-   **Global State**: Avoid introducing global state management libraries (like Pinia). The query cache should be sufficient for managing shared server state.
-   **Shared State**: For simple state that needs to be shared across components (e.g., UI state not tied to the server), `useState()` can be used, but prefer keeping state co-located within components whenever possible.
-   **Local State**: For all other component-level state, use standard Vue Composition API functions like `ref()` and `reactive()`.

Naming Conventions
- Utilize composables, naming them as use<MyComposable>.
- Use **PascalCase** for component file names (e.g., components/MyComponent.vue).
- Favor named exports for functions to maintain consistency and readability.

TypeScript Usage
- Use TypeScript throughout; prefer interfaces over types for better extendability and merging.
- Avoid enums, opting for maps for improved type safety and flexibility.
- Use functional components with TypeScript interfaces.

UI and Styling
- Use Nuxt UI and Tailwind CSS for components and styling.
- Implement responsive design with Tailwind CSS; use a mobile-first approach.