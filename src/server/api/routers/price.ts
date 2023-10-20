import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const priceRouter = createTRPCRouter({
    list: protectedProcedure
        .query(async ({ctx}) => {
            const prices = await ctx.prisma.price.findMany();

            if (!prices)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find any prices.' });

            return prices;
        }
    ),
})