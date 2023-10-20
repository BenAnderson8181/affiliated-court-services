import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const discountPriceRouter = createTRPCRouter({
    list: protectedProcedure
        .input(
            z.object({
                accountId: z.string()
            })
        )
    .query(async ({ ctx, input }) => {
        const discountPrices = await ctx.prisma.discountPrice.findMany({
            where: {
                accountId: input.accountId
            },
            include: {
                price: true
            }
        });

        return discountPrices;
    }),
    get: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
    .query(async ({ ctx, input}) => {
        const discountPrice = await ctx.prisma.discountPrice.findFirst({
            where: {
                id: input.id
            },
            include: {
                price: true
            }
        });

        if (!discountPrice)
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get discount price.' });

        return discountPrice;
    }),
    create: protectedProcedure
        .input(
            z.object({
                priceId: z.string(),
                discountPrice: z.number(),
                accountId: z.string(),
                expirationDate: z.date()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const discountPrice = await ctx.prisma.discountPrice.create({
                data: {
                    ...input
                }
            });

            if (!discountPrice)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create discount price.' });

            return discountPrice;
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                discountPrice: z.number(),
                expirationDate: z.date()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const discountPrice = await ctx.prisma.discountPrice.update({
                where: {
                    id: input.id
                },
                data: {
                    discountPrice: input.discountPrice,
                    expirationDate: input.expirationDate
                }
            });

            if (!discountPrice)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update discount price.' });

            return discountPrice;
        }),
    delete: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const discountPrice = await ctx.prisma.discountPrice.delete({
                where: {
                    id: input.id
                }
            });

            if (!discountPrice)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete discount price.' });

            return discountPrice;
        })
})