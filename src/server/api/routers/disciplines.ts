import { GENDERS_MAP } from "~/utils/constants";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const disciplinesRouter = createTRPCRouter({
    getAll: protectedProcedure.query(async ({ ctx }) => {
        const disciplines = await ctx.prisma.discipline.findMany()
        const { user: { institutionISO } } = ctx.session

        return disciplines.map(discipline => {
            return {
                ...discipline,
                genreCategory: GENDERS_MAP[discipline.genreCategory as keyof typeof GENDERS_MAP],
                institutionISO
            }
        })
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