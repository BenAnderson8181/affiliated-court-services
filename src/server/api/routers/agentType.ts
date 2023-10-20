import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const agentTypeRouter = createTRPCRouter({
    list: publicProcedure
        .query(async ({ctx}) => {
            const agentTypes = await ctx.prisma.agentType.findMany();

            if (!agentTypes)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find agent types.' });

            return agentTypes;
        })
});