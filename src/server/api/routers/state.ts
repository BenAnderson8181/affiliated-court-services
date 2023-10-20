import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const stateRouter = createTRPCRouter({
    list: publicProcedure
        .query(async ({ctx}) => {
            const states = await ctx.prisma.state.findMany();

            if (!states)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find states.' });

            return states;
        })
})