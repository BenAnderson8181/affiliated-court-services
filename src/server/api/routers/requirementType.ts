import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const requirementTypeRouter = createTRPCRouter({
    list: protectedProcedure
        .query(async ({ctx}) => {
            const requirementTypes = await ctx.prisma.requirementType.findMany();

            if (!requirementTypes)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find requirement types.' });

            return requirementTypes;
        })
})