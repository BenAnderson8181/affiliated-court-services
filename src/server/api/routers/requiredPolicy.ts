import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

export const requiredPoliciesRouter = createTRPCRouter({
    list: publicProcedure
        .query(async ({ctx}) => {
            const requiredPolicies = await ctx.prisma.requiredPolicies.findMany();

            if (!requiredPolicies)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find required policies.' });
                
            return requiredPolicies; 
        }
    ),
})