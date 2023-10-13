import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { AlertInput } from "~/utils/alert";
import { api } from "~/utils/api";
import phoneRegex from "~/utils/phoneValidation";

const employeeCreationSchema = z
    .object({
        preferredName: z.string().min(4, 'Preferred name must be at least 4 characters or empty.').optional().or(z.literal('')),
        firstName: z.string().min(2, { message: 'First name is required.' }).max(25),
        lastName: z.string().min(2, { message: 'Last name is required.' }).max(25),
        middleInitial: z.string().max(1, 'Middle Initial should only be 1 letter.').optional().or(z.literal('')),
        phone: z.string().refine((value) => phoneRegex.test(value), { message: 'Valid phone number is required.' }),
        birthDay: z.coerce.date()
            .min(new Date(1920, 0, 1), { message: 'Birthday must be prior to January 1 1920.' })
            .max(new Date(), { message: 'Birthday must be not be in the future.' })
            .refine(date => {
                const ageDifMs = Date.now() - date.getTime();
                const ageDate = new Date(ageDifMs);

                const age = Math.abs(ageDate.getUTCFullYear() - 1970);

                return age >= 18;
            }, { message: 'Client must be 18 years or older.' })
            .transform((date) => new Date(date)),
        // referringAgency: z.string().optional(),
        accountTypeId: z.string(),
        locationId: z.string().min(8, { message: 'Please select a location.' }),
        preferText: z.boolean().default(false).transform((value) => value ? true : false),
        address: z.string().min(4, { message: 'Address is required.  If you have no permanent address please enter Unknown.' }),
        address2: z.string().min(2, 'Address 2 must be at least 2 characters or empty.').optional().or(z.literal('')),
        city: z.string().min(2, { message: 'City is required.' }),
        stateId: z.string().min(8, { message: 'Please select a state.' }),
        zip: z.string().regex(/(^\d{5}(?:[\s]?[-\s][\s]?\d{4})?$)/, { message: 'Valid zip code is required.'})
    });

type EmployeeAccountFormType = z.infer<typeof employeeCreationSchema>;

