import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const requestStatusRouter = createTRPCRouter({
    list: publicProcedure
        .query(async ({ctx}) => {
            const requestStatuses = await ctx.prisma.requestStatus.findMany();

            if (!requestStatuses)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find request statuses.' });

            return requestStatuses;
        })
})