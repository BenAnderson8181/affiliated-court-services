import type { CalendarEventType, Location } from "@prisma/client";

export type Event = {
    calendarEventType: CalendarEventType;
    count: number;
    description: string;
    id: string;
    location?: Location;
    title: string;
    start: Date;
    isBooked?: boolean;
}

export type EventDetail = {
    accountId: string;
    accountType: string;
    calendarEventTypeName: string;
    calendarEventTypeId: string;
    capacity: number;
    count: number;
    description: string;
    end: Date;
    eventId: string;
    start: Date;
    title: string;
    isBooked?: boolean;
    firstName: string;
    lastName: string;
    email: string;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onRefetch: () => void;
    onRefetchBooking: () => void;
}

export type EventItem = {
    accountId: string | null;
    calendarEventType: CalendarEventType;
    calendarEventTypeId: string;
    count: number;
    createdAt: Date;
    description: string;
    end: Date;
    filled: boolean;
    id: string;
    location: Location;
    locationId: string;
    repeat: boolean;
    start: Date;
    title: string;
    updatedAt: Date;
    url: string;
    isBooked: boolean;
}