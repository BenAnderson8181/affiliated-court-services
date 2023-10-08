import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from 'zod';
import { endOfDay, startOfDay } from "date-fns";

export const clientAssessmentAnswerRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({
            clientId: z.string().optional(),
            externalId: z.string().optional(),
            assessmentId: z.string(),
            answers: z.array(z.object({
                questionId: z.string(),
                answer: z.string()
            }))
        }))
        .mutation(async ({ctx, input}) => {
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

            const clientAssessmentAnswers = await ctx.prisma.clientAssessmentAnswers.createMany({
                data: input.answers.map(answer => ({
                    assessmentId: input.assessmentId,
                    accountId: clientId as string,
                    questionId: answer.questionId,
                    answer: answer.answer
                }))
            });

            if (!clientAssessmentAnswers)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create assessment answers.' });

            return clientAssessmentAnswers;
        }),
    list: protectedProcedure
        .input(
            z.object({
                accountId: z.string().optional(),
                externalId: z.string().optional()
            })
        )
        .query(async ({ ctx, input }) => {
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
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load account from external id.' });

                clientId = account.id;
            }

            const clientAssessments = ctx.prisma.clientAssessmentAnswers.findMany({
                where: {
                    accountId: clientId
                },
                include: {
                    assessment: true
                },
                orderBy: {
                    createdAt: 'asc'
                }
            })

            return clientAssessments;
        }),
    get: protectedProcedure
        .input(
            z.object({
                assessment: z.string(),
                accountId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            if (input.assessment.length === 0 || input.accountId.length === 0)
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Did not pass assessment.'});

            const name = input.assessment.split(' - ')[0];
            const date = input.assessment.split(' - ')[1];
            
            if (!name || !date)
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'The assessment passed in needs a valid name and date.' });

            const start = startOfDay(new Date(date));
            const end = endOfDay(new Date(date));

            const assessment = await ctx.prisma.assessment.findFirst({
                where: {
                    name
                }
            });

            if (!assessment)
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'The assessment name passed in could not match to an assessment.' });

            const clientAssessmentAnswers = await ctx.prisma.clientAssessmentAnswers.findMany({
                where: {
                    accountId: input.accountId,
                    assessmentId: assessment.id,
                    createdAt: {
                        lte: end,
                        gte: start
                    }
                },
                include: {
                    question: true
                }
            });

            if (clientAssessmentAnswers.length === 0)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Could not find any answers for the assessment and dates passed in.' })

            return clientAssessmentAnswers;
        })
});