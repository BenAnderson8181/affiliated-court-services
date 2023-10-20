import { addMonths, formatISO } from "date-fns";
import { useState } from "react";
import { z } from "zod";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertInput } from "~/utils/alert";
import { useUser } from "@clerk/nextjs";
import Loading from "~/components/Loading";
import LoadError from "~/components/LoadError";

const eventSchema = z
    .object({
        title: z.string()
            .min(3, 'Title must have at least 3 characters.'),
        description: z.string()
            .min(5, 'Description must be at least 5 characters long or be empty.')
            .optional()
            .or(z.literal('')),
        start: z.coerce.date()
            .min(new Date(), { message: 'Event start must not be before today.' })
            .max(addMonths(new Date(), 1), { message: 'Event start can not be more then 1 month out.' }),
        end: z.coerce.date(),
        calendarEventTypeId: z.string(),
        locationId: z.string(),
        url: z.string().optional(),
        repeat: z.boolean()
            .default(false)
            .transform((value) => value ? true : false),
    })
    .refine((data) => data.end > data.start, {
        message: "End date cannot be earlier than start date.",
        path: ["end"],
    });

type EventSchemaType = z.infer<typeof eventSchema>;

const EventDetailCreateModal = ({ onClose, onRefetch }: { onClose: React.Dispatch<React.SetStateAction<boolean>>, onRefetch: () => void }) => {
    const { user } = useUser();
    const [showCreateAlert, setShowCreateAlert] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting, isDirty, isValid }} = useForm<EventSchemaType>({
        mode: 'all',
        reValidateMode: 'onSubmit',
        resolver: zodResolver(eventSchema),
    });

    const calendarEventCreateMutation = api.calendarEvent.create.useMutation();
    const calendarEventTypesQuery = api.calendarEventType.list.useQuery();
    const locationsQuery = api.location.list.useQuery();

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        return <LoadError type="Modal" />
        
    if (calendarEventTypesQuery.isLoading || locationsQuery.isLoading) {
        return <Loading type='Modal' />
    }

    if (calendarEventTypesQuery.isError || locationsQuery.isError) {
        return <LoadError type="Modal" />
    }

    const calendarEventTypes = calendarEventTypesQuery.data;
    const locations = locationsQuery.data;

    const onSubmit = async (event: EventSchemaType) => {
        const result = await calendarEventCreateMutation.mutateAsync({
            ...event,
            externalId: userId
        })
        .catch((err) => {
            setShowCreateAlert(true);
            console.error(err);
        });

        if (result) {
            onRefetch();
            onClose(false);
        } 
    }

    const onCancel = () => {
        onClose(false);
    }

    return (
        <div className="h-full w-full p-0 flex flex-col">
            <div className="flex flex-row justify-center text-3xl py-2 bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 w-full rounded-t-md">Update Event Detail</div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4">
                <label className="flex justify-between mb-2">
                    <div className="text-2xl font-light inline">Title:</div>
                    <input
                        type="text"
                        placeholder="Title"
                        className="rounded-md border border-slate-700 text-slate-700 py-0 px-2 text-xl"
                        {...register("title")}
                        aria-invalid={Boolean(errors.title)}
                    />
                </label>
                <div className="flex justify-end pr-2 mb-2"><AlertInput type="error" mode="modal">{errors?.title?.message}</AlertInput></div>
                <label className="flex justify-between mb-2">
                    <div className="text-2xl font-light inline">Description:</div>
                    <input
                        type="text"
                        placeholder="Description"
                        className="rounded-md border border-slate-400 text-slate-700 py-0 px-2 text-xl"
                        {...register("description")}
                        aria-invalid={Boolean(errors.description)}
                    />
                </label>
                <div className="flex justify-end pr-2 mb-2"><AlertInput type="error" mode="modal">{errors?.description?.message}</AlertInput></div>
                <label className="flex justify-between mb-2">
                    <div className="text-2xl font-light inline">Start:</div>
                    <input
                        type="datetime-local"
                        className="rounded-md border border-slate-400 text-slate-700 py-0 px-2 text-xl"
                        defaultValue={formatISO(new Date).slice(0,16)}
                        {...register("start")}
                        aria-invalid={Boolean(errors.start)}
                    />
                </label>
                <div className="flex justify-end pr-2 mb-2"><AlertInput type="error" mode="modal">{errors?.start?.message}</AlertInput></div>
                <label className="flex justify-between mb-2">
                    <div className="text-2xl font-light inline">End:</div>
                    <input
                        type="datetime-local"
                        className="rounded-md border border-slate-400 text-slate-700 py-0 px-2 text-xl"
                        defaultValue={formatISO(new Date).slice(0, 16)}
                        {...register("end")}
                        aria-invalid={Boolean(errors.end)}
                    />
                </label>
                <div className="flex justify-end pr-2 mb-2"><AlertInput type="error" mode="modal">{errors?.end?.message}</AlertInput></div>
                <label className="flex justify-between mb-2">
                    <div className="text-2xl font-light inline">Type:</div>
                    <select
                        className="rounded-md border border-slate-400 text-slate-700 py-0 px-2 text-xl"
                        {...register("calendarEventTypeId")}
                    >
                        {
                            calendarEventTypes?.map(({id, name}) => (
                                <option key={id} value={id}>{name}</option>
                            ))
                        }
                    </select>
                </label>
                <label className="flex justify-between mb-2">
                    <div className="text-2xl font-light inline">Location:</div>
                    <select
                        className="rounded-md border border-slate-400 text-slate-700 py-0 px-2 text-xl"
                        {...register("locationId")}
                    >
                        {
                            locations?.map(({id, name}) => (
                                <option key={id} value={id}>{name}</option>
                            ))
                        }
                    </select>
                </label>
                <label className="flex justify-between mb-2">
                    <div className="text-2xl font-light inline">URL:</div>
                    <input
                        type="text"
                        className="rounded-md border border-slate-400 text-slate-700 py-0 px-2 text-xl"
                        placeholder="URL for meeting"
                        {...register("url")}
                        aria-invalid={Boolean(errors.url)}
                    />
                </label>
                <div className="flex justify-end pr-2 mb-2"><AlertInput type="error" mode="modal">{Boolean(errors.url)}</AlertInput></div>
                <label>
                    <div className="text-2xl font-light inline mr-2">Repeat:</div>
                    <input
                        type="checkbox"
                        className="rounded-md border border-slate-400 text-slate-700 py-0 px-2 text-xl w-12 h-5 translate-y-1"
                        {...register("repeat")}
                    />
                </label>
                <div className="flex justify-start mt-8">
                    <button className="px-5 py-2 text-slate-100 bg-orange-500 duration-300 hover:opacity-50 rounded-lg cursor-pointer" onClick={onCancel}>Cancel</button>
                    <input
                        type="submit"
                        disabled={isSubmitting || !isDirty || !isValid}
                        className="rounded border border-indigo-700 text-indigo-700 ml-2 px-5 py-2 duration-300 hover:opacity-50 cursor-pointer"
                    />
                </div>
            </form>
            { 
                showCreateAlert &&
                <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Something went wrong creating the event.  Please try again or contact IT.</div>
            }
        </div>
    )
}

export default EventDetailCreateModal;