import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import z from 'zod';

export const demographicRouter = createTRPCRouter({
    update: protectedProcedure
        .input(
            z.object({
                demographic: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const demographic = await ctx.prisma.demographic.findFirst();

            if (!demographic?.id)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find demographic.' });

            let data: { [k: string]: number } = {};

            switch (input.demographic) {
                case 'native':
                    data = {'native': (demographic?.native ?? 0) + 1 }
                    break;

                case 'asian':
                    data = {'asian': (demographic?.asian ?? 0) + 1 }
                    break;

                case 'black':
                    data = {'black': (demographic?.black ?? 0) + 1 }
                    break;

                case 'hispanic':
                    data = {'hispanic': (demographic?.black ?? 0) + 1 }
                    break;

                case 'islander':
                    data = {'islander': (demographic?.black ?? 0) + 1 }
                    break;

                case 'white':
                    data = {'white': (demographic?.black ?? 0) + 1 }
                    break;

                case 'multi':
                    data = {'multi': (demographic?.black ?? 0) + 1 }
                    break;

                default:
                    data = {'not': (demographic?.not ?? 0) + 1 }
                    break;
            }

            const updatedDemographic = await ctx.prisma.demographic.update({
                where: {
                    id: demographic.id
                },
                data: {
                    ...data
                }
            });

            if (!updatedDemographic)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update demographic data.' });

            return updatedDemographic;
        })
})