import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormSubmitButtons from "~/components/FormSubmitButtons";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { AlertInput } from "~/utils/alert";
import { api } from "~/utils/api";

type Props = {
    accountId: string;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onRefresh: () => void;
}

const clientRequirementSchema = z
    .object({
        requirementTypeId: z.string(),
        requiredAmount: z.string()
    })
    .refine((data) => {
        const amount = +data.requiredAmount;
        if(isNaN(amount) || amount <= 0)
            return false;
        const type = data.requirementTypeId.split('|')[1];
        switch(type) {
            case 'Aggressive Driving Workshop':
                return amount === 1;
                
            case 'AM Group':
                return amount > 3 && amount < 100;

            case 'Anger Management Workshop':
                return amount === 1;

            case 'Cog Group':
                return amount > 3 && amount < 100;

            case 'Cognitive Restructuring Workshop':
                return amount === 1;

            case 'DV Group':
                return amount > 3 && amount < 100;

            case 'Individual':
                return amount > 1 && amount < 100;

            case 'Orientation Workshop':
                return amount === 1;

            case 'Prime for Life':
                return amount === 1;

            case 'Substance Awareness Workshop':
                return amount === 1;

            case 'SUD Group':
                return amount > 3 && amount < 100;  
        }
    }, { message: 'Not a valid required amount for the type.  Groups should be between 4 and 99.  Individual should be between 2 and 99.  All other types should only be 1.', path: ['requiredAmount'] })

type ClientRequirementSchemaType = z.infer<typeof clientRequirementSchema>;

const ClientRequirementModal = ({ accountId, onClose, onRefresh}: Props) => {
    const [showError, setShowError] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting, isDirty, isValid }} = useForm<ClientRequirementSchemaType>({
        mode: 'all',
        reValidateMode: 'onSubmit',
        resolver: zodResolver(clientRequirementSchema)
    });

    const clientRequirementMutation = api.clientRequirement.create.useMutation();
    const clientPriceMutation = api.clientPrice.create.useMutation();
    const requirementTypesQuery = api.requirementType.list.useQuery();
    const priceQuery = api.price.list.useQuery();

    if (requirementTypesQuery.isLoading || priceQuery.isLoading) {
        return <Loading type='Modal' />
    }

    if (requirementTypesQuery.isError || priceQuery.isError) {
        return <LoadError type="Modal" />
    }

    const requirementTypes = requirementTypesQuery.data;
    const prices = priceQuery.data;

    const onSubmit = async (event: ClientRequirementSchemaType) => {
        const requirementTypeId = event?.requirementTypeId?.split('|')[0] ?? '';
        if (!requirementTypeId || requirementTypeId.length < 8) {
            setShowError(true);
            return;
        }

        const result = await clientRequirementMutation.mutateAsync({
            requirementTypeId,
            requiredAmount: +event.requiredAmount,
            clientId: accountId
        })
        .catch((err) => {
            setShowError(true);
            console.error(err);
        });

        const requirementType = requirementTypes?.find((rt) => rt.id === requirementTypeId);

        if (!requirementType) {
            setShowError(true);
            return;
        }

        let priceId = '';
        let clientPrice = 0;
        if (requirementType.name.includes('Group')) {
            const price = prices?.find((p) => p.name === 'Group');
            priceId = price?.id ?? '';
            clientPrice = price?.price ?? 0;
        }
        else if (requirementType.name.includes('Orientation')) {
            const price = prices?.find((p) => p.name === 'Orientation Workshop');
            priceId = price?.id ?? '';
            clientPrice = price?.price ?? 0;
        }
        else if (requirementType.name === 'Individual') {
            const price = prices?.find((p) => p.name === 'Individual');
            priceId = price?.id ?? '';
            clientPrice = price?.price ?? 0;
        }
        else if (requirementType.name.includes('Workshop')) {
            const price = prices?.find((p) => p.name === 'Workshop');
            priceId = price?.id ?? '';
            clientPrice = price?.price ?? 0;
        }
        else { // Prime for Life
            const price = prices?.find((p) => p.name === 'Prime for Life');
            priceId = price?.id ?? '';
            clientPrice = price?.price ?? 0;
        }

        if (priceId.length === 0 || clientPrice === 0) {
            setShowError(true);
            return;
        }

        const clientPriceResult = await clientPriceMutation.mutateAsync({
            accountId,
            priceId,
            clientPrice
        })
        .catch((err) => {
            setShowError(true);
            console.error(err);
        });

        if (result && clientPriceResult) {
            onClose(false);
            onRefresh();
        }
    }

    const onCancel = () => {
        onClose(false);
    }

    return (
        <div className="h-full w-full p-0 flex flex-col">
            <div className="flex flex-row justify-center text-3xl py-2 bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 w-full rounded-t-md">Create Client Requirement</div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4">
                <label className="flex justify-between mb-2">
                    <div className="text-2xl font-light inline">Required Amount:</div>
                    <input
                        type="number"
                        placeholder="0"
                        className="rounded-md border border-slate-700 text-slate-700 py-0 px-2 text-xl"
                        {...register("requiredAmount")}
                        aria-invalid={Boolean(errors.requiredAmount)}
                    />
                </label>
                <div className="flex justify-end pr-2 mb-2"><AlertInput type="error" mode="modal">{errors?.requiredAmount?.message}</AlertInput></div>
                <label className="flex justify-between mb-2">
                    <div className="text-2xl font-light inline">Type:</div>
                    <select
                        className="rounded-md border border-slate-400 text-slate-700 py-0 px-2 text-xl"
                        {...register("requirementTypeId")}
                    >
                        {
                            requirementTypes?.map(({id, name}) => (
                                <option key={id} value={id + '|' + name}>{name}</option>
                            ))
                        }
                    </select>
                </label>
                <FormSubmitButtons isDirty={isDirty} isSubmitting={isSubmitting} isValid={isValid} onClose={onCancel} />
            </form>
            {
                showError &&
                <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Something went wrong creating the requirement.  Please try again or contact IT.</div>
            }
        </div>
    )
}

export default ClientRequirementModal;