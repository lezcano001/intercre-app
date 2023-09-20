import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { utapi } from 'uploadthing/server'
import { z } from 'zod'

import {
    createTRPCRouter,
    protectedProcedure,
} from '~/server/api/trpc'
import { CIUniqueConstraintViolationError, InternalServerError, ParticipantNotFound, UnauthorizedError } from '~/utils/serverErrors'
import { TRPCError } from '@trpc/server'
import { GENDERS, GENDERS_CATEGORIES, GENDERS_MAP } from '~/utils/constants'

// The publicProcedure is temporary because i do not implemented yet an authentication system.

// Add the try...catch blocks to catch the errors
export const participantsRouter = createTRPCRouter({
    getAll: protectedProcedure.query(async ({ ctx }) => {
        const { participantCI, institutionISO } = ctx.session.user

        return ctx.prisma.participant.findMany({
            where: {
                AND: [
                    {
                        CI: {
                            not: participantCI
                        }
                    },
                    {
                        institutionISO
                    }
                ]
            }
        });
    }),
    createParticipant: protectedProcedure.input(z.object({
        ci: z.string().min(1, {
            message: 'Este campo es requerido'
        }).max(15, {
            message: 'Este campo no puede tener más de 15 dígitos'
        }),
        firstname: z.string().min(1, {
            message: 'Este campo es requerido'
        }),
        lastname: z.string().min(1, {
            message: 'Este campo es requerido'
        }),
        telephone: z.string().max(10, {
            message: 'Ingrese un número de teléfono con 10 dígitos. Ej: 0984123456'
        }).min(10, {
            message: 'Ingrese un número de teléfono con 10 dígitos. Ej: 0984123456'
        }),
        email: z.string().email({
            message: 'Dirección de correo electrónico inválida'
        }),
        image: z.object({
            imageFileKey: z.string(),
            imageURL: z.string().url(),
        }).optional(),
        birthDate: z.date({
            required_error: 'Este campo es requirido',
            invalid_type_error: 'Debe ingresar una fecha válida'
        }),
        institution: z.number(),
        gender: z.enum(GENDERS),
        isStudent: z.boolean().optional()
    })).mutation(async ({ ctx, input }) => {
        const { ci: CI, institution: institutionISO, image, isStudent = false, ...rest } = input

        const { institutionISO: userInstitutionISO } = ctx.session.user

        if (userInstitutionISO !== institutionISO) {
            throw UnauthorizedError()
        }

        try {
            const createdParticipant = await ctx.prisma.participant.create({
                data: {
                    ...rest,
                    participantType: isStudent ? 'STUDENT' : 'TEACHER',
                    CI,
                    institutionISO,
                    image: image ? {
                        create: {
                            imageURL: image.imageURL,
                            fileKey: image.imageFileKey
                        }
                    } : undefined,
                }
            })

            return createdParticipant.CI
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code === "P2002") {
                    throw CIUniqueConstraintViolationError()
                }

                console.log(PrismaClientKnownRequestError)
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

        const { institutionISO } = ctx.session.user

        try {
            const participant = await ctx.prisma.participant.findUnique({
                where: {
                    CI
                }
            })

            if (participant?.institutionISO !== institutionISO) {
                throw UnauthorizedError()
            }

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
    ).query(async ({ input, ctx }) => {
        const { participantCI, institutionISO } = ctx.session.user

        const data = await ctx.prisma.participant.findUnique({
            where: {
                CI: input,
                AND: [
                    {
                        CI: {
                            not: participantCI
                        }
                    },
                    {
                        institutionISO
                    }
                ]
            },
            include: {
                institution: true,
                image: {
                    select: {
                        imageURL: true,
                        fileKey: true
                    }
                },
            }
        })

        if (!data) {
            throw ParticipantNotFound()
        }

        return {
            ...data,
            gender: {
                label: GENDERS_MAP[data.gender as keyof typeof GENDERS_MAP],
                value: data.gender as string,
            }
        }
    }),
    updateParticipant: protectedProcedure.input(z.object({
        currentCI: z.string().min(1, {
            message: 'Este campo es requerido'
        }).max(15),
        ci: z.string().min(1, {
            message: 'Este campo es requerido'
        }).max(15, {
            message: 'Este campo no puede tener más de 15 dígitos'
        }),
        firstname: z.string().min(1, {
            message: 'Este campo es requerido'
        }),
        lastname: z.string().min(1, {
            message: 'Este campo es requerido'
        }),
        telephone: z.string().max(10, {
            message: 'Ingrese un número de teléfono con 10 dígitos. Ej: 0984123456'
        }).min(10, {
            message: 'Ingrese un número de teléfono con 10 dígitos. Ej: 0984123456'
        }),
        email: z.string().email({
            message: 'Dirección de correo electrónico inválida'
        }),
        image: z.object({
            imageFileKey: z.string(),
            imageURL: z.string().url()
        }).optional(),
        birthDate: z.date({
            required_error: 'Este campo es requirido',
            invalid_type_error: 'Debe ingresar una fecha válida'
        }),
        institution: z.number(),
        gender: z.enum(GENDERS),
        isStudent: z.boolean(),
        previousImageFileKey: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
        const { currentCI: CI, ci: newCI, institution: institutionISO, image, isStudent, previousImageFileKey, ...rest } = input

        const { institutionISO: userInstitutionISO } = ctx.session.user

        if (userInstitutionISO !== institutionISO) {
            throw UnauthorizedError()
        }

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
                    participantType: isStudent ? "STUDENT" : "TEACHER",
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
    searchParticipant: protectedProcedure.input(z.object({
        searchUsers: z.boolean().optional(),
        searchText: z.string(),
        roleId: z.string(),
        aceptedGenderCategory: z.enum(GENDERS_CATEGORIES).optional(),
        restrictGenders: z.boolean().optional(),
        allowedParticipantsType: z.enum(["STUDENT", "TEACHER"]).optional()
    })).query(async ({ ctx, input }) => {
        const {
            searchText,
            roleId,
            searchUsers = false,
            aceptedGenderCategory,
            restrictGenders = false,
            allowedParticipantsType
        } = input

        const { institutionISO } = ctx.session.user

        if (!aceptedGenderCategory) {
            throw new TRPCError({
                message: 'Error con la conexión a internet. Por favor inténtelo más tarde',
                code: 'BAD_REQUEST'
            })
        }

        const searchResults = await ctx.prisma.participant.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            {
                                CI: {
                                    contains: searchText
                                }
                            },
                            {
                                firstname: {
                                    contains: searchText
                                }
                            },
                            {
                                lastname: {
                                    contains: searchText
                                }
                            },
                        ]
                    },
                    {
                        institutionISO
                    },
                    {
                        User: searchUsers ? undefined : null
                    },
                    {
                        NOT: {
                            SquadList: {
                                some: {
                                    roleId: roleId
                                }
                            }
                        }
                    },
                    {
                        gender: aceptedGenderCategory === "MIXED" || !restrictGenders ? undefined : aceptedGenderCategory
                    },
                    {
                        participantType: allowedParticipantsType
                    }
                ]
            },
            orderBy: {
                CI: 'asc'               
            },
            take: 4
        })

        return searchResults
    })
})