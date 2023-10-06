import { formatISO } from "date-fns";

// DOUBLE CHECK THE CALENDAR EVENTS BEFORE RUNNING THIS FILE, I THINK I MADE THE CHANGES RIGHT TO THE DB FOR THE NEW EVENTS
const calendarEvents = [
    { calendarEventTypeId: '', title: 'DV/SU Group', description: 'Domestic Violence and Substance Use group', start: formatISO(new Date("July 2 2023 14:00")), end: formatISO(new Date("July 2 2023 15:30")), url: '', filled: false, repeat: false, count: 12, locationId: '' },
    { calendarEventTypeId: '', title: 'DV Group', description: 'Domestic Violence group', start: formatISO(new Date("July 3 2023 20:00")), end: formatISO(new Date("July 3 2023 21:30")), url: '', filled: false, repeat: false, count: 4, locationId: '' },
    { calendarEventTypeId: '', title: 'SU Group', description: 'Substance use group', start: formatISO(new Date("July 6 2023 10:00")), end: formatISO(new Date("July 6 2023 11:30")),  url: '', filled: true, repeat: false, count: 20, locationId: '' },
    { calendarEventTypeId: '', title: 'Evaluation', description: '30 minute evaluation', start: formatISO(new Date("July 5 2023 13:00")), end: formatISO(new Date("Julu 5 2023 13:30")), url: '', filled: false, repeat: false, count: 0, locationId: '' },
    { calendarEventTypeId: '', title: 'Individual Session', description: '45 minute individual session', start: formatISO(new Date("July 4 2023 16:00")), end: formatISO(new Date("July 4 2023 16:45")), url: '', filled: false, repeat: false, count: 0, locationId: '' },
    { calendarEventTypeId: '', title: 'Prime for Life', description: '4 hour Prime for Life', start: formatISO(new Date("July 8 2023 18:00")), end: formatISO(new Date("July 8 2023 22:00")), url: '', filled: false, repeat: false, count: 0, locationId: '' },
];

export default calendarEvents;