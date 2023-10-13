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

const messageSchema = z
    .object({
        message: z.string().min(2, 'Message must be at least 2 characters.').max(1500, 'Message can not be more then 1500 characters.')
    });

type MessageSchemaType = z.infer<typeof messageSchema>;

const MessageUpdateModal = ({ id, onClose, onRefresh}: Props) => {
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showDeleteError, setShowDeleteError] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting, isDirty, isValid }} = useForm<MessageSchemaType>({
        mode: 'all',
        reValidateMode: 'onSubmit',
        resolver: zodResolver(messageSchema)
    });

    const messageUpdateMutation = api.message.update.useMutation();
    const messageDeleteMutation = api.message.delete.useMutation();
    const messageQuery = api.message.get.useQuery({ id });

    if (messageQuery.isLoading) {
        return <Loading type="Modal" />
    }

    if (messageQuery.isError) {
        return <LoadError type="Modal" />
    }

    const message = messageQuery.data;
 
    const onSubmit = async (message: MessageSchemaType) => {
        const result = await messageUpdateMutation.mutateAsync({
            ...message,
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
        const result = await messageDeleteMutation.mutateAsync({
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
            <div className="flex flex-row justify-center text-3xl py-2 bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 w-full rounded-t-md">Update message</div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4">
                <label className="mb-2">
                    <div className="text-2xl font-light mb-3">Message:</div>
                    <input
                        type="text"
                        defaultValue={message?.message}
                        className="rounded-md border border-slate-700 text-slate-700 py-0 px-2 text-xl w-full"
                        {...register("message")}
                        aria-invalid={Boolean(errors.message)}
                    />
                </label>
                <div className="flex justify-end pr-2 mb-2"><AlertInput type="error" mode="modal">{errors?.message?.message}</AlertInput></div>
                <FormSubmitButtons isDirty={isDirty} isSubmitting={isSubmitting} isValid={isValid} onClose={onCancel} onDelete={onDelete} />
            </form>
            { 
                showErrorAlert &&
                <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Something went wrong updating the message.  Please try again or contact our office.</div>
            }
            {
                showDeleteError &&
                <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Something went wrong deleting the message.  Please try again or contact our office.</div>
            }
        </div>
    )
}

export default MessageUpdateModal;