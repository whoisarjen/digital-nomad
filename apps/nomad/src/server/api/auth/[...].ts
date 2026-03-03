import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { NuxtAuthHandler } from '#auth'
import type { AuthOptions } from 'next-auth'

export const authOptions = {
  secret: useRuntimeConfig().NUXT_AUTH_SECRET,
  adapter: PrismaAdapter(prisma as any) as any,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      const user = await prisma.user.findFirstOrThrow({
        where: { id: token.id as string },
        include: {
          favorites: {
            select: { citySlug: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      })

      return {
        ...session,
        user: {
          ...user,
          favoriteSlugs: user.favorites.map(f => f.citySlug),
        },
      }
    },
  },
  providers: [
    // @ts-expect-error this is fine
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/join',
  },
} satisfies AuthOptions

export default NuxtAuthHandler(authOptions)
