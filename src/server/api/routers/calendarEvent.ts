import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from 'zod';

export const calendarEventRouter = createTRPCRouter({
    list: protectedProcedure
        .input(
            z.object({
                start: z.date().optional(),
                end: z.date().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            if (input.start && !input.end) {
                const calendarEvents = await ctx.prisma.calendarEvent.findMany({
                    where: {
                        start: {
                            gte: input.start,
                        },
                    },
                    include: {
                        calendarEventType: true,
                        location: true
                    },
                });

                return calendarEvents;
            }
            else if (!input.start && input.end) {
                const calendarEvents = await ctx.prisma.calendarEvent.findMany({
                    where: {
                        end: {
                            lte: input.end,
                        },
                    },
                    include: {
                        calendarEventType: true,
                        location: true
                    },
                });

                return calendarEvents;
            }
            else if (!input.start || !input.end) {
                const calendarEvents = await ctx.prisma.calendarEvent.findMany({
                    include: {
                        calendarEventType: true,
                        location: true
                    },
                });

                return calendarEvents;
            }
            else {
                const calendarEvents = await ctx.prisma.calendarEvent.findMany({
                    where: {
                        start: {
                            gte: input.start,
                        },
                        end: {
                            lte: input.end,
                        },
                    },
                    include: {
                        calendarEventType: true,
                        location: true
                    },
                });

                return calendarEvents;
            }
        }),
    get: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            if (input.id.length === 0)
                return {
                    title: '',
                    description: '',
                    start: new Date(),
                    end: new Date(),
                    url: '',
                    repeat: false
                };

            const calendarEvent = await ctx.prisma.calendarEvent.findUnique({
                where: {
                    id: input.id
                }
            });

            return calendarEvent;
        }),
    create: protectedProcedure
        .input(
            z.object({
                title: z.string(),
                calendarEventTypeId: z.string(),
                locationId: z.string(),
                description: z.string().optional(),
                start: z.date(),
                end: z.date(),
                url: z.string().optional(),
                repeat: z.boolean(),
                externalId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const account = await ctx.prisma.account.findUnique({
                where: {
                    externalId: input.externalId
                }
            });

            if (!account)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find account for the external id.' })

            const calendarEvent = await ctx.prisma.calendarEvent.create({
                data: {
                    title: input.title,
                    description: input.description,
                    start: input.start,
                    end: input.end,
                    url: input.url,
                    repeat: input.repeat,
                    calendarEventType: {
                        connect: {
                            id: input.calendarEventTypeId,
                        },
                    },
                    location: {
                        connect: {
                            id: input.locationId,
                        }
                    },
                    account: {
                        connect: {
                            id: account.id
                        }
                    },
                    filled: false,
                },
            });

            if (!calendarEvent)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unable to create calendar event.' });

            return calendarEvent;
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string(),
                calendarEventTypeId: z.string(),
                description: z.string().optional(),
                start: z.date(),
                end: z.date(),
                url: z.string().optional(),
                repeat: z.boolean(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const calendarEvent = await ctx.prisma.calendarEvent.update({
                where: {
                    id: input.id,
                },
                data: {
                    title: input.title,
                    description: input.description,
                    start: input.start,
                    end: input.end,
                    url: input.url,
                    repeat: input.repeat,
                    calendarEventType: {
                        connect: {
                            id: input.calendarEventTypeId,
                        },
                    },
                },
            });

            if (!calendarEvent)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unable to update calendar event.' });

            return calendarEvent;
        }),
    delete: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const calendarEvent = await ctx.prisma.calendarEvent.delete({
                where: {
                    id: input.id,
                },
            });

            if (!calendarEvent)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unable to delete calendar event.' });

            return calendarEvent;
        }),
    book: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                accountId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const calendarEvent = await ctx.prisma.calendarEvent.findUnique({
                where: {
                    id: input.id,
                },
            });

            if (!calendarEvent)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find the calendar event you are trying to book.' });

            const calendarEventType = await ctx.prisma.calendarEventType.findUnique(
                {
                    where: {
                        id: calendarEvent.calendarEventTypeId,
                    },
                }
            );

            if (!calendarEventType)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find the calendar event type for the calendar event you are trying to book.' });

            const count = (calendarEvent?.count ?? 0) + 1;

            const filled = calendarEventType.capacity >= count;

            const clientCalendarEvent = await ctx.prisma.clientCalendarEvent.create(
                {
                    data: {
                        accountId: input.accountId,
                        calendarEventId: input.id,
                    },
                }
            );

            if (!clientCalendarEvent)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to book this calendar event.' });

            const bookedCalendarEvent = await ctx.prisma.calendarEvent.update({
                where: {
                    id: input.id,
                },
                data: {
                    filled,
                    count,
                    clientCalendarEvents: {
                        connect: {
                            id: clientCalendarEvent.id,
                        },
                    },
                },
            });

            if (!bookedCalendarEvent)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update the calendar event after booking.' });

            return calendarEvent;
        }),
    cancelBooking: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                accountId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const clientCalendarEvent = await ctx.prisma.clientCalendarEvent.findFirst({
                where: {
                    accountId: input.accountId,
                    calendarEventId: input.id
                }
            })

            if (!clientCalendarEvent)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load client calendar event.'});

            const calendarEvent = await ctx.prisma.calendarEvent.findUnique({
                where: {
                    id: input.id
                }
            });

            if (!calendarEvent)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load calendar event.' });

            const count = (calendarEvent.count ?? 0) - 1;
            const filled = false;

            const clientCalendarEventResult = await ctx.prisma.clientCalendarEvent.delete({
                where: {
                    id: clientCalendarEvent.id
                }
            })

            if (!clientCalendarEventResult)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete client calendar event.' });

            const calendarEventResult = await ctx.prisma.calendarEvent.update({
                where: {
                    id: input.id
                },
                data: {
                    ...calendarEvent,
                    count,
                    filled
                }
            });
            

            if (!calendarEventResult)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update calendar event.' });

            return calendarEventResult;
        })
});