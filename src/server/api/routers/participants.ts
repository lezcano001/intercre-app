import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { z } from 'zod'

import {
    createTRPCRouter,
    protectedProcedure,
} from '~/server/api/trpc'
import { CIUniqueConstraintViolationError, InternalServerError, ParticipantNotFound, UnauthorizedError } from '~/utils/serverErrors'
import { TRPCError } from '@trpc/server'
import { GENDERS, GENDERS_CATEGORIES, GENDERS_MAP, emptyStringToUndefined } from '~/utils/constants'

// The publicProcedure is temporary because i do not implemented yet an authentication system.

// Add the try...catch blocks to catch the errors
export const participantsRouter = createTRPCRouter({
    getAll: protectedProcedure.input(z.object({
        participantType: z.enum(["STUDENT", "TEACHER"]).optional()
    })).query(async ({ ctx, input }) => {
        const { institutionISO } = ctx.session.user
        const { participantType = "STUDENT" } = input

        return ctx.prisma.participant.findMany({
            where: {
                AND: [
                    {
                        institutionISO
                    },
                    {
                        participantType
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
        telephone: z.string().min(10, {
            message: 'Ingrese un número de teléfono con 10 dígitos. Ej: 0984123456'
        }).max(10, {
            message: 'Ingrese un número de teléfono con 10 dígitos. Ej: 0984123456'
        }).optional().or(emptyStringToUndefined),
        email: z.string().email({
            message: 'Dirección de correo electrónico inválida'
        }).optional().or(emptyStringToUndefined),
        birthDate: z.date({
            required_error: 'Este campo es requirido',
            invalid_type_error: 'Debe ingresar una fecha válida'
        }),
        institution: z.number(),
        gender: z.enum(GENDERS),
    })).mutation(async ({ ctx, input }) => {
        const { ci: CI, institution: institutionISO, ...rest } = input

        const { institutionISO: userInstitutionISO } = ctx.session.user

        if (userInstitutionISO !== institutionISO) {
            throw UnauthorizedError()
        }

        try {
            const createdParticipant = await ctx.prisma.participant.create({
                data: {
                    ...rest,
                    participantType: 'STUDENT',
                    CI,
                    institutionISO,
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
            })

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
        }).optional().or(emptyStringToUndefined),
        email: z.string().email({
            message: 'Dirección de correo electrónico inválida'
        }).optional().or(emptyStringToUndefined),
        birthDate: z.date({
            required_error: 'Este campo es requirido',
            invalid_type_error: 'Debe ingresar una fecha válida'
        }),
        institution: z.number(),
        gender: z.enum(GENDERS),
    })).mutation(async ({ ctx, input }) => {
        const { currentCI: CI, ci: newCI, institution: institutionISO, ...rest } = input

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

            const updatedParticipant = await ctx.prisma.participant.update({
                where: {
                    CI
                },
                data: {
                    ...rest,
                    CI: newCI,
                    institutionISO,
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
        allowedParticipantsType: z.enum(["STUDENT", "TEACHER"]).optional(),
        searchBy: z.enum(['firstname', 'lastname', 'CI']).optional()
    })).query(async ({ ctx, input }) => {
        const {
            searchText,
            roleId,
            searchUsers = false,
            aceptedGenderCategory,
            restrictGenders = false,
            allowedParticipantsType,
            searchBy = 'CI'
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
                                CI: searchBy === 'CI' ? {
                                    contains: searchText
                                } : undefined
                            },
                            {
                                firstname: searchBy === 'firstname' ? {
                                    contains: searchText
                                } : undefined
                            },
                            {
                                lastname: searchBy === 'lastname' ? {
                                    contains: searchText
                                } : undefined
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