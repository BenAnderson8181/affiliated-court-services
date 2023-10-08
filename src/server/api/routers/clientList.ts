import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const clientListRouter = createTRPCRouter({
    list: protectedProcedure
        .input(
            z.object({
                eventId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const clientList = await ctx.prisma.calendarEvent.findMany({
                where: {
                    id: input.eventId
                },
                include: {
                    clientCalendarEvents: {
                        include: {
                            account: {
                                select: {
                                    id: true,
                                    preferredName: true,
                                    firstName: true,
                                    lastName: true
                                },
                                include: {
                                    clientAlerts: true,
                                    clientParticipationNotes: true,
                                    clientGoalAnswers: {
                                        where: {
                                            isCurrent: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            return clientList;
        })
})