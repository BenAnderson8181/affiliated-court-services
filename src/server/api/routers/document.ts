import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";
import { useUser } from "@clerk/nextjs";

export const documentRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                accountId: z.string(),
                documentTypeId: z.string(),
                url: z.string(),
            })
        )
        .mutation(async ({ctx, input}) => {
            const document = await ctx.prisma.document.create({
                data: {
                    account: {
                        connect: {
                            id: input.accountId
                        }
                    },
                    url: input.url,
                    documentType: {
                        connect: {
                            id: input.documentTypeId
                        }
                    }
                }
            });

            if (!document)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create document record.' });

            return document;
        }
    ),
    delete: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ctx, input}) => {
            const document = await ctx.prisma.document.delete({
                where: {
                    id: input.id
                }
            });

            if (!document.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete document record.' });

            return document;
        }
    ),
    get: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                accountId: z.string()
            })
        )
        .query(async ({ctx, input}) => {
            const document = await ctx.prisma.document.findUnique({
                where: {
                    id: input.id
                }
            });

            if (!document)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find a document record for this request.' });

            // if the document is not associated with the account making the request, throw an error
            // unless the user is staff
            const { user } = useUser();

            const account = await ctx.prisma.account.findUnique({
                where: {
                    externalId: user?.id
                }
            });

            if (!account)
                throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Authentication failed for this request.' });

            const accountTypes = await ctx.prisma.accountType.findMany();

            let isStaff = false;

            if (accountTypes.find((accountType) => accountType.name === 'Admin')?.id === account.accountTypeId ||
                accountTypes.find((accountType) => accountType.name === 'Employee')?.id === account.accountTypeId ||
                accountTypes.find((accountType) => accountType.name === 'Clinical Director')?.id === account.accountTypeId ||
                accountTypes.find((accountType) => accountType.name === 'Clinician')?.id === account.accountTypeId)
                isStaff = true;

            if (document.accountId !== input.accountId && !isStaff)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Only the account that uploaded this document may retrieve it.' });

            return document;
        }
    ),
});