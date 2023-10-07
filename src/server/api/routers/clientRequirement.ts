import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from 'zod';

export const clientRequirementRouter = createTRPCRouter({
    list: protectedProcedure
        .input(
            z.object({
                clientId: z.string(),
                showCompleted: z.boolean().default(true)
            })
        )
        .query(async ({ ctx, input }) => {
            if (input.showCompleted) {
                const clientRequirements = await ctx.prisma.clientRequirement.findMany({
                    where: {
                        clientId: input.clientId
                    },
                    include: {
                        requirementType: true
                    }
                });

                return clientRequirements;
            }
            else {
                const clientRequirements = await ctx.prisma.clientRequirement.findMany({
                    where: {
                        clientId: input.clientId,
                        completed: false
                    },
                    include: {
                        requirementType: true
                    }
                });

                return clientRequirements;
            }
        }),
    create: protectedProcedure
        .input(
            z.object({
                clientId: z.string(),
                requirementTypeId: z.string(),
                requiredAmount: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const clientRequirement = await ctx.prisma.clientRequirement.create({
                data: {
                    clientId: input.clientId,
                    requirementTypeId: input.requirementTypeId,
                    requiredAmount: input.requiredAmount,
                    fulfilledAmount: 0
                }
            })

            if (!clientRequirement)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to save client requirement.' })

            return clientRequirement;
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                requiredAmount: z.number()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const clientRequirement = await ctx.prisma.clientRequirement.update({
                where: {
                    id: input.id
                },
                data: {
                    requiredAmount: input.requiredAmount
                }
            });

            if (!clientRequirement)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update client requirement.' });

            return clientRequirement;
        }),
    attended: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const clientRequirement = await ctx.prisma.clientRequirement.findFirst({
                where: {
                    id: input.id
                },
            });

            if (!clientRequirement)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find client requirement.' });

            const fulfilledAmount = (clientRequirement.fulfilledAmount + 1);
            const completed = clientRequirement.requiredAmount <= fulfilledAmount;

            const updatedClientRequirement = await ctx.prisma.clientRequirement.update({
                where: {
                    id: input.id
                },
                data: {
                    fulfilledAmount,
                    completed
                }
            });

            if (!updatedClientRequirement)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update client requirement.'})

            return clientRequirement;
        }),
    get: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const clientRequirement = await ctx.prisma.clientRequirement.findFirst({
                where: {
                    id: input.id
                },
                include: {
                    requirementType: true
                }
            });

            if (!clientRequirement)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find client requiremnt.'});

            return clientRequirement;
        }),
    delete: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const clientRequirement = await ctx.prisma.clientRequirement.delete({
                where: {
                    id: input.id
                }
            });

            if (!clientRequirement)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete client requirement' });

            return clientRequirement;
        })
})