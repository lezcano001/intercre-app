import { ParticipantNotFound } from "~/utils/serverErrors";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { GENDERS_MAP } from "~/utils/constants";
import { z } from "zod";

export const disciplinesRouter = createTRPCRouter({
    getUnsuscribedDisciplines: protectedProcedure.query(async ({ ctx }) => {
        const { id } = ctx.session.user

        const user = await ctx.prisma.user.findFirst({
            where: {
                id
            },
            include: {
                participant: {
                    select: {
                        institutionISO: true
                    }
                }
            }
        })

        if (!user) {
            return ParticipantNotFound()
        }

        /*
            Return all the disciplines where there are not Participations
            where the institutionISO is equal to the current institution
        */
        const availableDisciplines = await ctx.prisma.discipline.findMany({
            where: {
                NOT: {
                    Participations: {
                        some: {
                            institutionISO: user.participant.institutionISO
                        }
                    }
                }
            },
            select: {
                disciplineId: true,
                name: true,
                genreCategory: true,
            }
        })

        return availableDisciplines.map(discipline => {
            return {
                ...discipline,
                genreCategoryLabel: GENDERS_MAP[discipline.genreCategory as keyof typeof GENDERS_MAP]
            }
        })
    }),
    suscribeToDiscipline: protectedProcedure.input(z.object({
        disciplineId: z.string(),
        participantCI: z.string(),
    })).mutation(async ({ ctx, input }) => {
        const { disciplineId, participantCI } = input

        const participant = await ctx.prisma.participant.findUnique({
            where: {
                CI: participantCI
            },
            include: {
                institution: true
            }
        })

        if (!participant) {
            return ParticipantNotFound()
        }

        const participation = await ctx.prisma.participation.create({
            data: {
                disciplineId,
                participantCI,
                institutionISO: participant.institutionISO
            }
        })

        return participation
    }),
    getDiscipline: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
        const disciplineId = input

        const discipline = await ctx.prisma.discipline.findUnique({
            where: {
                disciplineId
            }
        })

        return discipline
    })
})