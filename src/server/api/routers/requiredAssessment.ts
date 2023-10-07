import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from 'zod';

export const requiredAssessmentsRouter = createTRPCRouter({
    list: protectedProcedure
        .input(z.object({
            externalId: z.string()
        }))
        .query(async ({ctx, input}) => {
            const account = await ctx.prisma.account.findUnique({
                where: {
                    externalId: input.externalId
                }
            });

            if (!account)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find account for the request.' });

            const requiredAssessments = await ctx.prisma.requiredAssessments.findMany({
                where: {
                    accountId: account.id
                },
                include: {
                    assessment: true
                }
            });

            if (!requiredAssessments)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find any required assessments.' });
                
            return requiredAssessments; 
        }
    ),
    create: protectedProcedure
        .input(z.object({
            clientId: z.string().optional(),
            externalId: z.string().optional(),
            assessmentId: z.string()
        }))
        .mutation(async ({ctx, input}) => {
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
            
            const requiredAssessment = await ctx.prisma.requiredAssessments.create({
                data: {
                    assessmentId: input.assessmentId,
                    accountId: clientId
                }
            });

            if (!requiredAssessment)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create required assessment.' });
                
            return requiredAssessment; 
        }
    ),
    complete: protectedProcedure
        .input(z.object({
            assessmentId: z.string(),
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

            const requiredAssessment = await ctx.prisma.requiredAssessments.findFirst({
                where: {
                    assessmentId: input.assessmentId,
                    accountId: account.id,
                    completed: false
                }
            });

            if (!requiredAssessment)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find the required assessment.' });

            const requiredAssessmentComplete = await ctx.prisma.requiredAssessments.update({
                where: {
                    id: requiredAssessment.id
                },
                data: {
                    completed: true
                }
            });

            if (!requiredAssessmentComplete)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to complete the required assessment.' });
                
            return requiredAssessmentComplete; 
        }
    ),
})