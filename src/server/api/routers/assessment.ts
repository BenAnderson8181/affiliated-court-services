import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const assessmentRouter = createTRPCRouter({
    list: protectedProcedure
        .query(async ({ctx}) => {
            const assessments = await ctx.prisma.assessment.findMany();

            if (!assessments)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find assessments.' });

            return assessments;
        }
    ),
});