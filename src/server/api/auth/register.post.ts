import { registerSchema } from '~/shared/global.schema'

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, registerSchema.parse)

  // Check if email already exists
  const existing = await prisma.user.findUnique({
    where: { email: body.email.toLowerCase() },
  })

  if (existing) {
    throw createError({ statusCode: 409, message: 'Email already registered' })
  }

  const passwordHash = await hashPassword(body.password)

  const user = await prisma.user.create({
    data: {
      email: body.email.toLowerCase(),
      name: body.name || null,
      passwordHash,
      referredBy: body.referralCode || null,
    },
  })

  const sessionToken = await createSession(user.id)
  setSessionCookie(event, sessionToken)

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      number: user.number,
    },
  }
})
