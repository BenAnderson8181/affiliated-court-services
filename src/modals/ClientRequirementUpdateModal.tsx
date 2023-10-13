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
    requirementId: string;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onRefresh: () => void;
}

const clientRequirementSchema = z
    .object({
        requiredAmount: z.number() // z.string().refine((value) => isNaN(+value))
    });

type ClientRequirementSchemaType = z.infer<typeof clientRequirementSchema>;

const ClientRequirementUpdateModal = ({ requirementId, onClose, onRefresh}: Props) => {
    const [showError, setShowError] = useState(false);
    const [showDeleteError, setShowDeleteError] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting, isDirty, isValid }} = useForm<ClientRequirementSchemaType>({
        mode: 'all',
        reValidateMode: 'onSubmit',
        resolver: zodResolver(clientRequirementSchema)
    });

    const clientRequirementMutation = api.clientRequirement.update.useMutation();
    const clientRequirementDeleteMutation = api.clientRequirement.delete.useMutation();
    const clientRequirementQuery = api.clientRequirement.get.useQuery({ id: requirementId });

    if (clientRequirementQuery.isLoading) {
        return <Loading type="Modal" />
    }

    if (clientRequirementQuery.isError) {
        return <LoadError type="Modal" />
    }

    const clientRequirement = clientRequirementQuery.data;

    const onSubmit = async (event: ClientRequirementSchemaType) => {
        const result = await clientRequirementMutation.mutateAsync({
            id: requirementId,
            requiredAmount: +event.requiredAmount
        })
        .catch((err) => {
            setShowError(true);
            console.error(err);
        });

        if (result) {
            onRefresh();
            onClose(false);
        }
    }

    const onDelete = async () => {
        const result = await clientRequirementDeleteMutation.mutateAsync({
            id: requirementId
        })
        .catch((err) => {
            setShowDeleteError(true);
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
            <div className="flex flex-row justify-center text-3xl py-2 bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 w-full rounded-t-md">Create Client Requirement</div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4">
                <label className="flex justify-between mb-2">
                    <div className="text-2xl font-light inline">Required Amount:</div>
                    <input
                        type="number"
                        defaultValue={clientRequirement?.requiredAmount}
                        className="rounded-md border border-slate-700 text-slate-700 py-0 px-2 text-xl"
                        {...register("requiredAmount", {
                            setValueAs: (v: string) => v === "" ? undefined : parseInt(v, 10),
                          })}
                        aria-invalid={Boolean(errors.requiredAmount)}
                    />
                </label>
                <div className="flex justify-end pr-2 mb-2"><AlertInput type="error" mode="modal">{errors?.requiredAmount?.message}</AlertInput></div>
                <label className="flex justify-between mb-2">
                    <div className="text-2xl font-light inline">Type:</div>
                    <div className="text-slate-700 py-0 px-2 text-xl">{clientRequirement?.requirementType.name}</div>
                </label>
                <FormSubmitButtons isDirty={isDirty} isSubmitting={isSubmitting} isValid={isValid} onClose={onCancel} onDelete={onDelete} />
            </form>
            {
                showError &&
                <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Something went wrong updating the requirement.  Please try again or contact IT.</div>
            }
             {
                showDeleteError &&
                <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Something went wrong deleting the requirement.  Please try again or contact IT.</div>
            }
        </div>
    )
}

export default ClientRequirementUpdateModal;