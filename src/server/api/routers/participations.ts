import { createTRPCRouter, protectedProcedure } from '../trpc'
import { ParticipantNotFound } from '~/utils/serverErrors'
import { GENDERS_MAP } from '~/utils/constants'


export const participationsRouter = createTRPCRouter({
    // Returns all the participations of the user institution
    getAll: protectedProcedure.query(async ({ ctx }) => {
        const { id, institutionISO: userInstitutionISO } = ctx.session.user
        
        const user = await ctx.prisma.user.findFirst({
            where: {
                AND: [
                    {
                        id: id
                    },
                    {
                        participant: {
                            institutionISO: userInstitutionISO
                        }
                    }
                ]
            },
            include: {
                participant: {
                    select: {
                        institutionISO: true,
                        institution: true
                    }
                }
            }
        })

        // Throw error if the participant does not exist
        const { institutionISO } = user!.participant


        if (!user) {
            return ParticipantNotFound()
        }

        const participations = await ctx.prisma.participation.findMany({
            where: {
                institutionISO
            },
            select: {
                discipline: {
                    select: {
                        disciplineId: true,
                        name: true,
                        genreCategory: true
                    }
                },
                registeredBy: true,
                institutionISO: true
            }
        })

        return participations.map(participation => {
            return {
                disciplineId: participation.discipline.disciplineId,
                institutionISO: participation.institutionISO,
                discipline: participation.discipline.name,
                category: participation.discipline.genreCategory,
                registeredBy: participation.registeredBy.firstname + ' ' + participation.registeredBy.lastname,
                genreCategory: GENDERS_MAP[participation.discipline.genreCategory as keyof typeof GENDERS_MAP]
            }
        })
    })
})