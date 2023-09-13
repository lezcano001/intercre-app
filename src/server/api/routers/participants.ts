import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { utapi } from 'uploadthing/server'
import { z } from 'zod'

import {
    createTRPCRouter,
    protectedProcedure
} from '~/server/api/trpc'
import { CIUniqueConstraintViolationError, InternalServerError } from '~/utils/serverErrors'
import { TRPCError } from '@trpc/server'

// The publicProcedure is temporary because i do not implemented yet an authentication system.

// Add the try...catch blocks to catch the errors
export const participantsRouter = createTRPCRouter({
    getAll: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.participant.findMany()
    }),
    createParticipant: protectedProcedure.input(z.object({
        ci: z.string().max(15),
        firstname: z.string(),
        lastname: z.string(),
        telephone: z.string().max(10),
        email: z.string().email(),
        image: z.object({
            imageFileKey: z.string(),
            imageURL: z.string().url(),
        }).optional(),
        birthDate: z.date(),
        institution: z.number()
    })).mutation(async ({ ctx, input }) => {
        const { ci: CI, institution: institutionISO, image, ...rest } = input
        
        try {
            const participant = await ctx.prisma.participant.create({
                data: {
                    ...rest,
                    CI,
                    institutionISO,
                    image: image ? {
                        create: {
                            imageURL: image.imageURL,
                            fileKey: image.imageFileKey
                        }
                    } : undefined
                }
            })

            return participant.CI
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code === "P2002") {
                    throw CIUniqueConstraintViolationError()
                }
            }

            throw InternalServerError()
        }
    }),
    deleteParticipant: protectedProcedure.input(
        z.object({
            CI: z.string().max(15)
        })
    ).mutation(async ({ ctx, input }) => {
        const { CI } = input

        try {
            const deletedParticipant = await ctx.prisma.participant.delete({
                where: {
                    CI
                },
                include: {
                    image: {
                        select: {
                            fileKey: true
                        }
                    }
                }
            })
    
            if (deletedParticipant.image?.fileKey) {
                await utapi.deleteFiles([deletedParticipant.image.fileKey])
            }

            return {
                ci: deletedParticipant.CI,
                name: deletedParticipant.firstname + ' ' + deletedParticipant.lastname
            }
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code === "P2014") {
                    console.log(err)
                    throw new TRPCError({
                        code: 'UNAUTHORIZED',
                        message: 'No tiene los permisos suficientes para eliminar al usuario'
                    })
                }
            }

            console.log(err)
            throw InternalServerError()
        }
    }),
    getParticipant: protectedProcedure.input(
        z.string().max(15)
    ).query(({ input, ctx }) => {
        return ctx.prisma.participant.findUnique({
            where: {
                CI: input
            },
            include: {
                institution: true,
                image: {
                    select: {
                        imageURL: true,
                        fileKey: true
                    }
                }
            }
        })
    }),
    updateParticipant: protectedProcedure.input(z.object({
        CI: z.string().max(15),
        data: z.object({
            ci: z.string().max(15),
            firstname: z.string(),
            lastname: z.string(),
            telephone: z.string().max(10),
            email: z.string().email(),
            image: z.object({
                imageFileKey: z.string(),
                imageURL: z.string().url()
            }).optional(),
            birthDate: z.date(),
            institution: z.number()
        }),
        previousImageFileKey: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
        const { CI, data: {ci: newCI, institution: institutionISO, image, ...rest}, previousImageFileKey } = input

        /*
            the previous image can be:
            - the default user image: In this case no uploadthing file should be deleted
            - an stored file in uploadthing: In this case the previous file should be deleted
        */

        // What i should do 
        try {
            // If the image was updated, then delete the previous imageFileKey
            if (image && previousImageFileKey) {
                await utapi.deleteFiles([
                    previousImageFileKey
                ])
            }

            const updatedParticipant = await ctx.prisma.participant.update({
                where: {
                    CI
                },
                data: {
                    ...rest,
                    CI: newCI,
                    institutionISO,
                    image: image
                        ? previousImageFileKey
                            ?  {
                                    update: {
                                        data: {
                                            imageURL: image.imageURL,
                                            fileKey: image.imageFileKey
                                        }
                                    }
                                }
                            :   {
                                    create: {
                                        imageURL: image.imageURL,
                                        fileKey: image.imageFileKey,
                                    }
                                }
                        : undefined
                }
            })

            return updatedParticipant
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code === "P2002") {
                    throw CIUniqueConstraintViolationError()
                }
            }

            console.log(err)
            throw InternalServerError()
        }
    }),
})