import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const questionRouter = createTRPCRouter({
    list: protectedProcedure
        .input(
            z.object({
                assessmentURL: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const assessment = await ctx.prisma.assessment.findFirst({
                where: {
                    url: input.assessmentURL,
                },
            });

            if (!assessment)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find assessment.' });

            const questions = await ctx.prisma.question.findMany({
                where: {
                    assessmentId: assessment.id,
                },
            });

            if (!questions || questions.length === 0)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find questions for the assessment.' });

            return questions;
        }),
})