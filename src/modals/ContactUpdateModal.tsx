import { api } from "~/utils/api";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertInput } from "~/utils/alert";
import FormSubmitButtons from "~/components/FormSubmitButtons";
import Loading from "~/components/Loading";
import phoneRegex from "~/utils/phoneValidation";
import LoadError from "~/components/LoadError";

type Props = {
    contactId: string;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onRefresh: () => void;
}

const contactSchema = z
    .object({
        firstName: z.string().min(2, { message: 'First name is required.' }).max(25),
        lastName: z.string().min(2, { message: 'Last name is required.' }).max(25),
        phone: z.string().refine((value) => phoneRegex.test(value), { message: 'Valid phone number is required.' }),
        email: z.string().email(),
        agency: z.string(),
        agentTypeId: z.string()
    });

type ContactSchemaType = z.infer<typeof contactSchema>;

const ContactUpdateModal = ({ contactId, onClose, onRefresh}: Props) => {
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [search, setSearch] = useState('');
    const [isInSystem, setIsInSystem] = useState(false);
    const [agentId, setAgentId] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting, isDirty, isValid }} = useForm<ContactSchemaType>({
        mode: 'all',
        reValidateMode: 'onSubmit',
        resolver: zodResolver(contactSchema)
    });

    const contactUpdateMutation = api.contact.update.useMutation();
    const agentTypeQuery = api.agentType.list.useQuery();
    const contactQuery = api.contact.get.useQuery({ id: contactId });
    const contactSearchQuery = api.contact.search.useQuery({ search }, { enabled: search.length > 2 });

    if (agentTypeQuery.isLoading || contactQuery.isLoading) {
        return <Loading type="Modal" />
    }

    if (agentTypeQuery.isError || contactQuery.isError) {
        return <LoadError type="Modal" />
    }

    const agentTypes = agentTypeQuery.data;
    const contact = contactQuery.data;
    const searchResults = contactSearchQuery.data;

    const onSubmit = async(contact: ContactSchemaType) => {
        const _agentId = agentId.length > 4 ? agentId : undefined;

        const result = await contactUpdateMutation.mutateAsync({
            ...contact,
            id: contactId,
            isInSystem,
            agentId: _agentId
        })
        .catch((err) => {
            setShowErrorAlert(true);
            console.error(err);
        });

        if (result) {
            onRefresh();
            onClose(false);
        }
    }

    const onCancel = () => {
        onClose(false);
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '')
            return null;

        setSearch(() => e.target.value);
    }

    const handleSearchResultClick = (id: string) => {
        setIsInSystem(true);
        setAgentId(() => id);
    }

    return (
        <div className="h-full w-full p-0 flex flex-col">
            <div className="flex flex-row justify-center text-3xl py-2 bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 w-full rounded-t-md">Update Contact</div>
            <label className="flex justify-between mt-4 px-4 pb-3 border-b-2 border-b-purple-800">
                <p className="text-2xl font-light inline">Contact:</p>
                <input
                    type="text"
                    className="rounded-md border border-slate-700 text-slate-700 py-0 px-2 text-xl"
                    onChange={handleSearchChange}
                />
            </label>
            {
                searchResults != undefined && searchResults?.length > 0 &&
                <div className="p-3 border-b-2 border-b-purple-900 bg-slate-100">
                    {
                        searchResults.map((sr) => (
                            <button 
                                key={sr.id}
                                className="cursor-pointer text-xl"
                                onClick={() => handleSearchResultClick(sr.id)}
                            >
                                {sr.firstName}&nbsp;{sr.lastName},&nbsp;{sr.email}
                            </button>
                        ))
                    }
                </div>
            }
            <form onSubmit={handleSubmit(onSubmit)} className="p-4">
                <label className="flex justify-between mb-2">
                    <div className="text-2xl font-light inline">First Name:</div>
                    <input
                        type="text"
                        placeholder="First Name"
                        defaultValue={contact?.firstName}
                        className="rounded-md border border-slate-700 text-slate-700 py-0 px-2 text-xl"
                        {...register("firstName")}
                        aria-invalid={Boolean(errors.firstName)}
                    />
                </label>
                <div className="flex justify-end pr-2 mb-2"><AlertInput type="error" mode="modal">{errors?.firstName?.message}</AlertInput></div>
                <label className="flex justify-between mb-2">
                    <div className="text-2xl font-light inline">Last Name:</div>
                    <input
                        type="text"
                        placeholder="Last Name"
                        defaultValue={contact?.lastName}
                        className="rounded-md border border-slate-700 text-slate-700 py-0 px-2 text-xl"
                        {...register("lastName")}
                        aria-invalid={Boolean(errors.lastName)}
                    />
                </label>
                <div className="flex justify-end pr-2 mb-2"><AlertInput type="error" mode="modal">{errors?.lastName?.message}</AlertInput></div>
                <label className="flex justify-between mb-2">
                    <div className="text-2xl font-light inline">Phone:</div>
                    <input
                        type="text"
                        placeholder="(888)888-8888"
                        defaultValue={contact?.phone}
                        className="rounded-md border border-slate-700 text-slate-700 py-0 px-2 text-xl"
                        {...register("phone")}
                        aria-invalid={Boolean(errors.agency)}
                    />
                </label>
                <div className="flex justify-end pr-2 mb-2"><AlertInput type="error" mode="modal">{errors?.phone?.message}</AlertInput></div>
                <label className="flex justify-between mb-2">
                    <div className="text-2xl font-light inline">Email:</div>
                    <input
                        type="text"
                        placeholder="example@example.com"
                        defaultValue={contact?.email}
                        className="rounded-md border border-slate-700 text-slate-700 py-0 px-2 text-xl"
                        {...register("email")}
                        aria-invalid={Boolean(errors.email)}
                    />
                </label>
                <div className="flex justify-end pr-2 mb-2"><AlertInput type="error" mode="modal">{errors?.email?.message}</AlertInput></div>
                <label className="flex justify-between mb-2">
                    <div className="text-2xl font-light inline">Agency:</div>
                    <input
                        type="text"
                        placeholder="Parole office, DCFS, Court etc..."
                        defaultValue={contact?.agency}
                        className="rounded-md border border-slate-700 text-slate-700 py-0 px-2 text-xl"
                        {...register("agency")}
                        aria-invalid={Boolean(errors.agency)}
                    />
                </label>
                <div className="flex justify-end pr-2 mb-2"><AlertInput type="error" mode="modal">{errors?.agency?.message}</AlertInput></div>
                <label className="flex justify-between mb-2">
                    <div className="text-2xl font-light inline">Agent Type:</div>
                    <select
                        className="rounded-md border border-slate-700 text-slate-700 py-0 px-2 text-xl"
                        {...register("agentTypeId")}
                        defaultValue={contact?.agentTypeId ?? undefined}
                    >
                        {
                            agentTypes?.map(({id, name}) => (
                                <option key={id} value={id}>{name}</option>
                            ))
                        }
                    </select>

                </label>
                <FormSubmitButtons isDirty={isDirty} isSubmitting={isSubmitting} isValid={isValid} onClose={onCancel} />
            </form>
            {
                showErrorAlert &&
                <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Something went wrong updating the contact.  Please try again or contact our office.</div>
            }
        </div>
    )
}

export default ContactUpdateModal;