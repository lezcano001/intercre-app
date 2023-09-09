import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { z } from 'zod'

import {
    createTRPCRouter,
    publicProcedure
} from '~/server/api/trpc'
import { CIUniqueConstraintViolationError, InternalServerError } from '~/utils/serverErrors'

// The publicProcedure is temporary because i do not implemented yet an authentication system.

// Add the try...catch blocks to catch the errors
export const participantsRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.participant.findMany()
    }),
    createParticipant: publicProcedure.input(z.object({
        ci: z.string().max(15),
        firstname: z.string(),
        lastname: z.string(),
        telephone: z.string().max(10),
        email: z.string().email(),
        imageURL: z.string().url(),
        birthDate: z.date(),
        institution: z.number()
    })).mutation(async ({ ctx, input }) => {
        const { ci: CI, institution: institutionISO, ...rest } = input

        try {
            const newParticipant = await ctx.prisma.participant.create({
                data: {
                    ...rest,
                    CI,
                    institutionISO
                }
            })

            return newParticipant.CI
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code === "P2002") {
                    throw CIUniqueConstraintViolationError()
                }
            }

            throw InternalServerError()
        }
    }),
    deleteParticipant: publicProcedure.input(
        z.object({
            CI: z.string().max(15)
        })
    ).mutation(async ({ ctx, input }) => {
        const { CI } = input

        const deletedParticipant = await ctx.prisma.participant.delete({
            where: {
                CI
            }
        })

        return {
            ci: deletedParticipant.CI,
            name: deletedParticipant.firstname + ' ' + deletedParticipant.lastname
        }
    }),
    getParticipant: publicProcedure.input(
        z.string().max(15)
    ).query(({ input, ctx }) => {
        return ctx.prisma.participant.findUnique({
            where: {
                CI: input
            },
            include: {
                institution: true
            }
        })
    }),
    updateParticipant: publicProcedure.input(z.object({
        CI: z.string().max(15),
        data: z.object({
            ci: z.string().max(15),
            firstname: z.string(),
            lastname: z.string(),
            telephone: z.string().max(10),
            email: z.string().email(),
            imageURL: z.string().url(),
            birthDate: z.date(),
            institution: z.number()
        })
    })).mutation(async ({ ctx, input }) => {
        const { CI, data: {ci: newCI, institution: institutionISO,...rest} } = input

        try {
            const updatedParticipant = await ctx.prisma.participant.update({
                where: {
                    CI
                },
                data: {
                    CI: newCI,
                    institutionISO,
                    ...rest
                }
            })

            return updatedParticipant
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code === "P2002") {
                    throw CIUniqueConstraintViolationError()
                }
            }

            throw InternalServerError()
        }
    })
})