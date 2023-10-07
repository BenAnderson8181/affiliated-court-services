import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const incidentTypeRouter = createTRPCRouter({
    list: publicProcedure
        .query(async ({ctx}) => {
            const incidentTypes = await ctx.prisma.incidentType.findMany();

            if (!incidentTypes)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find any incident types.' });

            return incidentTypes;
        }
    )
})