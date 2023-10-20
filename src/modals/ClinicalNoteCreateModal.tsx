import { api } from "~/utils/api";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertInput } from "~/utils/alert";
import FormSubmitButtons from "~/components/FormSubmitButtons";

type Props = {
    accountId: string;
    externalId: string;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onRefresh: () => void;
}

const clinicalNoteSchema = z
    .object({
        note: z.string().min(2, 'Note must be at least 2 charactes.').max(1500, 'Note must not be more then 1500 characters.')
    });

type ClinicalNoteSchemaType = z.infer<typeof clinicalNoteSchema>;

const ClinicalNoteCreateModal = ({ accountId, externalId, onClose, onRefresh}: Props) => {
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting, isDirty, isValid }} = useForm<ClinicalNoteSchemaType>({
        mode: 'all',
        reValidateMode: 'onSubmit',
        resolver: zodResolver(clinicalNoteSchema)
    });

    const clinicalNoteCreateMutation = api.clinicalNote.create.useMutation();

    const onSubmit = async (note: ClinicalNoteSchemaType) => {
        const result = await clinicalNoteCreateMutation.mutateAsync({
            ...note,
            clientId: accountId,
            externalId
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
            <div className="flex flex-row justify-center text-3xl py-2 bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 w-full rounded-t-md">Add Clinical Note</div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4">
                <label className="mb-2">
                    <div className="text-2xl font-light mb-3">Note:</div>
                    <input
                        type="text"
                        placeholder="Type message here"
                        className="rounded-md border border-slate-700 text-slate-700 py-0 px-2 text-xl w-full"
                        {...register("note")}
                        aria-invalid={Boolean(errors.note)}
                    />
                </label>
                <div className="flex justify-end pr-2 mb-2"><AlertInput type="error" mode="modal">{errors?.note?.message}</AlertInput></div>
                <FormSubmitButtons isDirty={isDirty} isSubmitting={isSubmitting} isValid={isValid} onClose={onCancel} />
            </form>
            {
                showErrorAlert &&
                <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Something went wrong creating the clinical note.  Please try again or contact our office.</div>
            }
        </div>
    )
}

export default ClinicalNoteCreateModal;