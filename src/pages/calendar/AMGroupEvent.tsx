import { isBefore } from 'date-fns';
import type { Event } from '~/types/calendar';
import { RiBookmark3Fill } from 'react-icons/ri';

const AMGroupEvent: React.FunctionComponent<Event> = ({ calendarEventType, count, id, title, start, isBooked }) => {
    const available = calendarEventType.capacity - count;
    const isPastEvent = isBefore(start, new Date());
    const isDisabled = available <= 0 || isPastEvent;

    return (
        <div id={id} className={` text-slate-100 px-1 h-full ${isDisabled ? 'bg-slate-400' : 'bg-violet-700'}`}>
            <div className="font-semibold text-lg">{title}</div>
            <div className="italic text-lg">Available: {isPastEvent ? 0 : available}</div>
            <div className={isBooked 
                ? `text-lg absolute top-0 left-0 border-2 border-indigo-700 rounded-full w-6 h-6 bg-slate-100 flex justify-center items-center -translate-x-3 -translate-y-3 z-50` 
                : ''}>
                {isBooked ? <RiBookmark3Fill size="1rem" className="text-indigo-700" /> : ''}
            </div>
        </div>
    );
};

export default AMGroupEvent;