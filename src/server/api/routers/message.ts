import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from 'zod';

export const messageRouter = createTRPCRouter({
    list: protectedProcedure
        .input(
            z.object({
                accountId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const messages = await ctx.prisma.message.findMany({
                where: {
                    accountId: input.accountId
                }
            })

            return messages;
        }),
    get: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const message = await ctx.prisma.message.findFirst({
                where: {
                    id: input.id
                }
            });

            if (!message)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load message.' });

            return message;
        }),
    create: protectedProcedure
        .input(
            z.object({
                message: z.string(),
                accountId: z.string(),
                externalId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const message = await ctx.prisma.message.create({
                data: {
                    message: input.message,
                    accountId: input.accountId,
                    externalId: input.externalId
                }
            })

            if (!message)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create message.'});

            return message;
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                message: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const message = await ctx.prisma.message.update({
                where: {
                    id: input.id
                },
                data: {
                    message: input.message
                }
            })

            if (!message)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update message.'});

            return message;
        }),
    delete: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const message = await ctx.prisma.message.delete({
                where: {
                    id: input.id
                }
            });

            if (!message)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete message.' });

            return message;
        })
})