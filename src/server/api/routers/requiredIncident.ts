import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const requireIncidentRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                clientId: z.string(),
                clinicianExternalId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const clinician = await ctx.prisma.account.findUnique({
                where: {
                    externalId: input.clinicianExternalId
                }
            });

            if (!clinician)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Could not find the clinician account.'});

            const requireIncident = await ctx.prisma.requireIncident.create({
                data: {
                    clientId: input.clientId,
                    clinicianId: clinician.id
                }
            });

            if (!requireIncident)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to require incident for client.'});

            return requireIncident;
        }),
        clientList: protectedProcedure
            .input(
                z.object({
                    clientId: z.string()
                })
            )
            .query(async ({ ctx, input }) => {
                const requiredIncidents = ctx.prisma.requireIncident.findMany({
                    where: {
                        clientId: input.clientId
                    }
                })

                return requiredIncidents;
            }),
        complete: protectedProcedure
            .input(
                z.object({
                    id: z.string()
                })
            )
            .mutation(async ({ ctx, input }) => {
                const requiredIncident = await ctx.prisma.requireIncident.update({
                    where: {
                        id: input.id
                    },
                    data: {
                        completed: true
                    }
                });

                if (!requiredIncident)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to complete the required incident.' });
            })
})