const AccountCreationEmployee: NextPage = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting, isDirty, isValid } } = useForm<EmployeeAccountFormType>({
        mode: 'all',
        reValidateMode: 'onSubmit',
        resolver: zodResolver(employeeCreationSchema),
        defaultValues: {
            preferredName: '',
            firstName: '',
            lastName: '',
            middleInitial: '',
            phone: '',
            // referringAgency: '',
            accountTypeId: '-1',
            locationId: '-1',
            preferText: false,
            address: '',
            address2: '',
            city: '',
            stateId: '-1',
            zip: ''
        }
    });

    const { user } = useUser();
    const router = useRouter();
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSetupAlert, setShowSetupAlert] = useState(false);

    const createAccount = api.account.createEmployee.useMutation();
    const accountTypesQuery = api.accountType.list.useQuery();
    const accountStatusesQuery = api.accountStatus.list.useQuery();
    const statesQuery = api.state.list.useQuery();
    const locationQuery = api.location.list.useQuery();

    if (accountTypesQuery.isLoading || accountStatusesQuery.isLoading || statesQuery.isLoading || locationQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (accountTypesQuery.isError || accountStatusesQuery.isError || statesQuery.isError || locationQuery.isError) {
        return <LoadError type='Page' />
    }

    const accountTypes = accountTypesQuery.data;
    const filteredAccountTypes = accountTypes?.filter((at) => at.name === 'Employee' || at.name === 'Clinician' || at.name === 'Clinical Director')
    const accountStatuses = accountStatusesQuery.data;
    const states = statesQuery.data;
    const locations = locationQuery.data;

    const onSubmit = async (account: EmployeeAccountFormType) => {
        const pendingStatusId = accountStatuses?.find(x => x.name === 'Pending')?.id;
        const clerkId = user?.id;

        if (!pendingStatusId || !clerkId) {
            setShowSetupAlert(true);
            return;
        }

        const result = await createAccount.mutateAsync({
            ...account,
            externalId: clerkId,
            email: user?.primaryEmailAddress?.emailAddress ?? '',
            accountStatusId: pendingStatusId,
        })
        .catch((err) => {
            setShowErrorAlert(true);
            console.error(err);
        });

        if (result?.id) {
            router.push('/account/policies/eSignature').catch((err) => console.error(err));
        }
    }

    const onBack = () => {
        router.push('/').catch((err) => console.error(err));
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100">
        <h1 className="text-4xl font-thin mt-5">Create Employee</h1>
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
                        <div className="text-2xl font-light">Location:</div>
                        <select
                            className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                            {...register("locationId")}
                            aria-invalid={Boolean(errors.locationId)}
                        >
                            <option value="-1">-- Please select a location --</option>
                            {
                                locations?.map(({id, name}) => (
                                    <option key={id} value={id}>{name}</option>
                                ))
                            }
                        </select>
                        <AlertInput type="error">{errors?.locationId?.message}</AlertInput>
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
                        <div className="text-2xl font-light">Address:</div>
                        <input
                            type="text"
                            className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                            placeholder="Address"
                            {...register("address")}
                            aria-invalid={Boolean(errors.address)}
                        />
                        <AlertInput type="error">{errors?.address?.message}</AlertInput>
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
                        <div className="text-2xl font-light">Address&nbsp;2:</div>
                        <input
                            type="text"
                            className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                            placeholder="Address 2"
                            {...register("address2")}
                            aria-invalid={Boolean(errors.address2)}
                        />
                        <AlertInput type="error">{errors?.address2?.message}</AlertInput>
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
                        <div className="text-2xl font-light">City:</div>
                        <input
                            type="text"
                            className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                            placeholder="City"
                            {...register("city")}
                            aria-invalid={Boolean(errors.city)}
                        />
                        <AlertInput type="error">{errors?.city?.message}</AlertInput>
                    </label>
                    <label>
                        <div className="text-2xl font-light">Date&nbsp;of&nbsp;Birth:</div>
                        <input
                            type="date"
                            className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                            {...register("birthDay")}
                            aria-invalid={Boolean(errors.birthDay)}
                        />
                        <AlertInput type="error">{errors?.birthDay?.message}</AlertInput>
                    </label>
                    <label>
                        <div className="text-2xl font-light">State:</div>
                        <select
                            className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                            {...register("stateId")}
                            aria-invalid={Boolean(errors.stateId)}
                        >
                            <option value="-1">-- Please select a state --</option>
                            {
                                states?.map(({id, name}) => (
                                    <option key={id} value={id}>{name}</option>
                                ))
                            }
                        </select>
                        <AlertInput type="error">{errors?.stateId?.message}</AlertInput>
                    </label>
                    <label>
                        <div className="text-2xl font-light">Account type:</div>
                        <select
                            className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                            {...register("accountTypeId")}
                            aria-invalid={Boolean(errors.accountTypeId)}
                        >
                            <option value="-1">-- Please select an account type --</option>
                            {
                                filteredAccountTypes?.map(({id, name}) => (
                                    <option key={id} value={id}>{name}</option>
                                ))
                            }
                        </select>
                    </label>
                    {/* <label>
                        <div className="text-2xl font-light">Referring&nbsp;Agency:</div>
                        <input
                            type="text"
                            placeholder="Referring Agency"
                            className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                            {...register("referringAgency")}
                        />
                    </label> */}
                    <label>
                        <div className="text-2xl font-light">Zip:</div>
                        <input
                            type="text"
                            className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                            placeholder="Zip"
                            {...register("zip")}
                            aria-invalid={Boolean(errors.zip)}
                        />
                        <AlertInput type="error">{errors?.zip?.message}</AlertInput>
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
                    <div className="flex justify-start mt-8">
                        <button className="px-5 py-2 text-slate-100 bg-red-500 duration-300 hover:opacity-50 rounded-lg cursor-pointer" onClick={onBack}>Back</button>
                        <input
                            type="submit"
                            disabled={isSubmitting || !isDirty || !isValid}
                            className="rounded border border-slate-200 text-slate-200 ml-2 px-5 py-2 duration-300 hover:opacity-50 cursor-pointer"
                        />
                    </div>
                </div>
            </form>
        </div>
        { showErrorAlert &&
            <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">Something went wrong creating the account.  Please contact your clinical director for assistance.</div>
        }
        { showSetupAlert &&
            <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">Something went wrong with the preset data.  Please contact your clinical director for assistance.</div>
        }
    </div>
    );
}

export default AccountCreationEmployee;