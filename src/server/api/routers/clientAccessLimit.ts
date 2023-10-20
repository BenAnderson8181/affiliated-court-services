import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from 'zod';

export const clientAccessLimitRouter = createTRPCRouter({
    list: protectedProcedure
        .input(
            z.object({
                accountId: z.string().optional(),
                externalId: z.string().optional()
            })
        )
        .query(async ({ ctx, input }) => {
            if (!input.accountId && !input.externalId)
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Either an account id or external id must be passed.' });

            let clientId = input.accountId;
            if (!clientId) {
                const account = await ctx.prisma.account.findUnique({
                    where: {
                        externalId: input.externalId
                    }
                });

                if (!account)
                    throw new TRPCError({ code: 'NOT_FOUND', message: 'Failed to find an account.' });

                clientId = account.id;
            }

            const clientAccessLimits = await ctx.prisma.clientAccessLimits.findFirst({
                where: {
                    accountId: input.accountId
                },
            });

            return clientAccessLimits;
        }),
    updateActiveGoals: protectedProcedure
        .input(
            z.object({
                accountId: z.string(),
                isIncrease: z.boolean()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const clientAccessLimit = await ctx.prisma.clientAccessLimits.findFirst({
                where: {
                    accountId: input.accountId
                }
            });

            if (!clientAccessLimit?.id)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Failed to find client access limit record for affiliate.' });

            let activeGoals = clientAccessLimit?.activeGoals ?? 0;
            if (input.isIncrease) {
                if (activeGoals >= clientAccessLimit?.activeGoalsLimit)
                    throw new TRPCError({ code: 'BAD_REQUEST', message: 'You can not further increase the number of active goals for this client.' });

                activeGoals = activeGoals + 1;
            }
            else {
                if (activeGoals <= 0)
                    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Can not go below 0 active goals.' });

                activeGoals = activeGoals - 1;
                if (activeGoals < 0)
                    activeGoals = 0;
            }

            const clientAccessLimitMutation = await ctx.prisma.clientAccessLimits.update({
                where: {
                    id: clientAccessLimit?.id
                },
                data: {
                    activeGoals
                }
            });

            if (!clientAccessLimitMutation)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update active goals.' });

            return clientAccessLimitMutation;
        })
});