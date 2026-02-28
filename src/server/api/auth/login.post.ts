import { loginSchema } from '~/shared/global.schema'

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, loginSchema.parse)

  const user = await prisma.user.findUnique({
    where: { email: body.email.toLowerCase() },
  })

  if (!user || !user.passwordHash) {
    throw createError({ statusCode: 401, message: 'Invalid email or password' })
  }

  const valid = await verifyPassword(body.password, user.passwordHash)
  if (!valid) {
    throw createError({ statusCode: 401, message: 'Invalid email or password' })
  }

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
