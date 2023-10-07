import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const accountPolicyRouter = createTRPCRouter({
    upsert: protectedProcedure
        .input(
            z.object({
                accountId: z.string(),
                policyId: z.string(),
                signed: z.boolean(),
                rejected: z.boolean().optional()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const accountPolicy = await ctx.prisma.accountPolicies.findFirst({
                where: {
                    accountId: input.accountId,
                    policyId: input.policyId,
                },
            });

            if (accountPolicy) {
                const updatedAccountPolicy = await ctx.prisma.accountPolicies.update({
                    where: {
                        id: accountPolicy.id,
                    },
                    data: {
                        signed: input.signed,
                        rejected: input.rejected ?? false
                    },
                });

                if (!updatedAccountPolicy)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update policy.' });

                return updatedAccountPolicy;
            }

            const createdAccountPolicy = await ctx.prisma.accountPolicies.create({
                data: {
                    account: {
                        connect: {
                            id: input.accountId,
                        },
                    },
                    policy: {
                        connect: {
                            id: input.policyId,
                        },
                    },
                    signed: input.signed,
                    rejected: input.rejected ?? false
                },
            });

            if (!createdAccountPolicy)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create policy.' });

            return createdAccountPolicy;
        }
    ),
    list: protectedProcedure
        .input(
            z.object({
                accountId: z.string().optional(),
                externalId: z.string().optional()
            })
        )
        .query(async ({ctx, input}) => {
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

             const accountPolicies = await ctx.prisma.accountPolicies.findMany({
                where: {
                    accountId: clientId
                },
                include: {
                    policy: true
                }
            });

            if (!accountPolicies)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find any account policies.' });
                
            return accountPolicies;
        }
    ),
});
    