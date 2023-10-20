import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const accountStatusRouter = createTRPCRouter({
    list: publicProcedure
        .query(async ({ctx}) => {
            const accountStatuses = await ctx.prisma.accountStatus.findMany();

            if (!accountStatuses)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find account statuses.' });
                
            return accountStatuses; 
        })
});