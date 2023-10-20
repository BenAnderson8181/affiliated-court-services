import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const clientPriceRouter = createTRPCRouter({
    list: protectedProcedure
        .input(
            z.object({
                accountId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const clientPrices = await ctx.prisma.clientPrice.findMany({
                where: {
                    accountId: input.accountId
                }
            });

            return clientPrices;
        }
    ),
    create: protectedProcedure
        .input(
            z.object({
                clientPrice: z.number(),
                priceId: z.string(),
                accountId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const clientPrice = await ctx.prisma.clientPrice.create({
                data: {
                    priceId: input.priceId,
                    clientPrice: input.clientPrice,
                    accountId: input.accountId
                }
            });

            if (!clientPrice)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create client price.' });

            return clientPrice;
        })
});