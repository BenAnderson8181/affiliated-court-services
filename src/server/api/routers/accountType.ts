import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const accountTypeRouter = createTRPCRouter({
    list: publicProcedure
        .query(async ({ctx}) => {
            const accountTypes = await ctx.prisma.accountType.findMany();

            if (!accountTypes)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find account types.' });

            return accountTypes;
        })
});