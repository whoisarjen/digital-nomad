import { randomBytes, scrypt, timingSafeEqual } from 'crypto'
import type { H3Event } from 'h3'

const SESSION_COOKIE = 'nomad_session'
const LOGGED_IN_FLAG = 'nomad_logged_in'
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export function generateSessionToken(): string {
  return randomBytes(32).toString('hex')
}

export async function createSession(userId: string): Promise<string> {
  const token = generateSessionToken()
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS)

  await prisma.session.create({
    data: { userId, token, expiresAt },
  })

  return token
}

export async function getSessionUser(event: H3Event) {
  const token = getCookie(event, SESSION_COOKIE)
  if (!token) return null

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!session) return null

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } })
    return null
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
    number: session.user.number,
    createdAt: session.user.createdAt,
  }
}

export async function requireAuth(event: H3Event) {
  const user = await getSessionUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  return user
}

export function setSessionCookie(event: H3Event, token: string): void {
  const secure = process.env.NODE_ENV === 'production'
  const maxAge = SESSION_MAX_AGE_MS / 1000

  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true, secure, sameSite: 'lax', maxAge, path: '/',
  })
  setCookie(event, LOGGED_IN_FLAG, '1', {
    httpOnly: false, secure, sameSite: 'lax', maxAge, path: '/',
  })
}

export function clearSessionCookie(event: H3Event): void {
  const secure = process.env.NODE_ENV === 'production'

  deleteCookie(event, SESSION_COOKIE, {
    httpOnly: true, secure, sameSite: 'lax', path: '/',
  })
  deleteCookie(event, LOGGED_IN_FLAG, {
    httpOnly: false, secure, sameSite: 'lax', path: '/',
  })
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE
}

// Password hashing using Node's built-in scrypt
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err)
      else resolve(`${salt}:${derivedKey.toString('hex')}`)
    })
  })
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, key] = hash.split(':')
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err)
      else resolve(timingSafeEqual(Buffer.from(key, 'hex'), derivedKey))
    })
  })
}
