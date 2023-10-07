import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const goalRouter = createTRPCRouter({
    list: protectedProcedure
        .query(async ({ctx}) => {
            const goals = await ctx.prisma.goal.findMany();

            if (!goals)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find goals.' });

            return goals;
        }
    ),
})