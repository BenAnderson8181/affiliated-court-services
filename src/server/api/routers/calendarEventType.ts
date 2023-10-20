import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const calendarEventTypeRouter = createTRPCRouter({
    list: publicProcedure
        .query(async ({ctx}) => {
            const calendarEventTypes = await ctx.prisma.calendarEventType.findMany();

            if (!calendarEventTypes)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find calendar event types.' });

            return calendarEventTypes;
        })
});