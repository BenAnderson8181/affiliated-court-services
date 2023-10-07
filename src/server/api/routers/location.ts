import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const locationRouter = createTRPCRouter({
    list: publicProcedure
        .query(async ({ctx}) => {
            const locations = await ctx.prisma.location.findMany();

            if (!locations)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find any locations.' });

            return locations;
        }
    ),
})