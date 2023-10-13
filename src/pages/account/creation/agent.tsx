import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { AlertInput } from "~/utils/alert";
import { api } from "~/utils/api";

import phoneRegex from "~/utils/phoneValidation";

const accountSchema = z
    .object({
        preferredName: z.string().min(4, 'Preferred name must be at least 4 characters or empty.').optional().or(z.literal('')),
        firstName: z.string().min(2, { message: 'First name is required.' }).max(25),
        lastName: z.string().min(2, { message: 'Last name is required.' }).max(25),
        middleInitial: z.string().max(1, 'Middle Initial should only be 1 letter.').optional().or(z.literal('')),
        phone: z.string().refine((value) => phoneRegex.test(value), { message: 'Valid phone number is required.' }),
        preferText: z.boolean().default(false).transform((value) => value ? true : false),
        agency: z.string().min(3, {message: 'Agency name is required.'}).max(50, {message: 'Agency name must be less than 50 characters.'}),
        agencyPhone: z.string().refine((value) => phoneRegex.test(value), { message: 'Valid phone number is required.' }),
        agentTypeId: z.string().min(8, 'Agent type is required.'),
        contactMethod: z.string().min(5, 'Contact method is required.'),
        contactTime: z.string().min(5, 'Contact time is required.'),
        message: z.string().optional(),
    });

type AccountFormType = z.infer<typeof accountSchema>;

