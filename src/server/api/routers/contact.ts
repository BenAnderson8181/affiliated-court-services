import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from 'zod';

export const contactRouter = createTRPCRouter({
    list: protectedProcedure
        .input(
            z.object({
                accountId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const contacts = await ctx.prisma.contact.findMany({
                where: {
                    clientId: input.accountId
                }
            });

            return contacts;
        }),
    get: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const contact = await ctx.prisma.contact.findFirst({
                where: {
                    id: input.id
                },
                include: {
                    agentType: true
                }
            });

            if (!contact)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find contact.'});

            return contact;
        }),
    search: protectedProcedure
        .input(
            z.object({
                search: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            if (input.search.length < 2)
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Please send a longer string to help find the account.' });

            let firstName = '';
            let lastName = '';

            if (input.search.includes(' ')) {
                firstName = input.search.split(' ')[0] ?? '';
                lastName = input.search.split(' ')[1] ?? '';
            }
            else {
                firstName = input.search;
                lastName = input.search;
            }

            const accountTypes = await ctx.prisma.accountType.findMany();

            const agentType = accountTypes.find((a) => a.name === 'Agent');

            if (!agentType)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find account type agent.' });

            const agents = await ctx.prisma.account.findMany({
                take: 5,
                where: {
                    // accountTypeId: agentType.id,
                    OR: [
                            {
                                firstName: {
                                    contains: firstName,
                                },
                            },
                            {
                                lastName: {
                                    contains: lastName
                                }
                            }
                        ],              
                },
            });

            return agents;
        }),
    create: protectedProcedure
        .input(
            z.object({
                clientId: z.string(),
                agentId: z.string().optional(),
                firstName: z.string(),
                lastName: z.string(),
                phone: z.string(),
                email: z.string(),
                agency: z.string(),
                agentTypeId: z.string(),
                isInSystem: z.boolean()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const contact = await ctx.prisma.contact.create({
                data: {
                    ...input
                }
            });

            if (!contact) 
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create contact.' });

            return contact;
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                agentId: z.string().optional(),
                firstName: z.string(),
                lastName: z.string(),
                phone: z.string(),
                email: z.string(),
                agency: z.string(),
                agentTypeId: z.string(),
                isInSystem: z.boolean()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const contact = await ctx.prisma.contact.findFirst({
                where: {
                    id: input.id
                }
            });

            if (!contact)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find contact.' });

            const _isInSystem = contact.isInSystem === false ? input.isInSystem : true;

            const updatedContact = await ctx.prisma.contact.update({
                where: {
                    id: input.id
                },
                data: {
                    ...input,
                    isInSystem: _isInSystem
                }
            });

            if (!updatedContact)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update contact.' });

            return updatedContact;
        }),
    delete: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const contact = await ctx.prisma.contact.delete({
                where: {
                    id: input.id
                }
            });

            if (!contact)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete contact.' });

            return contact;
        })
})