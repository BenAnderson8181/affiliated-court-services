import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import z from "zod";

import phoneRegex from "~/utils/phoneValidation";

export const accountRouter = createTRPCRouter({
    findAccountByExternalId: publicProcedure
        .input(
            z.object({
                externalId: z.string()
            })
        )
        .query(async ({ctx, input}) => {
            const account = await ctx.prisma.account.findUnique({
                where: {
                    externalId: input.externalId
                },
                include: {
                    location: true,
                    accountType: true,
                    accountStatus: true,
                    state: true
                }
            });

            if (!account)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load account.'});

            return account;
        }
    ),
    findById: publicProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const account = await ctx.prisma.account.findUnique({
                where: {
                    id: input.id
                },
                include: {
                    location: true,
                    accountType: true,
                    accountStatus: true,
                    state: true
                }
            });

            if (!account)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load account.'});

            return account;
        }
    ),
    createClient: protectedProcedure
        .input(
            z.object({
                externalId: z.string(),
                preferredName: z.string().min(4).optional().or(z.literal('')),
                firstName: z.string().min(2).max(25),
                lastName: z.string().min(2).max(25),
                middleInitial: z.string().max(1).optional().or(z.literal('')),
                phone: z.string().refine((value) => phoneRegex.test(value)),
                birthDay: z.date().min(new Date(1920, 0, 1))
                    .max(new Date())
                    .refine(date => {
                        const ageDifMs = Date.now() - date.getTime();
                        const ageDate = new Date(ageDifMs);
                        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
                        return age >= 18;
                    }),
                referringAgency: z.string().optional(),
                locationId: z.string(),
                preferText: z.boolean().default(false),
                address: z.string().min(4),
                address2: z.string().min(2).optional().or(z.literal('')),
                city: z.string().min(2),
                stateId: z.string(),
                zip: z.string().regex(/(^\d{5}(?:[\s]?[-\s][\s]?\d{4})?$)/),
                accountStatusId: z.string(),
                accountTypeId: z.string(),
                email: z.string().email(),
            })
        )
        .mutation(async ({ctx, input}) => {
            const accountTypes = await ctx.prisma.accountType.findMany();
            const adminId = accountTypes.find((accountType) => accountType.name === 'Admin')?.id;
            const employeeId = accountTypes.find((accountType) => accountType.name === 'Employee')?.id;
            const clinicalDirectorId = accountTypes.find((accountType) => accountType.name === 'Clinical Director')?.id;
            const clinicianId = accountTypes.find((accountType) => accountType.name === 'Clinician')?.id;

            // if the account being created is not a public type (client/agent) we need to authorize the transaction
            if (input.accountTypeId === adminId || input.accountTypeId === employeeId || input.accountTypeId === clinicalDirectorId || input.accountTypeId === clinicianId) {
                // find the account for the user making the request
                const user = await ctx.prisma.account.findUnique({
                    where: {
                        email: ctx.user?.emailAddresses?.find((p) => p.id === ctx.user?.primaryEmailAddressId)?.emailAddress
                    }
                });

                if (!user)
                    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Failed to find user to determine if this account can be created here.' });

                // if the user is not an admin or clinical director, they cannot create an account for any non public type
                if (user.accountTypeId !== adminId && user.accountTypeId !== clinicalDirectorId)
                    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Can not create employee accounts here.  Please use the create employee end point.' });
            }

            const result = await ctx.prisma.account.create({data: {...input}});

            if (!result.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create client account.' });

            return result;
        }),
    createAgent: protectedProcedure
        .input(
            z.object({
                externalId: z.string(),
                preferredName: z.string().min(4).optional().or(z.literal('')),
                firstName: z.string().min(2).max(25),
                lastName: z.string().min(2).max(25),
                middleInitial: z.string().max(1).optional().or(z.literal('')),
                phone: z.string().refine((value) => phoneRegex.test(value)),
                preferText: z.boolean().default(false),
                agency: z.string().min(2),
                agencyPhone: z.string().refine((value) => phoneRegex.test(value)),
                agentTypeId: z.string(),
                accountTypeId: z.string(),
                accountStatusId: z.string(),
                email: z.string().email(),
            })
        )
        .mutation(async ({ctx, input}) => {
            const accountTypes = await ctx.prisma.accountType.findMany();
            const adminId = accountTypes.find((accountType) => accountType.name === 'Admin')?.id;
            const employeeId = accountTypes.find((accountType) => accountType.name === 'Employee')?.id;
            const clinicalDirectorId = accountTypes.find((accountType) => accountType.name === 'Clinical Director')?.id;
            const clinicianId = accountTypes.find((accountType) => accountType.name === 'Clinician')?.id;

            // if the account being created is not a public type (client/agent) we need to authorize the transaction
            if (input.accountTypeId === adminId || input.accountTypeId === employeeId || input.accountTypeId === clinicalDirectorId || input.accountTypeId === clinicianId) {
                // find the account for the user making the request
                const user = await ctx.prisma.account.findUnique({
                    where: {
                        email: ctx.user?.emailAddresses?.find((p) => p.id === ctx.user?.primaryEmailAddressId)?.emailAddress
                    }
                });

                if (!user)
                    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Failed to find user to verify if account can be created here.' });

                // if the user is not an admin or clinical director, they cannot create an account for any non public type
                if (user.accountTypeId !== adminId && user.accountTypeId !== clinicalDirectorId)
                    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Can not create employee accounts here.  Please use the create employee end point.' });
            }

            const result = await ctx.prisma.account.create({data: {...input}});

            if (!result.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create agent account.' });

            return result;
        }),
    createEmployee: protectedProcedure
        .input(
            z.object({
                externalId: z.string(),
                preferredName: z.string().min(4).optional().or(z.literal('')),
                firstName: z.string().min(2).max(25),
                lastName: z.string().min(2).max(25),
                middleInitial: z.string().max(1).optional().or(z.literal('')),
                phone: z.string().refine((value) => phoneRegex.test(value)),
                birthDay: z.date().min(new Date(1920, 0, 1))
                    .max(new Date())
                    .refine(date => {
                        const ageDifMs = Date.now() - date.getTime();
                        const ageDate = new Date(ageDifMs);
                        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
                        return age >= 18;
                    }),
                referringAgency: z.string().optional(),
                locationId: z.string(),
                preferText: z.boolean().default(false),
                address: z.string().min(4),
                address2: z.string().min(2).optional().or(z.literal('')),
                city: z.string().min(2),
                stateId: z.string(),
                zip: z.string().regex(/(^\d{5}(?:[\s]?[-\s][\s]?\d{4})?$)/),
                accountStatusId: z.string(),
                accountTypeId: z.string(),
                email: z.string().email(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // const accountTypes = await ctx.prisma.accountType.findMany();
            // const adminId = accountTypes.find((accountType) => accountType.name === 'Admin')?.id;
            // const employeeId = accountTypes.find((accountType) => accountType.name === 'Employee')?.id;
            // const clinicalDirectorId = accountTypes.find((accountType) => accountType.name === 'Clinical Director')?.id;
            // const clinicianId = accountTypes.find((accountType) => accountType.name === 'Clinician')?.id;

            // once we have our admin accounts created re-add this code
            // // if the account being created is not a public type (client/agent) we need to authorize the transaction
            // if (input.accountTypeId === adminId || input.accountTypeId === employeeId || input.accountTypeId === clinicalDirectorId || input.accountTypeId === clinicianId) {
            //     // find the account for the user making the request
            //     const user = await ctx.prisma.account.findUnique({
            //         where: {
            //             email: ctx.user?.emailAddresses?.find((p) => p.id === ctx.user?.primaryEmailAddressId)?.emailAddress
            //         }
            //     });

            //     if (!user)
            //         throw new TRPCError({ code: 'UNAUTHORIZED' });

            //     // if the user is not an admin or clinical director, they cannot create an account for any non public type
            //     if (user.accountTypeId !== adminId && user.accountTypeId !== clinicalDirectorId)
            //         throw new TRPCError({ code: 'UNAUTHORIZED' });
            // }

            const result = await ctx.prisma.account.create({data: {...input}});

            if (!result.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create new employee.' });

            return result;
        }),
    clientList: protectedProcedure
        .query(async ({ ctx }) => {
            const accountTypes = await ctx.prisma.accountType.findMany();
            const clientId = accountTypes.filter((at) => at.name === 'Client');

            if (!clientId)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find client account type to use as a filter.' })

            const clients = await ctx.prisma.account.findMany({
                where: {
                    accountTypeId: clientId[0]?.id
                },
                include: {
                    accountStatus: true
                }
            })

            if (!clients)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to find clients.'});

            return clients;
        }),
    delete: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ctx, input}) => {
            const result = await ctx.prisma.account.delete({
                where: {
                    id: input.id
                }
            });

            if (!result.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete account.' });

            return result;
        }),
    search: protectedProcedure
        .input(
            z.object({
                search: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            if (input.search.length < 2)
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Please send a longer search string to help find the client.'});

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

            const agentType = accountTypes.find((a) => a.name === 'Client');

            if (!agentType)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find account type client.' });

            const clients = await ctx.prisma.account.findMany({
                take: 5,
                where: {
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
                }
            });

            return clients;
        }),
    updateClient: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                preferredName: z.string().min(4).optional().or(z.literal('')),
                firstName: z.string().min(2).max(25),
                lastName: z.string().min(2).max(25),
                middleInitial: z.string().max(1).optional().or(z.literal('')),
                phone: z.string().refine((value) => phoneRegex.test(value)),
                birthDay: z.date().min(new Date(1920, 0, 1))
                    .max(new Date())
                    .refine(date => {
                        const ageDifMs = Date.now() - date.getTime();
                        const ageDate = new Date(ageDifMs);
                        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
                        return age >= 18;
                    }),
                referringAgency: z.string().optional(),
                locationId: z.string(),
                preferText: z.boolean().default(false),
                address: z.string().min(4),
                address2: z.string().min(2).optional().or(z.literal('')),
                city: z.string().min(2),
                stateId: z.string(),
                zip: z.string().regex(/(^\d{5}(?:[\s]?[-\s][\s]?\d{4})?$)/),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const client = await ctx.prisma.account.update({
                where: { id: input.id },
                data: { ...input }
            });

            if (!client)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update client account.' });

            return client;
        })
});