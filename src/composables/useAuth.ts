interface AuthUser {
  id: string
  email: string
  name: string | null
  image: string | null
  number: number
  createdAt: string
}

interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const authState = useState<AuthState>('auth', () => ({
    user: null,
    loading: false,
    error: null,
  }))

  const router = useRouter()
  const route = useRoute()

  const isAuthenticated = computed(() => !!authState.value.user)

  function signInWithGoogle() {
    authState.value.loading = true
    authState.value.error = null
    window.location.href = '/api/auth/google'
  }

  async function login(email: string, password: string) {
    authState.value.loading = true
    authState.value.error = null
    try {
      const data = await $fetch<{ user: AuthUser }>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      authState.value.user = data.user
      await router.push('/dashboard')
    } catch (err: any) {
      authState.value.error = err?.data?.message || 'Login failed'
      throw err
    } finally {
      authState.value.loading = false
    }
  }

  async function register(email: string, password: string, name?: string, referralCode?: string) {
    authState.value.loading = true
    authState.value.error = null
    try {
      const data = await $fetch<{ user: AuthUser }>('/api/auth/register', {
        method: 'POST',
        body: { email, password, name, referralCode },
      })
      authState.value.user = data.user
      await router.push('/dashboard')
    } catch (err: any) {
      authState.value.error = err?.data?.message || 'Registration failed'
      throw err
    } finally {
      authState.value.loading = false
    }
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // Ignore logout errors
    } finally {
      authState.value.user = null
      useCookie('nomad_logged_in').value = null
      await router.push('/')
    }
  }

  async function fetchUser() {
    try {
      const headers = import.meta.server ? useRequestHeaders(['cookie']) : {}
      const data = await $fetch<{ user: AuthUser | null }>('/api/auth/me', { headers })
      authState.value.user = data.user
    } catch {
      authState.value.user = null
    }
  }

  async function deleteAccount() {
    try {
      await $fetch('/api/auth/delete', { method: 'DELETE' })
    } finally {
      authState.value.user = null
      useCookie('nomad_logged_in').value = null
      await router.push('/')
    }
  }

  function checkOAuthError() {
    const error = route.query.error as string | undefined
    if (error) {
      const messages: Record<string, string> = {
        access_denied: 'Sign-in was cancelled.',
        oauth_failed: 'Google sign-in failed. Please try again.',
        invalid_state: 'Sign-in session expired. Please try again.',
        missing_params: 'Something went wrong. Please try again.',
      }
      authState.value.error = messages[error] || 'An unexpected error occurred.'
    }
  }

  function clearError() {
    authState.value.error = null
  }

  return {
    user: computed(() => authState.value.user),
    loading: computed(() => authState.value.loading),
    error: computed(() => authState.value.error),
    isAuthenticated,
    signInWithGoogle,
    login,
    register,
    logout,
    fetchUser,
    deleteAccount,
    checkOAuthError,
    clearError,
  }
}