const AccountCreationAgent: NextPage = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting, isDirty, isValid } } = useForm<AccountFormType>({
        mode: "all",
        reValidateMode: "onSubmit",
        resolver: zodResolver(accountSchema),
        defaultValues: {
            preferredName: '',
            firstName: '',
            lastName: '',
            middleInitial: '',
            phone: '',
            preferText: false,
        }
    });

    const { user } = useUser();
    const router = useRouter();

    const [showRequestErrorAlert, setShowRequestErrorAlert] = useState(false);

    const createAccount = api.account.createAgent.useMutation();
    const createAccountRequest = api.accountRequest.create.useMutation();
    const deleteAccount = api.account.delete.useMutation();

    const accountTypesQuery = api.accountType.list.useQuery();
    const accountStatusesQuery = api.accountStatus.list.useQuery();
    const agentTypeQuery = api.agentType.list.useQuery();
    const requestStatusQuery = api.requestStatus.list.useQuery();

    if (accountTypesQuery.isLoading || accountStatusesQuery.isLoading || agentTypeQuery.isLoading || requestStatusQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (accountTypesQuery.isError || accountStatusesQuery.isError || agentTypeQuery.isError || requestStatusQuery.isError) {
        return <LoadError type='Page' />
    }

    const accountTypes = accountTypesQuery.data;
    const accountStatuses = accountStatusesQuery.data;
    const agentTypes = agentTypeQuery.data;
    const requestStatuses = requestStatusQuery.data;

    const onSubmit = async (account: AccountFormType) => {
        const accountAgentTypeId = accountTypes?.find(x => x.name === 'Agent')?.id;
        const pendingStatusId = accountStatuses?.find(x => x.name === 'Pending')?.id;
        const pendingRequestStatusId = requestStatuses?.find(x => x.name === 'Pending')?.id;
        const clerkId = user?.id;

        // may need to throw here if we don't have the right data or show an error message
        if (!accountAgentTypeId || !pendingStatusId || !pendingRequestStatusId || clerkId === undefined)
            return;

        const accountInfo = (({contactMethod, contactTime, message, ...a}) => { 
            console.log(contactMethod, contactTime, message)
            return a;
        }
            )(account);
        const requestInfo = { contactMethod: account.contactMethod, contactTime: account.contactTime, message: account.message};

        const result = await createAccount.mutateAsync({
            ...accountInfo,
            externalId: clerkId,
            email: user?.primaryEmailAddress?.emailAddress ?? '',
            accountTypeId: accountAgentTypeId,
            accountStatusId: pendingStatusId,
        })
        .catch((err) => {
            setShowRequestErrorAlert(true);
            console.error('Create Account Error: ', err);
        });

        // if we don't have a valid account id then we don't want to make a request
        if (result?.id) {
            const requestResult = await createAccountRequest.mutateAsync({
                ...requestInfo,
                accountId: result.id,
                requestStatusId: pendingRequestStatusId,
            })
            .catch((err) => {
                setShowRequestErrorAlert(true);
                console.error('Create Request Error: ', err);

                // if we have an error we want to delete the account we just created
                deleteAccount.mutateAsync({ 
                    id: result.id
                })
                .catch((err) => {
                    setShowRequestErrorAlert(true);
                    console.error('Clean Up Account Error: ', err);
                })
            });

            if (requestResult?.id)
                router.push('/account/creation').catch((err) => console.error(err));
        }
    }

    const onBack = () => {
        // TODO: Determine what aggreements they need to sign and redirect to the agent agreement flow
        router.push('/account/creation').catch((err) => console.error(err));
    }
    
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100">
            <h1 className="text-4xl font-thin my-5">Create Account</h1>
            <p className="mb-3 italic">When requesting an account as an agent please be aware one of our Clinical Directors will first need to contact you and your agency to ensure you are who you say you are.</p>
            <p className="mb-3 italic">After your account is approved you can start making requests to have access to the progress on one of our client&apos;s that you are working with.</p>
            <div className="w-1/2 text-start border border-indigo-700 rounded-sm mt-5">
                <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                    <div className="w-full grid grid-cols-2 gap-x-16 gap-y-3">
                        <label>
                            <div className="text-2xl font-light">Preferred&nbsp;Name:</div>
                            <input
                                type="text"
                                placeholder="Preferred Name"
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                {...register("preferredName")}
                            />
                            <AlertInput type="error">{errors?.preferredName?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light">First&nbsp;Name:</div>
                            <input
                                type="text"
                                placeholder="First Name"
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                {...register("firstName")}
                                aria-invalid={Boolean(errors.firstName)}
                            />
                            <AlertInput type="error">{errors?.firstName?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light">Last&nbsp;Name:</div>
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                {...register("lastName")}
                                aria-invalid={Boolean(errors.lastName)}
                            />
                            <AlertInput type="error">{errors?.lastName?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light">Middle&nbsp;Initial:</div>
                            <input
                                type="text"
                                placeholder="Middle Initial"
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                {...register("middleInitial")}
                                aria-invalid={Boolean(errors.middleInitial)}
                            />
                            <AlertInput type="error">{errors?.middleInitial?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light">Phone:</div>
                            <input
                                type="text"
                                placeholder="Phone"
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                {...register("phone")}
                                aria-invalid={Boolean(errors.phone)}
                            />
                            <AlertInput type="error">{errors?.phone?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light inline">Prefer&nbsp;Text:</div>
                            <input
                                type="checkbox"
                                className="rounded-md border w-10 border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                {...register("preferText")}
                            />
                            <div className="text-xl italic">Checking this box means you prefer text over email.</div>
                        </label>
                        <label>
                            <div className="text-2xl font-light">Agency:</div>
                            <input
                                type="text"
                                placeholder="Agency"
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                {...register("agency")}
                                aria-invalid={Boolean(errors.agency)}
                            />
                            <AlertInput type="error">{errors?.agency?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light">Agency&nbsp;Phone:</div>
                            <input
                                type="text"
                                placeholder="Agency Phone"
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                {...register("agencyPhone")}
                                aria-invalid={Boolean(errors.agencyPhone)}
                            />
                            <AlertInput type="error">{errors?.agencyPhone?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light">Agent&nbsp;Type:</div>
                            <select
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                {...register("agentTypeId")}
                                aria-invalid={Boolean(errors.agentTypeId)}
                            >
                                <option value="-1">-- Please select an agent type --</option>
                                {agentTypes?.map((accountType) => (
                                    <option key={accountType.id} value={accountType.id}>{accountType.name}</option>
                                ))}
                            </select>
                            <AlertInput type="error">{errors?.agentTypeId?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light">Contact&nbsp;Method:</div>
                            <select
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                {...register("contactMethod")}
                                aria-invalid={Boolean(errors.contactMethod)}
                            >
                                <option value="-1">-- Please select a contact method --</option>
                                <option value="Email">Email</option>
                                <option value="Phone">Phone</option>
                                <option value="Text">Text</option>
                            </select>
                            <AlertInput type="error">{errors?.contactMethod?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light">Contact&nbsp;Time:</div>
                            <select
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                {...register("contactTime")}
                                aria-invalid={Boolean(errors.contactTime)}
                            >
                                <option value="-1">-- Please select a contact time --</option>
                                <option value="Morning">Morning</option>
                                <option value="Afternoon">Afternoon</option>
                                <option value="Evening">Evening</option>
                                <option value="Weekend">Weekend</option>
                                <option value="Anytime">Anytime</option>
                            </select>
                            <AlertInput type="error">{errors?.contactTime?.message}</AlertInput>
                        </label>
                        <label>
                            <div className="text-2xl font-light">Message:</div>
                            <textarea
                                placeholder="Message"
                                className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                                {...register("message")}
                                aria-invalid={Boolean(errors.message)}
                            />
                            <AlertInput type="error">{errors?.message?.message}</AlertInput>
                        </label>
                        <div className="flex justify-start mt-8">
                            <button className="px-5 py-2 text-slate-100 bg-red-500 duration-300 hover:opacity-50 rounded-lg cursor-pointer" onClick={onBack}>Back</button>
                            <input
                                type="submit"
                                disabled={isSubmitting || !isDirty || !isValid}
                                className="rounded border border-slate-200 text-slate-200 ml-2 px-5 py-2 duration-300 hover:opacity-50 cursor-pointer"
                                value="Request"
                            />
                        </div>
                    </div>
                </form>
            </div>
            { showRequestErrorAlert &&
                <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">Something went wrong with the request.  Please contact our office at 8018881234 for assistance</div>
            }
        </div>
    );
}

export default AccountCreationAgent;