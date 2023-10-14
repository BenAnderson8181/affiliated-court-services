import { useUser } from "@clerk/nextjs";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";
import type { Account } from "@prisma/client";

const ClientList: NextPage = () => {
    const { user } = useUser();
    const router = useRouter();

    const [search, setSearch] = useState('');
    const [showParticipationNoteError, setShowParticipationNoteError] = useState(false);
    const [showClientAlertError, setShowClientAlertError] = useState(false);

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        router.push('/').catch((err) => console.error(err));

    const eventId = router.query.id as string;

    const calendarEventQuery = api.calendarEvent.get.useQuery({ id: eventId });
    const clientListEventQuery = api.clientList.list.useQuery({ eventId })
    const clientSearchQuery = api.account.search.useQuery({ search }, { enabled: search.length > 2});
    // const participationNoteMutation = api.clientParticipationNote.upsert.useMutation();
    // const clientAlertMutation = api.clientAlert.upsert.useMutation();

    if (calendarEventQuery.isLoading || clientListEventQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (calendarEventQuery.isError || clientListEventQuery.isError) {
        return <LoadError type="Page" />
    }

    const calendarEvent = calendarEventQuery.data;
    const searchResults = clientSearchQuery.data;
    const clientList = clientListEventQuery.data;
    console.log('list: ', clientList)
    const clients = clientList.map((c) => c.clientCalendarEvents.map(e => e.account));
    console.log('clients: ', clients)

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '')
            return null;

        setSearch(() => e.target.value);
    }

    const handleSearchResultClick = ({ firstName, lastName, id }: Account) => {
        console.log('all: ', firstName, lastName, id )
        // this needs to add the client to the list of participants
        // TODO: Remove these 2 lines typescript is being a little bitch about this
        setShowParticipationNoteError(false);
        setShowClientAlertError(false);
    }

    // const handleNoShow = (id: string) => {
    //     console.log('id: ', id)
    //     // this needs to flag the account to not update their attendance or remove them from the client list
    // }

    // const handleKickedOut = (id: string) => {
    //     console.log('id: ', id)
    //     // this needs to handle the updates to the account appropriate for kicking someone out of the session - remove/no credit, flag on account, maybe auto entry into participation notes
    // }

    // const handleParticipationNoteUpdate = async (id: string, note: string) => {
    //     const result = await participationNoteMutation.mutateAsync({
    //         id,
    //         note
    //     })
    //     .catch((err) => {
    //         console.error('error: ', err);
    //         setShowParticipationNoteError(true);
    //         return;
    //     });

    //     if (result) {
    //         // something here
    //     }
    // }

    // const handleClientAlertUpdate = async (id: string, alert: string) => {
    //     const result = await clientAlertMutation.mutateAsync({
    //         id,
    //         alert
    //     })
    //     .catch((err) => {
    //         console.error('error: ', err);
    //         setShowClientAlertError(true);
    //         return;
    //     });

    //     if (result) {
    //         // something goes here
    //     }
    // }

    // const handleSeeClinicalDirector = async (id: string, message: string) => {
    //     console.log('message: ', message)
    //     // this should set a flag on the client to see the clinical director that shows on their client portal and save a message for the clinical dircetor
    // }

    const toggleShowDetails = (id: string) => {
        console.log('toggle me', id)
    }

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 pb-12">
            <div className="w-3/4 bg-slate-100 text-purple-950 p-6 mx-auto my-12 rounded-lg border-2 border-indigo-700 shadow-black shadow-md">
                <p className="text-4xl font-semibold flex justify-center">{calendarEvent?.title}</p>
                <div className="text-2xl flex justify-around mt-4">
                    <p>{calendarEvent?.start.toDateString()}</p>
                    <p>{calendarEvent?.start.toLocaleTimeString()}</p>
                    <p>{calendarEvent?.end.toLocaleTimeString()}</p>
                </div>
                <p className="text-2xl flex justify-center mt-4">{calendarEvent?.description}</p>
                <p className="text-2xl flex justify-center mt-4">{calendarEvent?.url}</p>
            </div>
            <div className="w-3/4 bg-slate-100 text-purple-950 p-6 mx-auto my-12 rounded-lg border-2 border-indigo-700 shadow-black shadow-md">
                <div className="flex justify-center text-2xl">Add Client</div>
                <label className="flex justify-between mt-4 px-4 pb-3 border-b-2 border-b-purple-800">
                    <p className="text-2xl font-light inline">Client:</p>
                    <input
                        type="text"
                        className="rounded-md border border-slate-700 text-slate-700 py-0 px-2 text-xl"
                        onChange={handleSearchChange}
                    />
                </label>
                {
                    searchResults != undefined && searchResults?.length > 0 &&
                    <div className="p-3 border-b-2 border-b-purple-900 bg-slate-100">
                    {
                        searchResults.map((sr) => (
                            <button 
                                key={sr.id}
                                className="cursor-pointer text-xl"
                                onClick={() => handleSearchResultClick(sr)}
                            >
                                {sr.firstName}&nbsp;{sr.lastName},&nbsp;{sr.email}
                            </button>
                        ))
                    }
                    </div>
                }
            </div>
            <div>
                {
                    clients?.map((client) => {
                        return <div key={'1'} onClick={() => toggleShowDetails('')}>
                            <p>{client.values.name}</p>
                            {/* <p>{client?.preferredName ? client?.preferredName : client?.firstName + ' ' + client?.lastName}</p> */}
                        </div>
                    })
                }
            </div>
            { showClientAlertError &&
                <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Something went wrong updating the client alert.</div>
            }
            { showParticipationNoteError &&
                <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Something went wrong updating the client participation note.</div>
            }
        </div>
    )
}

export default ClientList;