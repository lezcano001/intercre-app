import { z } from 'zod'

import {
    createTRPCRouter,
    publicProcedure
} from '~/server/api/trpc'

export const institutionsRouter = createTRPCRouter({
    getAvailableInstitutions: publicProcedure.query(({ ctx }) => {
        // Make here the validation of the user, checking if it has permissions to use institutions
        return ctx.prisma.institution.findMany()
    }),
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.institution.findMany()
    })
})