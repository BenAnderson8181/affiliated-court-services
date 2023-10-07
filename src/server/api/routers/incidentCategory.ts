import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const incidentCategoryRouter = createTRPCRouter({
    list: publicProcedure
        .query(async ({ctx}) => {
            const incidentCategories = await ctx.prisma.incidentCategory.findMany();

            if (!incidentCategories)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find any incident categories.' });

            return incidentCategories;
        }
    )
})