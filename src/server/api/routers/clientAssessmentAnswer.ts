import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const clientAssessmentAnswerRouter = createTRPCRouter({
    get: protectedProcedure
        .input(
            z.object({
                accountId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const clientAlert = await ctx.prisma.clientAlerts.findFirst({
                where: {
                    accountId: input.accountId
                }
            });

            return clientAlert;
        }),
    upsert: protectedProcedure
        .input(
            z.object({
                id: z.string().optional(),
                accountId: z.string().optional(),
                alert: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!input.id) {
                const clientAlert = await ctx.prisma.clientAlerts.create({
                    data: {
                        accountId: input.accountId as string,
                        alert: input.alert
                    }
                });

                if (!clientAlert)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create client alert.' });

                return clientAlert;
            }
            else {
                const clientAlert = await ctx.prisma.clientAlerts.update({
                    where: {
                        id: input.id
                    },
                    data: {
                        alert: input.alert
                    }
                });

                if (!clientAlert)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update client alert.' });

                return clientAlert;
            }
        })
})