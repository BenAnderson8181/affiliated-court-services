import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from 'zod';

export const requiredGoalsRouter = createTRPCRouter({
    list: protectedProcedure
        .input(z.object({
            externalId: z.string().optional(),
            accountId: z.string().optional()
        }))
        .query(async ({ctx, input}) => {
            if (!input.accountId && !input.externalId)
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Request did not pass in an id.' });

            let clientId = input.accountId;
            if (!clientId) {
                const account = await ctx.prisma.account.findUnique({
                    where: {
                        externalId: input.externalId
                    }
                });

                if (!account)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load account from external id.'  });

                clientId = account.id;
            }

            const requiredGoals = await ctx.prisma.requiredGoals.findMany({
                where: {
                    accountId: clientId
                },
                include: {
                    goal: true
                }
            });

            if (!requiredGoals)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find any required goals.' });
                
            return requiredGoals; 
        }
    ),
    get: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const requiredGoal = ctx.prisma.requiredGoals.findFirst({
                where: {
                    id: input.id
                }
            });

            if (!requiredGoal)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find the required goal.' });

            return requiredGoal;
        }),
    create: protectedProcedure
        .input(
            z.object({
                clientId: z.string().optional(),
                externalId: z.string().optional(),
                goalId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!input.clientId && !input.externalId)
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Requried to pass in an id.' });

            let clientId = input.clientId;
            if (!clientId) {
                const account = await ctx.prisma.account.findUnique({
                    where: {
                        externalId: input.externalId
                    }
                });

                if (!account)
                    throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find an account for the external id.' });

                clientId = account.id;
            }

            const requiredGoals = await ctx.prisma.requiredGoals.create({
                data: {
                    goalId: input.goalId,
                    accountId: clientId
                }
            });

            if (!requiredGoals)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create required goal.' });

            return requiredGoals;
        }),
    start: protectedProcedure
        .input(z.object({
            goalId: z.string(),
            externalId: z.string()
        }))
        .mutation(async ({ctx, input}) => {
            const account = await ctx.prisma.account.findUnique({
                where: {
                    externalId: input.externalId
                }
            });

            if (!account)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find an account for the external id.' });

            const requiredGoal = await ctx.prisma.requiredGoals.findFirst({
                where: {
                    goalId: input.goalId,
                    accountId: account.id,
                }
            });

            if (!requiredGoal)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find the required goal.' });
                
            return requiredGoal; 
        }
    ),
})