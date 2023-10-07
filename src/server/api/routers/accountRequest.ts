import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const accountRequestRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                accountId: z.string(),
                contactMethod: z.string(),
                contactTime: z.string(),
                message: z.string().optional(),
                requestStatusId: z.string(),
            })
        )
        .mutation(async ({ctx, input}) => {
            const result = await ctx.prisma.accountRequest.create({
                data: {
                    accountId: input.accountId,
                    contactMethod: input.contactMethod,
                    contactTime: input.contactTime,
                    message: input.message,
                    requestStatusId: input.requestStatusId,
                }
            });

            if (!result.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create account request.' });

            return result;
        }
    ),
});