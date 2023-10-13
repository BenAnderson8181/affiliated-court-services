import { api } from "~/utils/api";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertInput } from "~/utils/alert";
import Loading from "~/components/Loading";
import FormSubmitButtons from "~/components/FormSubmitButtons";
import LoadError from "~/components/LoadError";

type Props = {
    id: string;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onRefresh: () => void;
}

const clinicalNoteSchema = z
    .object({
        note: z.string().min(2, 'Note must be at least 2 characters.').max(1500, 'Note can not be more then 1500 characters.')
    });

type ClinicalNoteSchemaType = z.infer<typeof clinicalNoteSchema>;

const ClinicalNoteUpdateModal = ({ id, onClose, onRefresh}: Props) => {
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showDeleteError, setShowDeleteError] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting, isDirty, isValid }} = useForm<ClinicalNoteSchemaType>({
        mode: 'all',
        reValidateMode: 'onSubmit',
        resolver: zodResolver(clinicalNoteSchema)
    });

    const clinicalNoteUpdateMutation = api.clinicalNote.update.useMutation();
    const clinicalNoteDeleteMutation = api.clinicalNote.delete.useMutation();
    const clinicalNoteQuery = api.clinicalNote.get.useQuery({ id });

    if (clinicalNoteQuery.isLoading) {
        return <Loading type="Modal" />
    }

    if (clinicalNoteQuery.isError) {
        return <LoadError type="Modal" />
    }

    const clinicalNote = clinicalNoteQuery.data;
 
    const onSubmit = async (note: ClinicalNoteSchemaType) => {
        const result = await clinicalNoteUpdateMutation.mutateAsync({
            ...note,
            id
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

    const onDelete = async () => {
        const result = await clinicalNoteDeleteMutation.mutateAsync({
            id
        })
        .catch((err) => {
            console.error(err);
            setShowDeleteError(true);
        })

        if (result) {
            onRefresh();
            onClose(false);
        }
    }

    return (
        <div className="h-full w-full p-0 flex flex-col">
            <div className="flex flex-row justify-center text-3xl py-2 bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 w-full rounded-t-md">Update Clinical Note</div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4">
                <label className="mb-2">
                    <div className="text-2xl font-light mb-3">Note:</div>
                    <input
                        type="text"
                        defaultValue={clinicalNote?.note}
                        className="rounded-md border border-slate-700 text-slate-700 py-0 px-2 text-xl w-full"
                        {...register("note")}
                        aria-invalid={Boolean(errors.note)}
                    />
                </label>
                <div className="flex justify-end pr-2 mb-2"><AlertInput type="error" mode="modal">{errors?.note?.message}</AlertInput></div>
                <FormSubmitButtons isDirty={isDirty} isSubmitting={isSubmitting} isValid={isValid} onClose={onCancel} onDelete={onDelete} />
            </form>
            { 
                showErrorAlert &&
                <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Something went wrong updating the clinical note.  Please try again or contact IT.</div>
            }
            {
                showDeleteError &&
                <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Something went wrong deleting the clinical note.  Please try again or contact IT.</div>
            }
        </div>
    )
}

export default ClinicalNoteUpdateModal;