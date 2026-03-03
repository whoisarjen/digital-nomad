import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      email: string
      name: string | null
      image: string | null
      number: number
      referralCode: string
      referredBy: string | null
      createdAt: Date
      updatedAt: Date
      favoriteSlugs: string[]
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
  }
}
