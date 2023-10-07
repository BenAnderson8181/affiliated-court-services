import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const goalAchievementStatusRouter = createTRPCRouter({
    list: publicProcedure
        .query(async ({ ctx }) => {
            const goalAchievementStatuses = await ctx.prisma.goalAchievmentStatus.findMany();

            if (!goalAchievementStatuses)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find document types.' });
                
            return goalAchievementStatuses;
        })
})