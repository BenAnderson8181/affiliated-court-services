import type { EventDetail } from "~/types/calendar";
import { format, isBefore } from 'date-fns';
import { api } from "~/utils/api";
import { useState } from "react";
import Modal from "./Modal";
import EventDetailUpdateModal from "./EventDetailUpdateModal";
import Loading from "~/components/Loading";
import LoadError from "~/components/LoadError";
import Link from "next/link";

const EventDetailModal: React.FunctionComponent<EventDetail> = ({accountId, calendarEventTypeName, calendarEventTypeId, capacity, count, description, end, eventId, start, title, isBooked, firstName, lastName, email, onClose, onRefetch, onRefetchBooking}) => {
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showCancelErrorAlert, setShowCancelErrorAlert] = useState(false);
    const [appointmentBookedMessage, setAppointmentBookedMessage] = useState(false);
    const [appointmentCancelledMessage, setAppointmentCancelledMessage] = useState(false);
    const [isBooking, setIsBooking] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [showCancelError, setShowCancelError] = useState(false);
    const [eventDetailUpdateModalIsOpen, setEventDetailUpdateModalIsOpen] = useState(false);

    // console.log('accountType: ', accountType) // Use this for permissions for the buttons

    // This also should check for other details:
    // 1 - For interviews make sure they need to complete an interview currently
    // 4 - For groups make sure they don't book more than amount required
    // 6 - For individial make sure they don't have more than the amount requried
    // Going to add the ability for clinicians to set the number of meetings per week
    // This will save to ClientAccessLimits

    const available = capacity - count;
    const pastStart = isBefore(start, new Date());

    const calendarEventBookMutation = api.calendarEvent.book.useMutation();
    const calendarEventDeleteMutation = api.calendarEvent.delete.useMutation();
    const calendarEventCancelBookingMutation = api.calendarEvent.cancelBooking.useMutation();

    const clientCalendarEventsQuery = api.clientCalendarEvent.clientList.useQuery({ accountId });
    const clientAccessLimitsQuery = api.clientAccessLimit.list.useQuery({ accountId });

    if (clientCalendarEventsQuery.isLoading || clientAccessLimitsQuery.isLoading) {
        return <Loading type='Modal' />
    }

    if (clientCalendarEventsQuery.isError || clientAccessLimitsQuery.isError) {
        return <LoadError type="Modal" />
    }

    const clientCalendarEvents = clientCalendarEventsQuery.data;
    const clientAccessLimits = clientAccessLimitsQuery.data;
    const filteredCalendarEvents = clientCalendarEvents.filter((e) => 
        e.calendarEvent.calendarEventTypeId === calendarEventTypeId
        && e.calendarEvent.end > new Date()
    );

    if (clientAccessLimits === null) {
        // this needs to be handled differently
        return <LoadError type="Modal" />
    }

    const totalGroupsAllowed = clientAccessLimits?.dvGroupsWeek + clientAccessLimits?.suGroupsWeek + clientAccessLimits?.amGroupsWeek + clientAccessLimits?.crGroupsWeek;

    let atMaxAllowed = false;

    switch (calendarEventTypeName) {
        case 'Interview':
            if (filteredCalendarEvents.length > 0) {
                atMaxAllowed = true;
            }
            break;

        case 'Individual':
            if (filteredCalendarEvents.length >= clientAccessLimits.individualsWeek) {
                atMaxAllowed = true;
            }
            break;

        case 'Group':
            if (filteredCalendarEvents.length >= totalGroupsAllowed) {
                atMaxAllowed = true;
            }
            break;

        case 'SU Group':
            if (filteredCalendarEvents.length >= clientAccessLimits.suGroupsWeek) {
                atMaxAllowed = true;
            }
            break;

        case 'DV Group':
            if (filteredCalendarEvents.length >= clientAccessLimits.dvGroupsWeek) {
                atMaxAllowed = true;
            }
            break;

        case 'AM Group':
            if (filteredCalendarEvents.length >= clientAccessLimits.amGroupsWeek) {
                atMaxAllowed = true;
            }
            break;

        case 'CR Group':
            if (filteredCalendarEvents.length >= clientAccessLimits.crGroupsWeek) {
                atMaxAllowed = true;
            }
            break;
    }

    const handleBooking = async () => {
        if (!isBooking) {
            setIsBooking(true);
            const result = await calendarEventBookMutation.mutateAsync({
                id: eventId,
                accountId
            })
            .catch((err) => {
                setShowErrorAlert(true);
                console.error(err);
                return;
            });
    
            if (result) {
                await fetch('/api/email/booked', {
                    method: 'POST',
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        accountId,
                        email,
                        appointmentDate: new Date(start),
                        time: `${start.getHours.toString()}:${start.getMinutes.toString()}`,
                        appointmentType: calendarEventTypeName
                    })
                });

                onRefetch();
                onRefetchBooking();
                setAppointmentBookedMessage(true);
            }
        }
    }

    const handleCancelBooking = async () => {
        if (!isCancelling) {
            setIsCancelling(true);
            const result = await calendarEventCancelBookingMutation.mutateAsync({
                id: eventId,
                accountId
            })
            .catch((err) => {
                setShowCancelErrorAlert(true);
                console.error(err);
            });

            if (result) {
                await fetch('/api/email/cancelled', {
                    method: 'POST',
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        accountId,
                        email,
                        appointmentDate: new Date(start),
                        time: `${start.getHours.toString()}:${start.getMinutes.toString()}`,
                        appointmentType: calendarEventTypeName
                    })
                });

                onRefetch();
                onRefetchBooking();
                setAppointmentCancelledMessage(true);
            }
        }
    }

    const handleEdit = () => {
       setEventDetailUpdateModalIsOpen(true);
    }

    const handleDelete = async () => {
        const result = await calendarEventDeleteMutation.mutateAsync({
            id: eventId
        })
        .catch((err) => {
            setShowCancelError(true);
            console.error(err);
        });

        if (result) {
            onRefetch();
            onClose(false);
        } 
    }

    return (
        <div className="h-fit min-h-96 w-full p-0 flex flex-col justify-between">
            <div>
                <div className="flex flex-row justify-center mb-2 text-3xl py-2 bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 w-full rounded-t-md">{title}</div>
                <div className="px-4 text-2xl flex justify-center mb-2">{format(start, 'M/dd/yyyy')} {format(start, 'h:mm')} to {format(end, 'h:mm')}</div>
                <div className="flex justify-start text-2xl px-4 mb-2">{description}</div>
                <div className="px-4 mb-2 text-2xl">
                    { capacity === 1 && count === 0 ? 'Available!' : '' }
                    { capacity === 1 && count === 1 ? 'Booked...' : '' }
                    { capacity !== 1 ? `Available: ${available} of ${capacity}`: ''} 
                </div>
            </div>
            
            <div className="flex justify-between pb-8">
                <div className="pl-8">
                    <button className="rounded border border-indigo-700 px-3 py-1 text-indigo-700 hover:scale-110 hover:shadow-md hover:shadow-purple-900 hover:opacity-70 mr-4 text-xl" onClick={handleEdit}>Edit</button>
                    <button className="rounded border border-red-700 px-3 py-1 text-red-700 hover:scale-110 hover:shadow-md hover:shadow-purple-900 hover:opacity-70 text-xl" onClick={handleDelete}>Delete</button>
                </div>
                <div className="pr-8">
                    <Link
                        className="rounded border border-indigo-700 px-3 py-1 text-indigo-700 hover:scale-110 hover:shadow-md hover:shadow-purple-900 hover:opacity-70 mr-4 text-xl"
                        href={`localhost:3000/clientList/${eventId}`}
                        rel="noopener noreferrer"
                        target="_blank">Client List</Link>
                    { 
                        !isBooked &&
                        !atMaxAllowed &&
                        (available > 0 && !pastStart && !isBooking) &&
                        <button className="rounded border border-indigo-700 px-3 py-1 text-indigo-700 hover:scale-110 hover:shadow-md hover:shadow-purple-900 hover:opacity-70 text-xl" onClick={handleBooking}>Book</button>
                    }
                    {
                        !isBooked &&
                        (available === 0 || pastStart || isBooking || atMaxAllowed) &&
                        <button className="rounded border border-slate-400 px-3 py-1 text-slate-400 bg-slate-200 text-xl cursor-not-allowed">Book</button>
                    }
                    {
                        isBooked &&
                        <button className="rounded border border-indigo-700 px-3 py-1 text-red-700 hover:scale-110 hover:shadow-md hover:shadow-purple-900 hover:opacity-70 text-xl" onClick={handleCancelBooking}>Cancel booking</button>
                    }
                </div>
            </div>
            { 
                showErrorAlert &&
                <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Something went wrong booking the appointment.  Please try again or contact our office at 801-888-8888</div>
            }
            {
                showCancelErrorAlert &&
                <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Something went wrong cancelling the appointment.  Please try again or contact our office at 801-888-8888</div>
            }
            { 
                showCancelError &&
                <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Something went wrong deleting the event.  Please try again or contact IT.</div>
            }
            {
                appointmentBookedMessage &&
                <div className="border border-green-500 round mt-4 p-3 text-slate-700 text-2xl">The appointment has been booked.  Please be on time or give us at least 24 hours notice for cancellation.</div>
            }
            {
                appointmentCancelledMessage &&
                <div className="border border-yellow-500 round mt-4 p-3 text-slate-700 text-2xl">The appointment has been cancelled.</div>
            }
            {
                atMaxAllowed &&
                <div className="border-t border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">You are already booked for as many appointments for type {calendarEventTypeName} as allowed.  Please contact our office if you believe you need more sessions of this type.</div>
            }
            <Modal
                onClose={() => setEventDetailUpdateModalIsOpen(false)}
                isOpen={eventDetailUpdateModalIsOpen}
            >
                <EventDetailUpdateModal
                    eventId={eventId}
                    calendarEventTypeId={calendarEventTypeId}
                    onClose={onClose}
                    onRefetch={onRefetch}
                />
            </Modal>
        </div>
    )
}

export default EventDetailModal;