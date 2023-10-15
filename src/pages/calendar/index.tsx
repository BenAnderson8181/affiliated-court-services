/* eslint @typescript-eslint/no-explicit-any: 0 */

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import type { NextPage } from 'next';
import type { CalendarEvent } from '@prisma/client';
// import type { CalendarProps } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
// import type { withDragAndDropProps } from "react-big-calendar/lib/addons/dragAndDrop";
import GroupEvent from './GroupEvent';
import IndividualEvent from './IndividualEvent';
import InterviewEvent from './InterviewEvent';
import DVGroupEvent from './DVGroupEvent';
import SUGroupEvent from './SUGroupEvent';
import PrimeForLifeEvent from './PrimeForLifeEvent';
import AMGroupEvent from './AMGroupEvent';
import CRGroupEvent from './CRGroupEvent';
import DiversionWorkshopEvent from './DiversionWorkshop';
import { api } from '~/utils/api';
import { useCallback, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import Modal from '~/modals/Modal';
import EventDetailAddModal from '~/modals/EventDetailCreateModal';
import EventDetailModal from '../../modals/EventDetailModal';
import { RiAddBoxFill } from "react-icons/ri";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Link from 'next/link';
import Loading from '~/components/Loading';
import LoadError from '~/components/LoadError';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const DnDCalendar = withDragAndDrop(Calendar);
// type DnDType = CalendarProps & withDragAndDropProps;
// type CustomCalendarProps = Omit<DnDType, "components" | "localizer">;

const MyCalendar: NextPage = () => {
    const { user } = useUser();
    const router = useRouter();
    const [eventDetailModalIsOpen, setEventDetailModalIsOpen] = useState(false);
    const [addEventModalIsOpen, setAddEventModalIsOpen] = useState(false);
    const [eventId, setEventId] = useState('');
    const [calendarEventType, setCalendarEventType] = useState('');
    const [calendarEventTypeId, setCalendarEventTypeId] = useState('');
    const [capacity, setCapacity] = useState(0);
    const [count, setCount] = useState(0);
    const [description, setDescription] = useState('');
    const [end, setEnd] = useState(new Date);
    const [start, setStart] = useState(new Date);
    const [title, setTitle] = useState('');
    const [isBooked, setIsBooked] = useState(false);
    const [showUpdateError, setShowUpdateError] = useState(false);
    const [eList, setEList] = useState<MyCalendarEvent[] | []>([]);

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        router.push('/').catch((err) => console.error(err));

    type MyCalendarEvent = CalendarEvent & {isBooked?: boolean};
    const eventsList: MyCalendarEvent[] = [];

    const calendarEventsQuery = api.calendarEvent.list.useQuery({});
    const accountQuery = api.account.findAccountByExternalId.useQuery({ externalId: userId });
    const clientCalendarEventQuery = api.clientCalendarEvent.clientList.useQuery({ externalId: userId });
    const calendarEventUpdateMutation = api.calendarEvent.update.useMutation();

    useEffect(() => {
        if (calendarEventsQuery.status === 'success' && clientCalendarEventQuery.status === 'success')
        {
            const eventsListWithBookedEvents = eventsList.map((value) => {
                if (clientCalendarEvents.some(ev => ev.calendarEventId === value.id))
                {
                    value.isBooked = true;
                }
        
                return value;
            });
        
            setEList(() => eventsListWithBookedEvents);
        }
    }, [calendarEventsQuery.status, clientCalendarEventQuery.status, clientCalendarEventQuery.data, calendarEventsQuery.data])

    const handleSelectEvent = useCallback(
        (event: any) => {
            setEventId(() => event.id);
            setCalendarEventType(() => event.calendarEventType.name);
            setCalendarEventTypeId(() => event.calendarEventTypeId);
            setCapacity(() => event.calendarEventType.capacity);
            setCount(() => event.count);
            setDescription(() => event.description);
            setEnd(() => event.end);
            setStart(() => event.start);
            setTitle(() => event.title);
            setIsBooked(() => event.isBooked);
            setEventDetailModalIsOpen(true);
        }
    , []);

    const handleEventDrop = useCallback(
        async (event: any) => {
            const result = await calendarEventUpdateMutation.mutateAsync({
                title: event.event.title,
                description: event.event.description ?? '',
                start: event.start,
                end: event.end,
                repeat: event.event.repeat,
                url: event.event.url ?? '',
                id: event.event.id,
                calendarEventTypeId: event.event.calendarEventTypeId
            })
            .catch((err) => {
                setShowUpdateError(true);
                console.error(err);
            });

            if (result) {
                calendarEventsQuery.refetch();
            }
        }
    , []);

    const handleEventResize = useCallback(
        async (event: any) => {
            const result = await calendarEventUpdateMutation.mutateAsync({
                title: event.event.title,
                description: event.event.description ?? '',
                start: event.start,
                end: event.end,
                repeat: event.event.repeat,
                url: event.event.url ?? '',
                id: event.event.id,
                calendarEventTypeId: event.event.calendarEventTypeId
            })
            .catch((err: any) => {
                setShowUpdateError(true);
                console.error(err);
            });

            if (result) {
                calendarEventsQuery.refetch();
            }
        }   
    , []);

    const handleAdd = () => {
        setAddEventModalIsOpen(true);
    }

    if (calendarEventsQuery.isLoading || accountQuery.isLoading || clientCalendarEventQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (calendarEventsQuery.isError || accountQuery.isError || clientCalendarEventQuery.isError) {
        return <LoadError type='Page' />
    }

    eventsList.push(...calendarEventsQuery.data);
    const account = accountQuery.data;
    const accountType = account?.accountType?.name;
    const clientCalendarEvents = clientCalendarEventQuery.data;
    const accountId = clientCalendarEvents[0]?.accountId;

    const components = {    
        event: ({event}: any) => {
            const eventType = event.calendarEventType.name;

            switch (eventType) {
                case 'Group':
                    return <GroupEvent 
                        calendarEventType={event.calendarEventType}
                        count={event.count}
                        description={event.description}
                        id={event.id}
                        location={event.location}
                        title={event.title} 
                        start={event.start}
                        isBooked={event.isBooked} />;

                case 'Individual':
                    return <IndividualEvent 
                        calendarEventType={event.calendarEventType}
                        count={event.count}
                        description={event.description}
                        id={event.id}
                        location={event.location}
                        title={event.title}
                        start={event.start}
                        isBooked={event.isBooked} />;

                case 'Interview':
                    return <InterviewEvent
                        calendarEventType={event.calendarEventType}
                        count={event.count}
                        description={event.description}
                        id={event.id}
                        location={event.location}
                        title={event.title}
                        start={event.start}
                        isBooked={event.isBooked} />;

                case 'Prime for Life':
                    return <PrimeForLifeEvent
                        calendarEventType={event.calendarEventType}
                        count={event.count}
                        description={event.description}
                        id={event.id}
                        location={event.location}
                        title={event.title}
                        start={event.start}
                        isBooked={event.isBooked} />;

                case 'DV Group':
                    return <DVGroupEvent
                        calendarEventType={event.calendarEventType}
                        count={event.count}
                        description={event.description}
                        id={event.id}
                        location={event.location}
                        title={event.title}
                        start={event.start}
                        isBooked={event.isBooked} />;

                case 'SUD Group':
                    return <SUGroupEvent
                        calendarEventType={event.calendarEventType}
                        count={event.count}
                        description={event.description}
                        id={event.id}
                        location={event.location}
                        title={event.title}
                        start={event.start}
                        isBooked={event.isBooked} />;

                case 'AM Group':
                    return <AMGroupEvent
                        calendarEventType={event.calendarEventType}
                        count={event.count}
                        description={event.description}
                        id={event.id}
                        location={event.location}
                        title={event.title}
                        start={event.start}
                        isBooked={event.isBooked} />;

                case 'Cog Group':
                    return <CRGroupEvent
                        calendarEventType={event.calendarEventType}
                        count={event.count}
                        description={event.description}
                        id={event.id}
                        location={event.location}
                        title={event.title}
                        start={event.start}
                        isBooked={event.isBooked} />;

                case 'Diversion Workshop':
                case 'Substance Awareness Workshop':
                case 'Cognitive Restructuring Workshop':
                case 'Anger Management Workshop':
                case 'Aggressive Driving Workshop':
                case 'Orientation Workshop':
                    return <DiversionWorkshopEvent
                        calendarEventType={event.calendarEventType}
                        count={event.count}
                        description={event.description}
                        id={event.id}
                        location={event.location}
                        title={event.title}
                        start={event.start}
                        isBooked={event.isBooked} />;

                default:
                    return null;

            }
        }
    }

    return (
        <div className='p-8 bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100'>
            <p className="flex justify-start -translate-y-4 text-2xl"><Link href={`/account/${accountId}`}>Account</Link></p> 
            <p className="flex justify-center -translate-y-4 text-2xl">{account.location?.name}&nbsp;-&nbsp;{account.location?.address}&nbsp;{account.location?.city},&nbsp;{account.location?.zip}</p>
            <div className="absolute top-2 right-2 cursor-pointer hover:scale-105 hover:opacity-80"><RiAddBoxFill size='3rem' className="text-slate-100" onClick={handleAdd}/></div>
            <DnDCalendar
                components={components}
                localizer={localizer}
                events={eList}
                views={['week', 'day']}
                defaultView={'week'}
                style={{ height: '85vh' }}
                min={new Date(2021, 0, 1, 10, 0, 0)}
                max={new Date(2021, 0, 1, 23, 0, 0)}
                className="bg-slate-50 shadow-2xl shadow-purple-900 border-2 border-indigo-700"
                onSelectEvent={handleSelectEvent}
                timeslots={4}
                step={15}
                draggableAccessor={() => true}
                onEventDrop={handleEventDrop}
                onEventResize={handleEventResize}
                resizable
            />
            <Modal
                onClose={() => setEventDetailModalIsOpen(false)}
                isOpen={eventDetailModalIsOpen}
            >
                <EventDetailModal 
                    accountId={account.id}
                    accountType={accountType ?? ''}
                    calendarEventTypeName={calendarEventType}
                    calendarEventTypeId={calendarEventTypeId}
                    capacity={capacity}
                    count={count}
                    description={description}
                    end={end}
                    eventId={eventId}
                    start={start}
                    title={title}
                    isBooked={isBooked}
                    firstName={account.firstName}
                    lastName={account.lastName}
                    email={account.email}
                    onClose={() => setEventDetailModalIsOpen(false)}
                    onRefetch={() => calendarEventsQuery.refetch()}
                    onRefetchBooking={() => clientCalendarEventQuery.refetch()}
                />
            </Modal>
            <Modal
                onClose={() => setAddEventModalIsOpen(false)}
                isOpen={addEventModalIsOpen}
            >
                <EventDetailAddModal
                    onClose={() => setAddEventModalIsOpen(false)}
                    onRefetch={() => calendarEventsQuery.refetch()}
                />
            </Modal>
            { 
                showUpdateError &&
                <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Something went wrong updating the event.  Please try again or contact IT.</div>
            }
        </div>
    );
};

export default MyCalendar;