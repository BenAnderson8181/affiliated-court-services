import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from 'zod';

export const clientCalendarEventRouter = createTRPCRouter({
    clientList: protectedProcedure
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
                    throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find an account for this request.' });

                clientId = account.id;
            }

            const clientCalendarEvents = await ctx.prisma.clientCalendarEvent.findMany({
                where: {
                    accountId: clientId
                },
                include: {
                    calendarEvent: {
                        include: {
                            calendarEventType: true
                        }
                    },
                },
                orderBy: {
                    calendarEvent: {
                        start: 'asc'
                    } 
                }
            });

            return clientCalendarEvents;
        })
})