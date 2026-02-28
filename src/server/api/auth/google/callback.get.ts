export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code as string | undefined
  const state = query.state as string | undefined
  const error = query.error as string | undefined

  if (error) {
    return sendRedirect(event, '/join?error=access_denied')
  }

  if (!code || !state) {
    return sendRedirect(event, '/join?error=missing_params')
  }

  // Verify CSRF state
  const storedState = getCookie(event, 'oauth_state')
  deleteCookie(event, 'oauth_state', { path: '/' })

  if (!storedState || storedState !== state) {
    return sendRedirect(event, '/join?error=invalid_state')
  }

  const redirectUri = process.env.GOOGLE_REDIRECT_URI
    || `${getRequestURL(event).origin}/api/auth/google/callback`

  let googleUser
  try {
    googleUser = await exchangeCodeForUser(code, redirectUri)
  } catch (err) {
    console.error('Google OAuth error:', err)
    return sendRedirect(event, '/join?error=oauth_failed')
  }

  // Find existing user by googleId
  let user = await prisma.user.findUnique({
    where: { googleId: googleUser.id },
  })

  if (!user) {
    // Check if a user with this email exists (email/password user)
    user = await prisma.user.findUnique({
      where: { email: googleUser.email.toLowerCase() },
    })

    if (user) {
      // Link Google account to existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: googleUser.id,
          image: googleUser.picture || null,
        },
      })
    } else {
      // New user
      user = await prisma.user.create({
        data: {
          email: googleUser.email.toLowerCase(),
          name: googleUser.name,
          googleId: googleUser.id,
          image: googleUser.picture || null,
        },
      })
    }
  }

  const sessionToken = await createSession(user.id)
  setSessionCookie(event, sessionToken)

  return sendRedirect(event, '/dashboard')
})
