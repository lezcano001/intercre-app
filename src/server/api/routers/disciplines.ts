import { GENDERS_MAP } from "~/utils/constants";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const disciplinesRouter = createTRPCRouter({
    getAll: protectedProcedure.input(z.object({
        filterByName: z.string().optional(),
        perPage: z.number().optional(),
        page: z.number().optional()
    })).query(async ({ ctx, input }) => {
        // const disciplines = await ctx.prisma.discipline.findMany()
        const { user: { institutionISO } } = ctx.session

        const { filterByName, perPage = 10, page = 1 } = input

        const [disciplines, count, currentPage] = await ctx.prisma.$transaction(async (tx) => {
            const totalCount = await tx.discipline.count({
                where: {
                    name: {
                        contains: filterByName
                    }
                }
            })

            const totalPages = Math.ceil(totalCount / perPage)

            let currentPage = page

            if (currentPage < 1 || currentPage > totalPages) {
                currentPage = 1
            }

            const disciplines = await tx.discipline.findMany({
                take: perPage,
                skip: perPage * (currentPage - 1),
                orderBy: {
                    name: 'asc'
                },
                where: {
                    name: {
                        contains: filterByName
                    }
                }
            })

            return [disciplines, totalCount, currentPage]
        })

        return {
            pagination: {
                total: count,
                page: currentPage
            },
            data: {
                disciplines: disciplines.map(discipline => {
                    return {
                        ...discipline,
                        genreCategory: GENDERS_MAP[discipline.genreCategory as keyof typeof GENDERS_MAP],
                        institutionISO,
                        category: discipline.genreCategory
                    }
                })
            }
        }
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