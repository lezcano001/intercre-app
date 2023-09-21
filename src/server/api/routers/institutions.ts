import {
    createTRPCRouter,
    protectedProcedure,
} from '~/server/api/trpc'

export const institutionsRouter = createTRPCRouter({
    getAvailableInstitutions: protectedProcedure.query(({ ctx }) => {
        // Make here the validation of the user, checking if it has permissions to use institutions
        const { institutionISO } = ctx.session.user

        return ctx.prisma.institution.findMany({
            where: {
                ISO: institutionISO
            }
        })
    }),
})