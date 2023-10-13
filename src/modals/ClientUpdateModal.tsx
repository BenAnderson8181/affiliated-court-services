
import { api } from "~/utils/api";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertInput } from "~/utils/alert";
import Loading from "~/components/Loading";
import FormSubmitButtons from "~/components/FormSubmitButtons";
import LoadError from "~/components/LoadError";
import phoneRegex from "~/utils/phoneValidation";

type Props = {
    id: string;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onRefresh: () => void;
}

const accountSchema = z
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
        referringAgency: z.string().optional(),
        locationId: z.string().min(8, { message: 'Please select a location.' }),
        preferText: z.boolean().default(false).transform((value) => value ? true : false),
        address: z.string().min(4, { message: 'Address is required.  If you have no permanent address please enter Unknown.' }),
        address2: z.string().min(2, 'Address 2 must be at least 2 characters or empty.').optional().or(z.literal('')),
        city: z.string().min(2, { message: 'City is required.' }),
        stateId: z.string().min(8, { message: 'Please select a state.' }),
        zip: z.string().regex(/(^\d{5}(?:[\s]?[-\s][\s]?\d{4})?$)/, { message: 'Valid zip code is required.'}) //.min(5, { message: 'Zip is required.' })
    });

type AccountFormType = z.infer<typeof accountSchema>;

const ClientUpdateModal = ({ id, onClose, onRefresh}: Props) => {
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting, isDirty, isValid }} = useForm<AccountFormType>({
        mode: 'all',
        reValidateMode: 'onSubmit',
        resolver: zodResolver(accountSchema)
    });

    const accountQuery = api.account.findById.useQuery({ id });
    const statesQuery = api.state.list.useQuery();
    const locationQuery = api.location.list.useQuery();
    const accountUpdateMutation = api.account.updateClient.useMutation();

    if (accountQuery.isLoading || statesQuery.isLoading || locationQuery.isLoading) {
        return <Loading type="Modal" />
    }

    if (accountQuery.isError || statesQuery.isError || locationQuery.isError) {
        return <LoadError type="Modal" />
    }

    const account = accountQuery.data;
    const states = statesQuery.data;
    const locations = locationQuery.data;

    const onSubmit = async (client: AccountFormType) => {
        const result = await accountUpdateMutation.mutateAsync({
            ...client,
            id
        })
        .catch((err) => {
            setShowErrorAlert(true);
            console.error(err);
            return;
        });

        if (result) {
            onRefresh();
            onClose(false);
        }
    }

    const onCancel = () => {
        onClose(false);
    }

    return (
        <div className="h-full w-full p-0 flex flex-col">
            <div className="flex flex-row justify-center text-3xl py-2 bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 w-full rounded-t-md">Update Clinical Note</div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4">
                <div className="w-full grid grid-cols-2 gap-x-16 gap-y-3">
                    <label>
                        <div className="text-2xl font-light">Preferred&nbsp;Name:</div>
                        <input
                            type="text"
                            placeholder="Preferred Name"
                            className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                            defaultValue={account?.preferredName ?? ''}
                            {...register("preferredName")}
                        />
                        <AlertInput type="error">{errors?.preferredName?.message}</AlertInput>
                    </label>
                    <label>
                        <div className="text-2xl font-light">Location:</div>
                        <select
                            className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                            defaultValue={account?.locationId ?? '-1'}
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
                            defaultValue={account?.firstName ?? ''}
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
                            defaultValue={account?.address ?? ''}
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
                            defaultValue={account?.lastName ?? ''}
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
                            defaultValue={account?.address2 ?? ''}
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
                            defaultValue={account?.middleInitial ?? ''}
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
                            defaultValue={account?.city ?? ''}
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
                            defaultValue={account.birthDay != null ? account.birthDay.toISOString().slice(0,10) : ''}
                            {...register("birthDay")}
                            aria-invalid={Boolean(errors.birthDay)}
                        />
                        <AlertInput type="error">{errors?.birthDay?.message}</AlertInput>
                    </label>
                    <label>
                        <div className="text-2xl font-light">State:</div>
                        <select
                            className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                            defaultValue={account?.stateId ?? '-1'}
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
                        <div className="text-2xl font-light">Referring&nbsp;Agency:</div>
                        <input
                            type="text"
                            placeholder="Referring Agency"
                            className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                            defaultValue={account?.referringAgency ?? ''}
                            {...register("referringAgency")}
                        />
                    </label>
                    <label>
                        <div className="text-2xl font-light">Zip:</div>
                        <input
                            type="text"
                            className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                            placeholder="Zip"
                            defaultValue={account?.zip ?? ''}
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
                            defaultValue={account?.phone ?? ''}
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
                            // defaultValue={account?.preferText?.valueOf.toString() ?? 'false'}
                            defaultChecked={account?.preferText ?? false}
                            {...register("preferText")}
                        />
                        <div className="text-xl italic">Checking this box means you prefer text over email.</div>
                    </label>
                    <FormSubmitButtons isDirty={isDirty} isSubmitting={isSubmitting} isValid={isValid} onClose={onCancel} />
                </div>
            </form>
            { 
                showErrorAlert &&
                <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Something went wrong updating the account.  Please try again or call 888-888-8888.</div>
            }
        </div>
    )
}

export default ClientUpdateModal;