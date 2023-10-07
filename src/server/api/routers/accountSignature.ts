import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import z from 'zod';

export const accountSignatureRouter = createTRPCRouter({
    upsert: protectedProcedure
        .input(
            z.object({
                accountId: z.string(),
                signature: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const account = await ctx.prisma.account.findUnique({
                where: {
                    id: input.accountId,
                },
            });

            if (!account) throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find account to update the signature for.' });

            const accountSignature = await ctx.prisma.accountSignature.upsert({
                where: {
                    accountId: input.accountId,
                },
                update: {
                    signature: input.signature,
                },
                create: {
                    account: {
                        connect: {
                            id: account.id,
                        },
                    },
                    signature: input.signature,
                }
            });

            if (!accountSignature.id) 
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update account signature.' });

            return accountSignature;
        }
    ),
    load: protectedProcedure
        .input(
            z.object({
                externalId: z.string().optional(),
                accountId: z.string().optional()
            })
        )
        .query(async ({ ctx, input }) => {
            if (!input.accountId && !input.externalId)
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Request did not pass in an id.' });

            let clientId = input.accountId;
            if (!clientId) {
                const account = await ctx.prisma.account.findUnique({
                    where: {
                        externalId: input.externalId
                    }
                });

                if (!account)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load account from external id.'  });

                clientId = account.id;
            }

            const account = await ctx.prisma.account.findUnique({
                where: {
                    id: clientId,
                },
            });

            if (!account) 
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find account for the signature.' });

            const accountSignature = await ctx.prisma.accountSignature.findUnique({
                where: {
                    accountId: account.id,
                },
            });

            if (!accountSignature) 
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find a signatue.' });

            return accountSignature;
        }
    ),
});