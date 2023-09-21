import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { DISCIPLINES_MAP } from "~/utils/constants";
import { TRPCError } from "@trpc/server";
import { ParticipantNotFound, UnauthorizedError } from "~/utils/serverErrors";

// /inscripciones/disciplineId/institutionISO/participantCI

export const squadsRouter = createTRPCRouter({
    getSquad: protectedProcedure.input(
        z.object({
            disciplineId: z.string(),
            institutionISO: z.number()
        })
    ).query(async ({ input, ctx }) => {
        const { disciplineId, institutionISO } = input

        const { institutionISO: userInstitutionISO } = ctx.session.user

        if (userInstitutionISO !== institutionISO) {
            throw UnauthorizedError()
        }

        const discipline = await ctx.prisma.discipline.findUnique({
            where: {
                disciplineId,

            },
            select: {
                DisciplineRoles: {
                    include: {
                        SquadParticipants: {
                            where: {
                                Participant: {
                                    institutionISO
                                }
                            },
                            select: {
                                Participant: {
                                    select: {
                                        firstname: true,
                                        lastname: true,
                                        CI: true
                                    }
                                },
                            },
                        }
                    }
                },
            }
        })

        if (!discipline?.DisciplineRoles) {
            return new TRPCError({
                code: 'NOT_FOUND',
                message: 'La disciplina no contiene roles registrados.'
            })
        }

        return discipline.DisciplineRoles.map(({
            participantsLimit,
            role,
            SquadParticipants,
            roleId,
            restrictGenres,
            allowedParticipantType
        }) => {
            const roleName = participantsLimit > 1 ? DISCIPLINES_MAP[role as keyof typeof DISCIPLINES_MAP].plural : DISCIPLINES_MAP[role as keyof typeof DISCIPLINES_MAP].singular

            return {
                roleId,
                role,
                title: roleName,
                participantsLimit,
                allowedParticipantType,
                participants: SquadParticipants.map(({ Participant: { CI, firstname, lastname } }) => {
                    return {
                        CI,
                        name: firstname + ' ' + lastname
                    }
                }),
                restrictGenres
            }
        }).sort((a, b) => {
            // This makes the PLAYER as the first element and the TEAM_MANAGER as the last
            if (a.role === 'PLAYER' || b.role === 'TEAM_MANAGER') return -1
            if (a.role === 'TEAM_MANAGER' || b.role === 'PLAYER') return 1
            return 0
        })
    }),
    suscribeToSquad: protectedProcedure.input(z.object({
        disciplineId: z.string(),
        participantCI: z.string(),
        institutionISO: z.number(),
        roleId: z.string()
    })).mutation(async ({ ctx, input }) => {
        // It is better to extract the institutionISO from the participant data
        const { disciplineId, institutionISO, participantCI, roleId } = input

        const { institutionISO: userInstitutionISO } = ctx.session.user

        if (userInstitutionISO !== institutionISO) {
            throw UnauthorizedError()
        }

        // catch the error of adding the same user
        const participant = ctx.prisma.$transaction(async (tx) => {
            /*
                - First check if the role restricts genres
                - Second check the discipline genre category
                - Finally check if the participant have the correct gender
            */
            const role = await tx.disciplineRole.findFirst({
                where: {
                    AND: [
                        {
                            roleId,
                        },
                        {
                            disciplineId
                        },
                    ]
                },
                include: {
                    discipline: {
                        select: {
                            genreCategory: true
                        }
                    },
                }
            })

            const participantData = await tx.participant.findUnique({
                where: {
                    CI: participantCI
                }
            })

            if (!role || !role?.discipline) {
                throw new TRPCError({
                    message: 'Disciplina no existente',
                    code: 'NOT_FOUND'
                })
            }

            if (!participantData) {
                throw new TRPCError({
                    message: 'Participante no existente',
                    code: 'NOT_FOUND'
                })
            }

            if (role.restrictGenres) {
                if (role.discipline.genreCategory === "MIXED" || role.discipline.genreCategory === participantData.gender) {
                    const participant = await ctx.prisma.squadParticipant.create({
                        data: {
                            disciplineId,
                            participantCI,
                            roleId
                        }
                    })

                    return participant
                }

                throw new TRPCError({
                    message: 'El participante no puede participar en esta categoría',
                    code: 'BAD_REQUEST'
                })
            } else {
                const participant = await ctx.prisma.squadParticipant.create({
                    data: {
                        disciplineId,
                        participantCI,
                        roleId
                    }
                })

                return participant
            }
        })

        return participant
    }),
    unsuscribeFromSquad: protectedProcedure.input(z.object({
        participantCI: z.string(),
        disciplineId: z.string(),
        roleId: z.string()
    })).mutation(async ({ ctx, input }) => {
        const { disciplineId, participantCI, roleId } = input

        const { institutionISO: userInstitutionISO } = ctx.session.user

        const participant = await ctx.prisma.participant.findUnique({
            where: {
                CI: participantCI
            }
        })

        if (!participant) {
            throw ParticipantNotFound()
        }

        if (participant.institutionISO !== userInstitutionISO) {
            throw UnauthorizedError()
        }

        const unsuscribedParticipant = await ctx.prisma.squadParticipant.delete({
            where: {
                participantCI_disciplineId_roleId: {
                    disciplineId,
                    participantCI,
                    roleId
                }
            }
        })

        // error handling

        return unsuscribedParticipant
    })
})