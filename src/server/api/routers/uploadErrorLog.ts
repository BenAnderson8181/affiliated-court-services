import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import z from "zod";

export const uploadErrorLogRouter = createTRPCRouter({
    create: publicProcedure
        .input(
            z.object({
                accountId: z.string(),
                url: z.string(),
                error: z.string(),
            })
        )
        .mutation(async ({ctx, input}) => {
            const errorLog = await ctx.prisma.uploadErrorLog.create({
                data: {
                    accountId: input.accountId,
                    url: input.url,
                    error: input.error,
                }
            });

            if (!errorLog)
                return new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create error log'});

            return errorLog;
        }
    ),
})