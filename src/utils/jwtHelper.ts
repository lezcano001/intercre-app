import { encode, decode } from 'next-auth/jwt'
import { env } from '~/env.mjs'
import { type User } from '@prisma/client'

export type AuthUser = Omit<User, "image" | "password" | "emailVerified" | "email" | "name"> & {institutionISO: number, institutionAbbreviation: string};

export const tokenOneDay = 24 * 60 * 60 * 1000 // in milliseconds
export const tokenOneWeek = tokenOneDay * 7

// The problem i have is that the type of token is affected by the override of the JWT type in my
// auth file, so what i will do is to solve this problem temporarily is to set all the properties to optional

// The decode function will throw if the sended token is invalid

const createJWT = (payload: AuthUser, duration: number) => encode({ token: payload , secret: env.JWT_SECRET, maxAge: duration })

export const jwtHelper = {
    createAccessToken: (payload: AuthUser) => createJWT(payload, tokenOneDay),
    createRefreshToken: (payload: AuthUser) => createJWT(payload, tokenOneWeek),
    verifyToken: (token: string) => decode({token, secret: env.JWT_SECRET})
}