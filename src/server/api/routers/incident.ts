import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import z from 'zod';

export const incidentRouter = createTRPCRouter({
    upsert: protectedProcedure
        .input(
            z.object({
                accountId: z.string(),
                url: z.string().optional(),
                comment: z.string().optional(),
                incidentTypeId: z.string(),
                completed: z.boolean(),
                domesticViolence: z.boolean(),
                theft: z.boolean(),
                drugsAlcohol: z.boolean(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const incident = await ctx.prisma.incident.findFirst({
                where: {
                    account: {
                        id: input.accountId,
                    },
                }
            });

            // we only want to update the incident if it was created in the last 3 days
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

            if (incident && incident.updatedAt > threeDaysAgo) {
                const comment = input.comment && input.comment?.length > 0 ? input.comment : incident.comment;
                const url = input.url && input.url?.length > 0 ? input.url : incident.url;

                const incidentUpdate = await ctx.prisma.incident.update({
                    where: {
                        id: incident.id,
                    },
                    data: {
                        url,
                        comment,
                        incidentType: {
                            connect: {
                                id: input.incidentTypeId,
                            },
                        },
                        completed: input.completed,
                    },
                });

                if (!incidentUpdate)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update the incident.' });

                return incidentUpdate;
            }

            const incidentCreate = await ctx.prisma.incident.create({
                data: {
                    account: {
                        connect: {
                            id: input.accountId,
                        },
                    },
                    url: input.url,
                    comment: input.comment,
                    incidentType: {
                        connect: {
                            id: input.incidentTypeId,
                        },
                    },
                    completed: input.completed,
                },
            });

            if (!incidentCreate)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create the incident.' });

            const incidentCategories = await ctx.prisma.incidentCategory.findMany();
            const domesticViolenceId = incidentCategories.find((category) => category.name === 'Domestic Violence')?.id;
            const theftId = incidentCategories.find((category) => category.name === 'Theft')?.id;
            const drugsAlcoholId = incidentCategories.find((category) => category.name === 'Drugs/Alcohol')?.id;

            if (input.domesticViolence) {
                const dv = await ctx.prisma.clientIncidents.create({ 
                    data: {
                        account: {
                            connect: {
                                id: input.accountId,
                            },
                        },
                        incident: {
                            connect: {
                                id: incidentCreate.id,
                            },
                        },
                        incidentCategory: {
                            connect: {
                                id: domesticViolenceId,
                            },
                        },
                    },
                });

                if (!dv)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create the client incident.' });
            }

            if (input.theft) {
                const theft = await ctx.prisma.clientIncidents.create({
                    data: {
                        account: {
                            connect: {
                                id: input.accountId,
                            },
                        },
                        incident: {
                            connect: {
                                id: incidentCreate.id,
                            },
                        },
                        incidentCategory: {
                            connect: {
                                id: theftId,
                            },
                        },
                    },
                });

                if (!theft)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create the client incident.' });
            }

            if (input.drugsAlcohol) {
                const drugsAlcohol = await ctx.prisma.clientIncidents.create({
                    data: {
                        account: {
                            connect: {
                                id: input.accountId,
                            },
                        },
                        incident: {
                            connect: {
                                id: incidentCreate.id,
                            },
                        },
                        incidentCategory: {
                            connect: {
                                id: drugsAlcoholId,
                            },
                        },
                    },
                });

                if (!drugsAlcohol)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create the client incident.' });
            }

            return incidentCreate;
        }
    ),
    getLatest: protectedProcedure
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
            
            const incident = await ctx.prisma.incident.findFirst({
                where: {
                    account: {
                        id: clientId,
                    },
                },
                include: {
                    incidentType: true
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            if (!incident)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to find the incident.' });

            return incident;
        }
    ),
    list: protectedProcedure
        .input(
            z.object({
                accountId: z.string().optional(),
                externalId: z.string().optional()
            })
        )
        .query(async ({ ctx, input }) => {
            if (!input.accountId && !input.externalId)
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Required to pass an id.' });

            let clientId = input.accountId;
            if (!clientId) {
                const account = await ctx.prisma.account.findUnique({
                    where: {
                        externalId: input.externalId
                    }
                });

                if (!account)
                    throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find an account from external id.' });

                clientId = account.id;
            }

            const incidents = await ctx.prisma.incident.findMany({
                where: {
                    account: {
                        id: clientId,
                    },
                },
                include: {
                    incidentType: true
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            return incidents;
        }),
    get: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            if (input.id.length ==- 0)
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Required to pass in an id.'});

            const incident = await ctx.prisma.incident.findUnique({
                where: {
                    id: input.id
                },
                include: {
                    incidentType: true
                }
            });

            if (!incident)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'No incident was found.'});

            return incident;
        })
        
})