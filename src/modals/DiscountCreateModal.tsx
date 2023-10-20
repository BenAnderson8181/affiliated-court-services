import { api } from "~/utils/api";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertInput } from "~/utils/alert";
import FormSubmitButtons from "~/components/FormSubmitButtons";
import Loading from "~/components/Loading";
import LoadError from "~/components/LoadError";
import { addMonths, endOfMonth, formatISO } from "date-fns";

type Props = {
    accountId: string;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onRefresh: () => void;
}

const discountSchema = z
    .object({
        priceId: z.string(),
        discountPrice:  z.string() 
            .transform((discount) => parseInt(discount))
            .pipe(z.number().min(25, { message: 'Discount price can not be less then $25.' })),
        expirationDate: z.coerce.date()
            .min(new Date(), { message: 'Expiration date must not be before today.' })
            .max(endOfMonth(addMonths(new Date(), 3)), { message: 'Expiration date can not be more then 3 month out.' }),
    });

type DiscountSchemaType = z.infer<typeof discountSchema>;

const DiscountCreateModal = ({ accountId, onClose, onRefresh }: Props) => {
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting, isDirty, isValid }} = useForm<DiscountSchemaType>({
        mode: 'all',
        reValidateMode: 'onSubmit',
        resolver: zodResolver(discountSchema)
    });

    const discountCreateMutation = api.discountPrice.create.useMutation();
    const pricesQuery = api.price.list.useQuery();

    if (pricesQuery.isLoading) {
        return <Loading type="Modal" />
    }

    if (pricesQuery.isError) {
        return <LoadError type="Modal" />
    }

    const prices = pricesQuery.data;

    const onSubmit = async (discount: DiscountSchemaType) => {
        const result = await discountCreateMutation.mutateAsync({
            ...discount,
            accountId
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

    return (
        <div className="h-full w-full p-0 flex flex-col">
            <div className="flex flex-row justify-center text-3xl py-2 bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 w-full rounded-t-md">Add Discount Price</div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4">
                <label className="flex justify-between mb-2">
                    <div className="text-2xl font-light inline">Price:</div>
                    <select
                        className="rounded-md border border-slate-700 text-slate-700 py-0 px-2 text-xl"
                        {...register("priceId")}
                    >
                        {
                            prices?.map(({id, name, price}) => (
                                <option key={id} value={id}>{name}&nbsp;-&nbsp;{price}</option>
                            ))
                        }
                    </select>
                </label>
                <label className="flex justify-between mb-2">
                    <div className="text-2xl font-light inline">Discount Price:</div>
                    <input
                        type="number"
                        placeholder="30"
                        className="rounded-md border border-slate-700 text-slate-700 py-0 px-2 text-xl"
                        {...register("discountPrice")}
                        aria-invalid={Boolean(errors.discountPrice)}
                    />
                </label>
                <div className="flex justify-end pr-2 mb-2"><AlertInput type="error" mode="modal">{errors?.discountPrice?.message}</AlertInput></div>
                <label className="flex justify-between mb-2">
                    <div className="text-2xl font-light inline">Expiration Date:</div>
                    <input
                        type="date"
                        className="rounded-md border border-slate-400 text-slate-700 py-0 px-2 text-xl"
                        {...register("expirationDate")}
                        defaultValue={formatISO(new Date).slice(0, 10)}
                        aria-invalid={Boolean(errors.expirationDate)}
                    />
                </label>
                <div className="flex justify-end pr-2 mb-2"><AlertInput type="error" mode="modal">{errors?.expirationDate?.message}</AlertInput></div>
                <FormSubmitButtons isDirty={isDirty} isSubmitting={isSubmitting} isValid={isValid} onClose={onCancel} />
            </form>
            {
                showErrorAlert &&
                <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Something went wrong creating the discount price.  Please try again or contact our office.</div>
            }
        </div>
    )
}

export default DiscountCreateModal;