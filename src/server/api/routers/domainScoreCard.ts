import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const domainScoreCardRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                clientId: z.string().optional(),
                externalId: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!input.clientId && !input.externalId)
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Required to pass in an id.' });

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

            const domainScoreCard = await ctx.prisma.domainScoreCard.create({
                data: {
                    accountId: clientId,
                }
            });

            if (!domainScoreCard)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create domain score card.' });

            return domainScoreCard;
        }
    ),

    depression: protectedProcedure
        .input(
            z.object({
                externalId: z.string().optional(),
                clientId: z.string().optional(),
                depressionTScore: z.number().optional(),
                depressionSE: z.number().optional(),
                depressionRisk: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!input.clientId && !input.externalId)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

            let clientId = input.clientId;
            if (!clientId) {
                const account = await ctx.prisma.account.findUnique({
                    where: {
                        externalId: input.externalId
                    }
                });

                if (!account)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

                clientId = account.id;
            }

            const domainScoreCard = await ctx.prisma.domainScoreCard.findFirst({
                where: {
                    accountId: clientId,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            if (!domainScoreCard)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

            const depression = await ctx.prisma.domainScoreCard.update({
                where: {
                    id: domainScoreCard.id
                },
                data: {
                    depressionTScore: input.depressionTScore,
                    depressionSE: input.depressionSE,
                    depressionRisk: input.depressionRisk,
                }
            });

            if (!depression)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

            return depression;
        }
    ),
    anger: protectedProcedure
        .input(
            z.object({
                externalId: z.string().optional(),
                clientId: z.string().optional(),
                angerTScore: z.number().optional(),
                angerSE: z.number().optional(),
                angerRisk: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!input.clientId && !input.externalId)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

            let clientId = input.clientId;
            if (!clientId) {
                const account = await ctx.prisma.account.findUnique({
                    where: {
                        externalId: input.externalId
                    }
                });

                if (!account)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

                clientId = account.id;
            }

            const domainScoreCard = await ctx.prisma.domainScoreCard.findFirst({
                where: {
                    accountId: clientId,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            if (!domainScoreCard)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

            const anger = await ctx.prisma.domainScoreCard.update({
                where: {
                    id: domainScoreCard.id
                },
                data: {
                    angerTScore: input.angerTScore,
                    angerSE: input.angerSE,
                    angerRisk: input.angerRisk,
                }
            });

            if (!anger)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

            return anger;
        }
    ),
    mania: protectedProcedure
        .input(
            z.object({
                externalId: z.string().optional(),
                clientId: z.string().optional(),
                maniaRawScore: z.number().optional(),
                maniaRisk: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!input.clientId && !input.externalId)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

            let clientId = input.clientId;
            if (!clientId) {
                const account = await ctx.prisma.account.findUnique({
                    where: {
                        externalId: input.externalId
                    }
                });

                if (!account)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

                clientId = account.id;
            }

            const domainScoreCard = await ctx.prisma.domainScoreCard.findFirst({
                where: {
                    accountId: clientId,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            if (!domainScoreCard)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

            const mania = await ctx.prisma.domainScoreCard.update({
                where: {
                    id: domainScoreCard.id
                },
                data: {
                    maniaRawScore: input.maniaRawScore,
                    maniaRisk: input.maniaRisk,
                }
            });

            if (!mania)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

            return mania;
        }
    ),
    anxiety: protectedProcedure
        .input(
            z.object({
                externalId: z.string().optional(),
                clientId: z.string().optional(),
                anxietyTScore: z.number().optional(),
                anxietySE: z.number().optional(),
                anxietyRisk: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!input.clientId && !input.externalId)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

            let clientId = input.clientId;
            if (!clientId) {
                const account = await ctx.prisma.account.findUnique({
                    where: {
                        externalId: input.externalId
                    }
                });

                if (!account)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

                clientId = account.id;
            }

            const domainScoreCard = await ctx.prisma.domainScoreCard.findFirst({
                where: {
                    accountId: clientId,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            if (!domainScoreCard)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

            const anxiety = await ctx.prisma.domainScoreCard.update({
                where: {
                    id: domainScoreCard.id
                },
                data: {
                    anxietyTScore: input.anxietyTScore,
                    anxietySE: input.anxietySE,
                    anxietyRisk: input.anxietyRisk,
                }
            });

            if (!anxiety)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

            return anxiety;
        }
    ),
        somatic: protectedProcedure
        .input(
            z.object({
                externalId: z.string().optional(),
                clientId: z.string().optional(),
                somaticPHQ15Score: z.number().optional(),
                somaticSeverity: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!input.clientId && !input.externalId)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

            let clientId = input.clientId;
            if (!clientId) {
                const account = await ctx.prisma.account.findUnique({
                    where: {
                        externalId: input.externalId
                    }
                });

                if (!account)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

                clientId = account.id;
            }

            const domainScoreCard = await ctx.prisma.domainScoreCard.findFirst({
                where: {
                    accountId: clientId,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            if (!domainScoreCard)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

            const somatic = await ctx.prisma.domainScoreCard.update({
                where: {
                    id: domainScoreCard.id
                },
                data: {
                    somaticPHQ15Score: input.somaticPHQ15Score,
                    somaticSeverity: input.somaticSeverity,
                }
            });

            if (!somatic)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

            return somatic;
        }
    ),
    sleep: protectedProcedure
        .input(
            z.object({
                externalId: z.string().optional(),
                clientId: z.string().optional(),
                sleepTScore: z.number().optional(),
                sleepSE: z.number().optional(),
                sleepRisk: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!input.clientId && !input.externalId)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

            let clientId = input.clientId;
            if (!clientId) {
                const account = await ctx.prisma.account.findUnique({
                    where: {
                        externalId: input.externalId
                    }
                });

                if (!account)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

                clientId = account.id;
            }

            const domainScoreCard = await ctx.prisma.domainScoreCard.findFirst({
                where: {
                    accountId: clientId,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            if (!domainScoreCard)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

            const sleep = await ctx.prisma.domainScoreCard.update({
                where: {
                    id: domainScoreCard.id
                },
                data: {
                    sleepTScore: input.sleepTScore,
                    sleepSE: input.sleepSE,
                    sleepRisk: input.sleepRisk,
                }
            });

            if (!sleep)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

            return sleep;
        }
    ),
    repetitive: protectedProcedure
        .input(
            z.object({
                externalId: z.string().optional(),
                clientId: z.string().optional(),
                repetitiveAverage: z.number().optional(),
                repetitiveSeverity: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!input.clientId && !input.externalId)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

            let clientId = input.clientId;
            if (!clientId) {
                const account = await ctx.prisma.account.findUnique({
                    where: {
                        externalId: input.externalId
                    }
                });

                if (!account)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

                clientId = account.id;
            }

            const domainScoreCard = await ctx.prisma.domainScoreCard.findFirst({
                where: {
                    accountId: clientId,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            if (!domainScoreCard)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

            const repetitive = await ctx.prisma.domainScoreCard.update({
                where: {
                    id: domainScoreCard.id
                },
                data: {
                    repetitiveAverage: input.repetitiveAverage,
                    repetitiveSeverity: input.repetitiveSeverity,
                }
            });

            if (!repetitive)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

            return repetitive;
        }
    ),
    substance: protectedProcedure
        .input(
            z.object({
                externalId: z.string().optional(),
                clientId: z.string().optional(),
                substanceRawScore: z.number().optional(),
                substanceRisk: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!input.clientId && !input.externalId)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
                
            let clientId = input.clientId;
            if (!clientId) {
                const account = await ctx.prisma.account.findUnique({
                    where: {
                        externalId: input.externalId
                    }
                });
                
                if (!account)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
                    
                clientId = account.id;
            }
            
            const domainScoreCard = await ctx.prisma.domainScoreCard.findFirst({
                where: {
                    accountId: clientId,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            
            if (!domainScoreCard)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
                
            const substance = await ctx.prisma.domainScoreCard.update({
                where: {
                    id: domainScoreCard.id
                },
                data: {
                    substanceRawScore: input.substanceRawScore,
                    substanceRisk: input.substanceRisk,
                }
            });
            
            if (!substance)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
                
            return substance;
        }
    ),
})