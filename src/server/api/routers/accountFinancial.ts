import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const accountFinancialRouter = createTRPCRouter({
    get: protectedProcedure
        .input(
            z.object({
                accountId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const accountFinancial = await ctx.prisma.accountFinancial.findFirst({
                where: {
                    accountId: input.accountId
                }
            });

            if (!accountFinancial)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find account financial record.' });

            return accountFinancial;
        }),
    create: protectedProcedure
        .input(
            z.object({
                paymentProcess: z.string(),
                accountId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const accountFinancial = ctx.prisma.accountFinancial.create({
                data: {
                    paymentProcess: input.paymentProcess,
                    accountId: input.accountId
                }
            });

            if (!accountFinancial)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create account financial record.' });

            return accountFinancial;
        })

})