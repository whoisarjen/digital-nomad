import { createApp, type App } from 'vue'

/**
 * Mounts a composable inside a minimal Vue app so lifecycle hooks run.
 * Use for composables that need onMounted/onUnmounted but don't require Nuxt.
 * For composables that use Nuxt auto-imports, use mountSuspended instead.
 */
export function withSetup<T>(composable: () => T): [T, App] {
  let result!: T
  const app = createApp({
    setup() {
      result = composable()
      return () => null
    },
  })
  app.mount(document.createElement('div'))
  return [result, app]
}
