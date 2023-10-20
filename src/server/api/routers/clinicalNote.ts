import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from 'zod';

export const clinicalNoteRouter = createTRPCRouter({
    list: protectedProcedure
        .input(
            z.object({
                clientId: z.string()
            })
        )
        .query(async ({ ctx, input}) => {
            const clinicalNotes = await ctx.prisma.clinicalNote.findMany({
                where: {
                    clientId: input.clientId
                }
            });

            return clinicalNotes;
        }),
    get: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const clinicalNote = await ctx.prisma.clinicalNote.findFirst({
                where: {
                    id: input.id
                },
                include: {
                    clinician: true
                }
            });

            if (!clinicalNote)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get clinical note.' });

            return clinicalNote;
        }),
    create: protectedProcedure
        .input(
            z.object({
                note: z.string(),
                clientId: z.string(),
                externalId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const clinician = await ctx.prisma.account.findFirst({
                where: {
                    externalId: input.externalId
                }
            });

            if (!clinician)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find account for clinician.' });

            const clinicalNote = await ctx.prisma.clinicalNote.create({
                data: {
                    note: input.note,
                    clientId: input.clientId,
                    clinicianId: clinician.id
                }
            });

            if (!clinicalNote)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create clinical note.' });

            return clinicalNote;
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                note: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const clinicalNote = await ctx.prisma.clinicalNote.update({
                where: {
                    id: input.id
                },
                data: {
                    note: input.note
                }
            });

            if (!clinicalNote)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update clinical note.' });

            return clinicalNote;
        }),
    delete: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const clinicalNote = await ctx.prisma.clinicalNote.delete({
                where: {
                    id: input.id
                }
            });

            if (!clinicalNote)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete clinical note.' });

            return clinicalNote;
        })
})