import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import z from 'zod';

export const documentLogRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                accountId: z.string(),
                url: z.string(),
                action: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const documentLog = await ctx.prisma.documentLog.create({
                data: {
                    account: {
                        connect: {
                            id: input.accountId,
                        },
                    },
                    url: input.url,
                    action: input.action,
                },
            });

            if (!documentLog)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create document log.' });

            return documentLog;
        }
    ),
});