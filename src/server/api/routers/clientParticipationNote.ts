import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const clientParticipationNoteRouter = createTRPCRouter({
    get: protectedProcedure
        .input(
            z.object({
                accountId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const clientAlert = await ctx.prisma.clientParticipationNotes.findFirst({
                where: {
                    accountId: input.accountId
                }
            });

            return clientAlert;
        }),
    upsert: protectedProcedure
        .input(
            z.object({
                id: z.string().optional(),
                accountId: z.string().optional(),
                note: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!input.id) {
                const participationNote = await ctx.prisma.clientParticipationNotes.create({
                    data: {
                        accountId: input.accountId as string,
                        note: input.note
                    }
                });

                if (!participationNote)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create participation note.'});

                return participationNote;
            }
            else {
                const participationNote = await ctx.prisma.clientParticipationNotes.update({
                    where: {
                        id: input.id
                    },
                    data: {
                        note: input.note
                    }
                });

                if (!participationNote)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update the participation note.' });

                return participationNote;
            }
        })
})