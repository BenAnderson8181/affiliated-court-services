import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from 'zod';

export const clientGoalAnswerRouter = createTRPCRouter({
    list: protectedProcedure
        .input(
            z.object({
                clientId: z.string().optional(),
                externalId: z.string().optional(),
                goal: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            if (!input.clientId && !input.externalId)
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Request did not pass in an id.' });

            let clientId = input.clientId;
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

            const clientGoalAnswers = await ctx.prisma.clientGoalAnswers.findMany({
                where: {
                    accountId: clientId,
                    goal: {
                        name: input.goal
                    }
                },
                include: {
                    goalAchievementStatus: true
                }
            });

            return clientGoalAnswers;
        }),
    upsert: protectedProcedure
        .input(
            z.object({
                clientId: z.string().optional(),
                externalId: z.string().optional(),
                goalId: z.string(),
                answer: z.string(),
                question: z.string(),
                current: z.boolean().default(false)
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!input.clientId && !input.externalId)
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Request did not pass in an id.' });

            let clientId = input.clientId;
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

            const goalAchievementStatus = await ctx.prisma.goalAchievmentStatus.findFirst({
                where: {
                    name: 'InProgress'
                }
            });

            const goalAchievmentStatusId = goalAchievementStatus?.id ?? '';
            if (goalAchievmentStatusId === '')
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find in progress goal achievment status.' });

            const existingClientGoalAnswer = await ctx.prisma.clientGoalAnswers.findFirst({
                where: {
                    accountId: clientId,
                    goalId: input.goalId,
                    question: input.question,
                }
            });

            if (existingClientGoalAnswer) {
                const clientGoalAnswer = await ctx.prisma.clientGoalAnswers.update({
                    where: {
                        id: existingClientGoalAnswer.id
                    },
                    data: {
                        answer: input.answer,
                    }
                });
    
                if (!clientGoalAnswer)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create client goal answer.' });
    
                return clientGoalAnswer;
            }
            else {
                const clientGoalAnswer = await ctx.prisma.clientGoalAnswers.create({
                    data: {
                        accountId: clientId,
                        goalId: input.goalId,
                        answer: input.answer,
                        question: input.question,
                        goalAchievmentStatusId: goalAchievmentStatusId,
                        isCurrent: input.current
                    }
                });
    
                if (!clientGoalAnswer)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create client goal answer.' });
    
                return clientGoalAnswer;
            }
        }),
    review: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                review: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (input.review === '30') {
                const clientGoalAnswer = await ctx.prisma.clientGoalAnswers.update({
                    where: {
                        id: input.id
                    },
                    data: {
                        review30: true
                    }
                });

                if (!clientGoalAnswer)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update 30 day review for client goal answer.' });

                return clientGoalAnswer;
            }
            else if (input.review === '60') {
                const clientGoalAnswer = await ctx.prisma.clientGoalAnswers.update({
                    where: {
                        id: input.id
                    },
                    data: {
                        review60: true
                    }
                });

                if (!clientGoalAnswer)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update 60 day review for client goal answer.' });

                return clientGoalAnswer;
            }
            else if (input.review === '90') {
                const clientGoalAnswer = await ctx.prisma.clientGoalAnswers.update({
                    where: {
                        id: input.id
                    },
                    data: {
                        review90: true
                    }
                });

                if (!clientGoalAnswer)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update 90 day review for client goal answer.' });

                return clientGoalAnswer;
            }
            else {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Please pass 30, 60 or 90 as review with.' });
            }
        }),
    status: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                statusId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const clientGoalAnswer = await ctx.prisma.clientGoalAnswers.update({
                where: {
                    id: input.id
                },
                data: {
                    goalAchievmentStatusId: input.statusId
                }
            });

            if (!clientGoalAnswer)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to change achievement goal status.' });

            return clientGoalAnswer;
        }),
    current: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                current: z.boolean()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const clientGoalAnswer = await ctx.prisma.clientGoalAnswers.update({
                where: {
                    id: input.id
                },
                data: {
                    isCurrent: input.current
                }
            });

            if (!clientGoalAnswer)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to change the is current flag.' });

            return clientGoalAnswer;
        })
})