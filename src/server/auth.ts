import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials'

import bcrypt from 'bcrypt'

import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { jwtHelper, type AuthUser, tokenOneDay, tokenOneWeek } from "~/utils/jwtHelper";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      participantCI: string;
      institutionISO: number;
      institutionAbbreviation: string;
      // ...other properties
      // role: UserRole;
    };
    error?: "RefreshAccessTokenError"
  }

  interface User {
    id: string;
    participantCI: string;
    institutionISO: number;
    institutionAbbreviation: string;
    // ...other properties
    // role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: AuthUser;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpired?: number;
    refreshTokenExpired?: number;
    error?: "RefreshAccessTokenError"
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => {
      if (token) {
        session.user = {
          ...session.user,
          id: token.user!.id,
          participantCI: token.user!.participantCI,
          institutionISO: token.user!.institutionISO,
          institutionAbbreviation: token.user!.institutionAbbreviation
        }
      }

      session.error = token.error
      return session
    },
    
    /*
      The bug was that in a time of one hour the token expires, first i don't know what. The thing was that in the session
      property i have an object with two properties: strategy and maxAge. The maxAge basically defines the difference
      between the iat and exp values which are in the JWT token. So, when i use the function the decode function in my utils,
      from the next-auth it throws an error if the exp token says that the token expired, and the exp is defined based
      on the maxAge param. In my implementation i have inside the object the property accessTokenExpired.
    */
    // ---
    // This is only executed when the user sends a token
    // Something  strange is that the user and values other than the token are undefined
    // This callback is executed everytime the user makes makes a request to a protected route.
    // In the first call to this callback the user key of the object param have a value, then when a token is sended,
    // don't have a new value, i don't know now why
    async jwt({ token, user }) {
      // The refresh token is not refreshed automatically, when expired, then the user should signin
      if (user) {
        const authUser = { participantCI: user.participantCI, id: user.id, institutionISO: user.institutionISO, institutionAbbreviation: user.institutionAbbreviation};

        const accessToken = await jwtHelper.createAccessToken(authUser)
        const refreshToken = await jwtHelper.createRefreshToken(authUser)

        const accessTokenExpired = Date.now() + tokenOneDay;
        const refreshTokenExpired = Date.now() + tokenOneWeek;

        return {
          ...token,
          accessToken,
          refreshToken,
          accessTokenExpired,
          refreshTokenExpired,
          user: authUser
        }
      } else {
        if (token) {
          if (Date.now() > token.accessTokenExpired!) {
            const verifyToken = await jwtHelper.verifyToken(token.refreshToken!)

            if (verifyToken) {
              const user = await prisma.user.findFirst({
                where: {
                  participantCI: token.user?.participantCI
                }
              })

              if (user) {
                const accessToken = await jwtHelper.createAccessToken({
                  ...token.user!
                })

                const accessTokenExpired = Date.now() * tokenOneDay

                return {
                  ...token,
                  accessToken,
                  accessTokenExpired
                }

              }
            }

            return {
              ...token,
              error: "RefreshAccessTokenError"
            }
          }
        }
      }

      return token
    }
  },
  adapter: PrismaAdapter(prisma),
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 // 1 day
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    CredentialsProvider({
      // id: "next-auth",
      type: 'credentials',
      // The name to display on the sign form (e.g. 'Sign in with...')
      // name: 'Credentials',
      credentials: {
      },
      async authorize(credentials) {
        const {
          ci,
          password
        } = credentials as {
          ci: string;
          password: string;
        }

        try {
          const user = await prisma.user.findFirst({
            where: {
              participantCI: ci
            },
            include: {
              participant: {
                include: {
                  institution: true
                }
              }
            }
          })

          if (user && credentials) {
            const validPassword = await bcrypt.compare(password, user.password)

            if (validPassword) {
              return {
                id: user.id,
                participantCI: user.participantCI,
                name: `${user.participant.firstname} ${user.participant.lastname}`,
                institutionISO: user.participant.institutionISO,
                institutionAbbreviation: user.participant.institution.abbreviation
              }
            }
          }
        } catch (err) {
          console.log(err)
        }

        return null
      }
    })
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
