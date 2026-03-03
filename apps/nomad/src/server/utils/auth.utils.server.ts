import { defineEventHandler as originalDefineEventHandler, parseCookies, type H3Event } from 'h3'
import { getServerSession } from '#auth'
import type { Session } from 'next-auth'

const SESSION_COOKIE_NAMES = [
  '__Secure-next-auth.session-token',
  'next-auth.session-token',
] as const

export function hasSessionCookie(event: H3Event): boolean {
  const cookies = parseCookies(event)
  return SESSION_COOKIE_NAMES.some(name => !!cookies[name])
}

export async function requireAuth(event: H3Event): Promise<Session> {
  const session = await getServerSession(event)

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  return session
}

export const defineProtectedEventHandler = <T>(
  handler: (event: H3Event, session: Session) => T | Promise<T>,
) => {
  return originalDefineEventHandler(async (event: H3Event) => {
    const session = await requireAuth(event)
    return handler(event, session)
  })
}
