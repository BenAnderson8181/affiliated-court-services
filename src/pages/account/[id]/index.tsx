import { useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useState } from "react";
import Link from "next/link";
import { isBefore, format, addHours } from "date-fns";
import { RiAddBoxFill, RiMailCheckFill, RiEditBoxFill } from "react-icons/ri";
import ProgressBar from "@ramonak/react-progress-bar";
// Components
import Header from "../../../components/header";
import Loading from "~/components/Loading";
import LoadError from "~/components/LoadError";
// Modals
import Modal from "../../../modals/Modal";
import IncidentReportModal from "~/modals/IncidentReportModal";
import IncidentReportViewModal from "~/modals/IncidentReportViewModal";
import AssessmentViewModal from "~/modals/AssessmentViewModal";
import IncidentReportRequireModal from "~/modals/IncidentReportRequireModal";
import AssessmentRequireModal from "~/modals/AssessmentRequireModal";
import ClientRequirementModal from "~/modals/ClientRequirementModal";
import ClientRequirementUpdateModal from "~/modals/ClientRequirementUpdateModal";
import MessageCreateModal from "~/modals/MessageCreateModal";

// import MessageUpdateModal from "~/modals/MessageUpdateModal";
// import ClinicalNoteCreateModal from "~/modals/ClinicalNoteCreateModal";
// import ClinicalNoteUpdateModal from "~/modals/ClinicalNoteUpdateModal";
// import ContactCreateModal from "~/modals/ContactCreateModal";
// import ContactViewModal from "~/modals/ContactViewModal";

// import DiscountCreateModal from "~/modals/DiscountCreateModal";
// import DiscountUpdateModal from "~/modals/DiscountUpdateModal";
// import GoalRequireModal from "~/modals/GoalRequireModal";
// import GoalUpdateModal from "~/modals/GoalUpdateModal";
// import LargeModal from "~/modals/LargeModal";
// import AccountPolicyModal from "~/modals/AccountPolicyModal";
// import ProgressReportModal from "~/modals/ProgressReportModal";
// import ClientAlertModal from "~/modals/ClientAlertModal";
// import ParticipationNoteModal from "~/modals/ParticipationNoteModal";
// import ClientUpdateModal from "~/modals/ClientUpdateModal";

const AccountDashboard: NextPage = (props) => {
    console.log('Account Portal: ', props)
    const router = useRouter();
    const { user } = useUser();
    const [incidentReportModalIsOpen, setIncidentReportModalIsOpen] = useState(false);
    const [incidentId, setIncidentId] = useState('');
    const [incidentReportModalViewIsOpen, setIncidentReportModalViewIsOpen] = useState(false);
    const [assessment, setAssessment] = useState('');
    const [assessmentModalViewIsOpen, setAssessmentModalViewIsOpen] = useState(false);
    const [incidentReportRequiredModalIsOpen, setIncidentReportRequiredModalIsOpen] = useState(false);
    const [assmentRequireModalIsOpen, setAssessmentRequireModalIsOpen] = useState(false);
    const [clientRequirementModalIsOpen, setClientRequirementModalIsOpen] = useState(false);
    const [requirementId, setRequirementId] = useState('');
    const [clientRequirementUpdateModalIsOpen, setClientRequirementUpdateModalIsOpen] = useState(false);
    const [messageCreateModalIsOpen, setMessageCreateModalIsOpen] = useState(false);
    // const [messageUpdateModalIsOpen, setMessageUpdateModalIsOpen] = useState(false);
    // const [messageId, setMessageId] = useState('');
    const [showMoreMessages, setShowMoreMessages] = useState(false);
    // const [clinicalNoteCreationModalIsOpen, setClinicalNoteCreationModalIsOpen] = useState(false);
    // const [clinicalNoteUpdateModalIsOpen, setClinicalNoteUpdateModalIsOpen] = useState(false);
    // const [clinicalNoteId, setClinicalNoteId] = useState('');
    const [showMoreClinicalNotes, setShowMoreClinicalNotes] = useState(false);
    // const [contactCreationModalIsOpen, setContactCreationModalIsOpen] = useState(false);
    // const [contactId, setContactId] = useState('');
    // const [contactViewModalIsOpen, setContactViewModalIsOpen] = useState(false);
    // const [discountCreationModalIsOpen, setDiscountCreationModalIsOpen] = useState(false);
    // const [discountPriceId, setDiscountPriceId] = useState('');
    // const [discountPriceUpdateModalIsOpen, setDiscountPriceUpdateModalIsOpen] = useState(false);
    // const [goalName, setGoalName] = useState('');
    // const [goalModalIsOpen, setGoalModalIsOpen] = useState(false);
    // const [requireGoalModalIsOpen, setRequireGoalModalIsOpen] = useState(false);
    // const [requiredGoalId, setRequiredGoalId] = useState('');
    // const [policyIsOpen, setPolicyIsOpen] = useState(false);
    // const [policyTitle, setPolicyTitle] = useState('');
    // const [progressReportModalIsOpen, setProgressReportModalIsOpen] = useState(false);
    // const [clientAlertModalIsOpen, setClientAlertModalIsOpen] = useState(false);
    // const [participationNoteModalIsOpen, setParticipationNoteModalIsOpen] = useState(false);
    // const [updateClientModalIsOpen, setUpdateClientModalIsOpen] = useState(false);

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        router.push('/').catch((err) => console.error(err));

    const accountId = router.query.id as string;
    
    const accountQuery = api.account.findById.useQuery({ id: accountId });
    const clientProgressQuery = api.clientProgress.getNextStep.useQuery({ accountId });
    const clientCalendarEventsQuery = api.clientCalendarEvent.clientList.useQuery({ accountId });
    const incidentsQuery = api.incident.list.useQuery({ accountId });
    const clientAssessmentsQuery = api.clientAssessmentAnswers.list.useQuery({ accountId });
    const loggedInaccountQuery = api.account.findAccountByExternalId.useQuery({ externalId: userId });
    const clientRequirementsQuery = api.clientRequirement.list.useQuery({ clientId: accountId });
    const messageQuery = api.message.list.useQuery({ accountId });
    const clinicalNotesQuery = api.clinicalNote.list.useQuery({ clientId: accountId });
    const contactQuery = api.contact.list.useQuery({ accountId });
    const discountPricesQuery = api.discountPrice.list.useQuery({ accountId });
    const requiredGoalQuery = api.requiredGoal.list.useQuery({ accountId });
    const accountPolicyQuery = api.accountPolicy.list.useQuery({ accountId });
    const clientAlertQuery = api.clientAlert.get.useQuery({ accountId });
    const clientParticipationNoteQuery = api.clientParticipationNote.get.useQuery({ accountId });

    if (accountQuery.isLoading ||
        clientProgressQuery.isLoading ||
        clientCalendarEventsQuery.isLoading ||
        incidentsQuery.isLoading ||
        clientAssessmentsQuery.isLoading ||
        loggedInaccountQuery.isLoading ||
        clientRequirementsQuery.isLoading || 
        messageQuery.isLoading ||
        clinicalNotesQuery.isLoading || 
        contactQuery.isLoading ||
        discountPricesQuery.isLoading || 
        requiredGoalQuery.isLoading ||
        accountPolicyQuery.isLoading ||
        clientAlertQuery.isLoading ||
        clientParticipationNoteQuery.isLoading) {
            return <Loading type='Page' />
    }

    if (accountQuery.error ||
        clientProgressQuery.error ||
        clientCalendarEventsQuery.isError ||
        incidentsQuery.isError ||
        clientAssessmentsQuery.isError ||
        loggedInaccountQuery.isError ||
        clientRequirementsQuery.isError ||
        messageQuery.isError ||
        clinicalNotesQuery.isError ||
        contactQuery.isError ||
        discountPricesQuery.isError ||
        requiredGoalQuery.isError ||
        accountPolicyQuery.isError ||
        clientAlertQuery.isError ||
        clientParticipationNoteQuery.isError) {
            return <LoadError type="Page" />
    }

    const account = accountQuery.data;
    const loggedInAccount = loggedInaccountQuery.data;
    const nextStep = clientProgressQuery.data as string;
    const clientCalendarEvents = clientCalendarEventsQuery.data.filter((e) => isBefore(new Date(), e.calendarEvent.start)) || [];
    const incidents = incidentsQuery.data;
    const clientAssessments = clientAssessmentsQuery.data;
    const clientAssessmentTitles = clientAssessments.map((a) => { return `${a.assessment.name} - ${a.createdAt.toLocaleDateString()}`});
    const filteredClientAssessmentTitles = clientAssessmentTitles.filter((item, index) => clientAssessmentTitles.indexOf(item) === index);
    const clientRequirements = clientRequirementsQuery.data;
    const messages = messageQuery.data;
    const clinicalNotes = clinicalNotesQuery.data;
    const contacts = contactQuery.data;
    const discountPrices = discountPricesQuery.data;
    const requiredGoals = requiredGoalQuery.data;
    const accountPolicies = accountPolicyQuery.data.filter((p) => p.policy?.title !== 'Demographic');
    const clientAlert = clientAlertQuery.data;
    const clientParticipationNote = clientParticipationNoteQuery.data;

    const totalRequired = clientRequirements.reduce((acc, cur) => { return acc + cur.requiredAmount}, 0);
    const totalFulfilled = clientRequirements.reduce((acc, cur) => { return acc + cur.fulfilledAmount}, 0);
    const percentComplete = totalRequired === 0 ? 0 : (totalFulfilled / totalRequired * 100).toFixed(0);

    let masquerade = false;
    if (account.externalId !== loggedInAccount.externalId) {
        // TODO: here we need to add account type checks and kick people off the page if they are not supposed to be here
        masquerade = true;
    }

    const handleIncidentReport = () => {
        setIncidentReportModalIsOpen(true);
    }

    const refetchNextStep = () => {
        // this is a little annoying but it works
        router.reload();
    }

    const handleIncidentClick = (incidentId: string) => {
        setIncidentId(() => incidentId);
        setIncidentReportModalViewIsOpen(true);

        return true;
    }

    const handleAssessmentClick = (assessment: string) => {
        setAssessment(() => assessment);
        setAssessmentModalViewIsOpen(true);
    }

    const handleRequireIncident = () => {
        setIncidentReportRequiredModalIsOpen(true);
    }

    const handleRequireAssessment = () => {
        setAssessmentRequireModalIsOpen(true);
    }

    const handleClientRequirement = () => {
        setClientRequirementModalIsOpen(true);
    }

    const handleRequirementClick = (requirementId: string) => {
        setRequirementId(() => requirementId);
        setClientRequirementUpdateModalIsOpen(true);
    }

    const refreshRequirements = () => {
        clientRequirementsQuery.refetch();
    }

    const handleMessage = () => {
        setMessageCreateModalIsOpen(true);
    }

    const handleMessageUpdate = (messageId: string) => {
        console.log('ToDo - Remove me', messageId)
        // setMessageId(() => messageId);
        // setMessageUpdateModalIsOpen(true);
    }

    const refreshMessages = () => {
        messageQuery.refetch();
    }

    const handleShowMoreMessages = () => {
        setShowMoreMessages(() => !showMoreMessages);
    }

    const handleClinicalNote = () => {
        console.log('ToDo - Remove me')
        // setClinicalNoteCreationModalIsOpen(true);
    }

    const handleClinicalNoteUpdate = (noteId: string) => {
        console.log('ToDo - Remove me', noteId)
        // setClinicalNoteId(() => noteId);
        // setClinicalNoteUpdateModalIsOpen(true);
    }

    // const refreshClinicalNotes = () => {
    //     clinicalNotesQuery.refetch();
    // }
    
    const handleShowMoreClinicalNotes = () => {
        setShowMoreClinicalNotes(() => !showMoreClinicalNotes);
    }

    const handleContact = () => {
        console.log('ToDo - Remove me')
        // setContactCreationModalIsOpen(true);
    }

    const handleContactView = (contactId: string) => {
        console.log('ToDo - Remove me', contactId)
        // setContactId(() => contactId);
        // setContactViewModalIsOpen(true);
    }

    // const refreshContacts = () => {
    //     contactQuery.refetch();
    // }

    const handleDiscount = () => {
        console.log('ToDo - Remove me')
        // setDiscountCreationModalIsOpen(true);
    }

    // const refreshDiscounts = () => {
    //     discountPricesQuery.refetch();
    // }

    const handleDiscountUpdate = (discountPriceId: string) => {
        console.log('ToDo - Remove me', discountPriceId)
        // setDiscountPriceId(() => discountPriceId);
        // setDiscountPriceUpdateModalIsOpen(true);
    }

    const handleGoal = (goal: string, url: string, requiredGoalId: string) => {
        console.log(requiredGoalId, goal)
        if (masquerade) {
            // setGoalName(() => goal);
            // setRequiredGoalId(() => requiredGoalId)
            // setGoalModalIsOpen(true);
        }
        else {
            router.push(`/account/goals/${url}`).catch((err) => console.error(err));
        }
    }

    const handleRequireGoal = () => {
        console.log('ToDo - Remove me')
        // setRequireGoalModalIsOpen(true);
    }

    const handlePolicy = (title: string) => {
        if (title.length > 0) {
            // setPolicyTitle(() => title);
            // setPolicyIsOpen(true);
        }
    }

    const handleProgressReport = () => {
        console.log('ToDo - Remove me')
        // setProgressReportModalIsOpen(true);
    }

    const handleAlert = () => {
        console.log('ToDo - Remove me')
        // setClientAlertModalIsOpen(true);
    }

    // const refreshClientAlert = () => {
    //     clientAlertQuery.refetch();
    // }

    const handleParticipationNote = () => {
        console.log('ToDo - Remove me')
        // setParticipationNoteModalIsOpen(true);
    }

    // const refreshParticipationNote = () => {
    //     clientParticipationNoteQuery.refetch();
    // }

    const handleUpdateClient = () => {
        console.log('ToDo - Remove me')
        // setUpdateClientModalIsOpen(true);
    }

    // const refreshClient = () => {
    //     accountQuery.refetch();
    // }

    // Repeat this for each type except client
    if (account?.accountTypeId === 'Type Agent') {
        return (
            <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100">
                <Header />
                <div className="w-full px-12 text-xl">
                    Client Details:
                    <div className="flex flex-col border border-indigo-700 rounded-lg shadow-2xl shadow-purple-900 bg-slate-200 text-slate-700">
    
                    </div>
                </div>
            </div>
        );
    }
   
    // this means the account is a client

    // TODO: The next steps piece may be best pulled out into it's own component so we can refresh it without refreshing the whole page
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 pb-12">
            <Header />
            <div className="w-4/5 text-xl m-auto my-4">
                {
                    nextStep?.length > 0 && !masquerade &&
                    <p className="pl-3 mb-2">Next Steps:</p>
                }
                {
                    nextStep?.length > 0 && !masquerade &&
                    <div className="border border-yellow-200 rounded-sm p-5">
                    { 
                        nextStep === 'policies' && !masquerade &&
                        <div>Policies & Procedures need to be signed.&nbsp;&nbsp;<Link href='/account/policies/eSignature'>Click here.</Link></div>
                    }
                    {
                        nextStep === 'incident report' && !masquerade &&
                        <div>An Incident Report needs to be completed.&nbsp;&nbsp;<p onClick={handleIncidentReport} className="hover:cursor-pointer inline hover:text-slate-300">Click here.</p></div>
                    }
                    {
                        nextStep === 'release of information' && !masquerade &&
                        <div>Release of Information needs to be completed.&nbsp;&nbsp;<p onClick={() => router.push('/account/policies/releaseOfInformation').catch((err) => console.error(err))} className="hover:cursor-pointer inline hover:text-slate-300">Click here.</p></div>
                    }
                    {
                        nextStep === 'criminal background' && !masquerade &&
                        <div>Consent to Criminal Background needs to be completed.&nbsp;&nbsp;<Link href='/account/policies/criminalBackground'>Click here.</Link></div>
                    }
                    {
                        nextStep === 'assessments' && !masquerade &&
                        <div>Assessments need to be completed.&nbsp;&nbsp;<Link href='/account/assessments'>Click here.</Link></div>
                    }
                    {
                        nextStep === 'evaluation' && !masquerade &&
                        <div>An evaluation interview needs to be scheduled and completed.&nbsp;&nbsp;<Link href='/calendar'>Click here.</Link></div>
                    }
                    {
                        nextStep === 'goals' && !masquerade &&
                        <div>Goals need to be completed.&nbsp;&nbsp;<Link href='/account/goals'>Click here.</Link></div>
                    }
                    </div>
                }
            </div>
            <div className="w-4/5 text-xl m-auto mb-4">
                {
                    clientCalendarEvents?.length > 0 &&
                    <p className="pl-3 mb-2">Appointments:</p>
                }
                {
                    clientCalendarEvents?.length > 0 &&
                    <div className="border border-purple-300 rounded-sm p-5">
                    {
                        clientCalendarEvents.map((event) => {
                            return <div key={event.id} className="cursor-pointer font-light">
                                <span className="font-semibold">{event.calendarEvent.title}</span>&nbsp;<span className="italic">starts at:</span>&nbsp;{format(event.calendarEvent.start, 'M/dd/yyyy')} {format(event.calendarEvent.start, 'h:mm')} <span className="italic">to</span>&nbsp;{format(event.calendarEvent.end, 'h:mm')}
                            </div>
                        })
                    }
                    </div>
                }
            </div>
            {
                totalRequired > 0 &&
                <div className="w-full px-12 text-xl mt-2 relative">
                    <div className="flex justify-between mb-2">
                        <p className="pl-3 mb-2">Progress:</p>
                        <p className="absolute -top-1 right-2 cursor-pointer hover:scale-105 hover:opacity-80"><RiMailCheckFill size='2.5rem' className="text-slate-100" onClick={handleProgressReport} /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 border-2 border-indigo-700 rounded-lg shadow-lg shadow-indigo-950 bg-slate-200 text-slate-700 p-4 h-fit">
                    {
                        <ProgressBar completed={`${percentComplete}`} bgColor="#2f0f5b" baseBgColor="#EEDC9A" />
                    }
                    {
                        clientRequirements.map((requirement) => {
                            return <div key={requirement.id}>{requirement.fulfilledAmount}/{requirement.requiredAmount} {requirement.requirementType.name}</div>
                        })
                    }
                    </div>
                </div>
            }
           
            <div className="w-full px-12 text-xl mt-2 relative">
                <div className="flex justify-between mb-2">
                    <p className="pl-3 pt-3">Requirements:</p>
                    <p className="absolute -top-1 right-2 cursor-pointer hover:scale-105 hover:opacity-80"><RiAddBoxFill size='2.5rem' className="text-slate-100" onClick={handleClientRequirement}/></p>
                </div>
                <div className="grid grid-cols-2 gap-3 border-2 border-indigo-700 rounded-lg shadow-lg shadow-indigo-950 bg-slate-200 text-slate-700 p-4 h-fit">
                    {
                        clientRequirements.length == 0 &&
                        <div>No requirements have been added.</div>
                    }
                    {
                        clientRequirements.map((requirement) => {
                            return <div key={requirement.id}>
                                <button className="cursor-pointer" onClick={() => handleRequirementClick(requirement.id)}>{requirement.requirementType.name}: {requirement.requiredAmount}</button>
                            </div>
                        })
                    }
                </div>
            </div>
            <div className="w-full px-12 text-xl mt-2 relative">
                <div className="flex justify-between mb-2">
                    <p className="pl-3 pt-3">Messages:</p>
                    <p className="absolute -top-1 right-2 cursor-pointer hover:scale-105 hover:opacity-80"><RiAddBoxFill size='2.5rem' className="text-slate-100" onClick={handleMessage}/></p>
                </div>
                <div className="flex flex-col gap-3 border-2 border-indigo-700 rounded-lg shadow-lg shadow-indigo-950 bg-slate-200 text-slate-700 p-4 h-fit w-full">
                    {
                        (messages?.length == 0 || messages == undefined) &&
                        <div>No messages have been sent or received.</div>
                    }
                    {
                        messages?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((message, index) => {
                            return <div key={message.id} className={`${message.externalId === userId ? '' : 'flex justify-end'}`}>
                                { message.externalId === userId && 
                                    <button className={`cursor-pointer font-semibold ${message.externalId === userId ? 'bg-indigo-300' : 'bg-yellow-600'} p-3 rounded-lg shadow-sm shadow-purple-950 ${(!showMoreMessages && index > 4) ? 'hidden' : ''}`} onClick={() => handleMessageUpdate(message.id)}>{message.createdAt.toLocaleDateString()}:&nbsp;{message.message}</button>
                                }
                                {
                                    message.externalId !== userId &&
                                    <button className={`${message.externalId === userId ? 'bg-indigo-300' : 'bg-yellow-500'} font-semibold p-3 rounded-lg shadow-sm shadow-purple-950 cursor-default ${(!showMoreMessages && index > 4) ? 'hidden' : ''}`}>{message.createdAt.toLocaleDateString()}:&nbsp;{message.message}</button>
                                }
                            </div>
                        })
                    }
                    {
                        messages != undefined && messages?.length > 5 &&
                        <button className="w-3/4 m-auto rounded border bg-violet-200 border-indigo-700 px-3 py-1 text-slate-700 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70" onClick={handleShowMoreMessages}>{showMoreMessages ? 'Show less messages' : 'Show more messages'}</button>
                    }
                </div>
            </div>
            <div className="w-full px-12 text-xl mt-2 relative">
                <div className="flex justify-between mb-2">
                    <p className="pl-3 mb-2 text-slate-100">Client Details:</p>
                    <p className="absolute -top-1 right-2 cursor-pointer hover:scale-105 hover:opacity-80"><RiEditBoxFill size="2.5rem" className="text-slate-100" onClick={handleUpdateClient} /></p>
                </div>
                <div className="grid grid-cols-10 gap-3 border-2 border-indigo-700 rounded-lg  shadow-lg shadow-indigo-950 bg-slate-200 text-slate-700 p-6">
                    <p className="font-semibold col-span-2">Name:</p><p className="col-span-3">{account.firstName}&nbsp;{account.lastName}</p>
                    <p className="font-semibold col-span-2">Preferred&nbsp;Name:</p><p className="col-span-3">{account.preferredName}</p>
                    <p className="font-semibold col-span-2">Location:</p><p className="col-span-3">{account.location?.name}</p>
                    <p className="font-semibold col-span-2">Date&nbsp;of&nbsp;Birth:</p><p className="col-span-3">{account.birthDay?.toLocaleDateString()}</p>
                    <p className="font-semibold col-span-2">Email:</p><p className="col-span-3">{account.email}</p>
                    <p className="font-semibold col-span-2">Phone:</p><p className="col-span-3">{account.phone}</p>
                    <p className="font-semibold col-span-2">Last&nbsp;Meeting:</p><p className="col-span-3">Anger Management</p>
                    <p className="font-semibold col-span-2">Last&nbsp;Meeting&nbsp;Date:</p><p className="col-span-3">{new Date().toLocaleDateString()}</p>
                    <p className="font-semibold col-span-2">Referred&nbsp;By:</p><p className="col-span-3">{account.referringAgency}</p>
                </div>
            </div>
            <div className="w-full px-12 text-xl mt-2 relative">
                <p className="pl-3 mb-2">Incidents:</p>
                <p className="absolute -top-1 right-2 cursor-pointer hover:scale-105 hover:opacity-80"><RiAddBoxFill size='2.5rem' className="text-slate-100" onClick={handleRequireIncident}/></p>
                <div className="grid grid-cols-2 gap-3 border-2 border-indigo-700 rounded-lg shadow-lg shadow-indigo-950 bg-slate-200 text-slate-700 p-4 h-fit">
                    {
                        incidents.length === 0 &&
                        <div>No incidents have been added.</div>
                    }
                    {
                        incidents.map((incident) => {
                            const incidentId = incident.id;
                            return <div key={incidentId}>
                                <button className="cursor-pointer" onClick={() => handleIncidentClick(incidentId)}>{incident.incidentType.name} {incident.createdAt.toLocaleDateString()}</button>
                            </div>
                        })
                    }
                </div>
            </div>
            <div className="w-full px-12 text-xl mt-2 relative">
                <p className="pl-3 mb-2">Assessments:</p>
                <p className="absolute -top-1 right-2 cursor-pointer hover:scale-105 hover:opacity-80"><RiAddBoxFill size="2.5rem" className="text-slate-100" onClick={handleRequireAssessment}/></p>
                <div className="grid grid-cols-2 gap-3 border-2 border-indigo-700 rounded-lg shadow-lg shadow-indigo-950 bg-slate-200 text-slate-700 p-4 h-fit">
                    {
                        filteredClientAssessmentTitles.length === 0 &&
                        <div>No assessments have been completed.</div>
                    }
                    {
                        filteredClientAssessmentTitles.map((assessment) => {
                            return <div key={assessment}>
                                <button className="cursor-pointer" onClick={() => handleAssessmentClick(assessment)}>{assessment}</button>
                            </div>
                        })
                    }
                </div>
            </div>
            <div className="w-full px-12 text-xl mt-2 relative">
            <div className="flex justify-between mb-2">
                <p className="pl-3 pt-3">Clinical Notes:</p>
                <p className="absolute -top-1 right-2 cursor-pointer hover:scale-105 hover:opacity-80"><RiAddBoxFill size='2.5rem' className="text-slate-100" onClick={handleClinicalNote}/></p>
                </div>
                <div className="flex flex-col gap-3 border-2 border-indigo-700 rounded-lg shadow-lg shadow-indigo-950 bg-slate-200 text-slate-700 p-4 h-fit w-full">
                    {
                        (clinicalNotes?.length == 0 || clinicalNotes == undefined) &&
                        <div>No clinical notes have been sent or received.</div>
                    }
                    {
                        clinicalNotes?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((note, index) => {
                            return <div key={note.id}>
                                <button className={`cursor-pointer font-semibold bg-indigo-300 p-3 rounded-lg shadow-sm shadow-purple-950 ${(!showMoreClinicalNotes && index > 4) ? 'hidden' : ''}`} onClick={() => handleClinicalNoteUpdate(note.id)}>{note.createdAt.toLocaleDateString()}:&nbsp;{note.note}</button>
                            </div>
                        })
                    }
                    {
                        clinicalNotes != undefined && clinicalNotes?.length > 5 &&
                        <button className="w-3/4 m-auto rounded border bg-violet-200 border-indigo-700 px-3 py-1 text-slate-700 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70" onClick={handleShowMoreClinicalNotes}>{showMoreMessages ? 'Show less notes' : 'Show more notes'}</button>
                    }
                </div>
            </div>
            <div className="w-full px-12 text-xl mt-2 relative">
                <p className="pl-3 pt-3">Goals:</p>
                <p className="absolute -top-1 right-2 cursor-pointer hover:scale-105 hover:opacity-80"><RiAddBoxFill size='2.5rem' className="text-slate-100" onClick={handleRequireGoal}/></p>
                <div className="grid grid-cols-2 gap-3 border-2 border-indigo-700 rounded-lg shadow-lg shadow-indigo-950 bg-slate-200 text-slate-700 p-6 h-fit">
                    {
                        (requiredGoals == undefined || requiredGoals.length) === 0 &&
                        <div>No goals have been added.</div>
                    }
                    {
                        requiredGoals?.map((goal) => {
                            return <div key={goal.id}>
                                <button className="cursor-pointer" onClick={() => handleGoal(goal.goal.name, goal.goal.url, goal.id)}>{goal.goal.name}</button>
                            </div>
                        })
                    }
                </div>
            </div>
            
            <div className="w-full px-12 text-xl mt-2 relative">
                <p className="pl-3 mb-2">Contacts:</p>
                <p className="absolute -top-1 right-2 cursor-pointer hover:scale-105 hover:opacity-80"><RiAddBoxFill size='2.5rem' className="text-slate-100" onClick={handleContact}/></p>
                <div className="grid grid-cols-2 gap-3 border-2 border-indigo-700 rounded-lg shadow-lg shadow-indigo-950 bg-slate-200 text-slate-700 p-6 h-fit">
                    {
                        (contacts == undefined || contacts.length) === 0 &&
                        <div>No contacts have been added.</div>
                    }
                    {
                        contacts?.map((contact) => {
                            return <div key={contact.id}>
                                <button className="cursor-pointer" onClick={() => handleContactView(contact.id)}>{contact.firstName}&nbsp;{contact.lastName},&nbsp;{contact.email}</button>
                            </div>
                        })
                    }
                </div>
            </div>
            <div className="w-full px-12 text-xl mt-2 relative">
                <p className="pl-3 mb-2">Discounts:</p>
                <p className="absolute -top-1 right-2 cursor-pointer hover:scale-105 hover:opacity-80"><RiAddBoxFill size='2.5rem' className="text-slate-100" onClick={handleDiscount}/></p>
                <div className="grid grid-cols-2 gap-3 border-2 border-indigo-700 rounded-lg shadow-lg shadow-indigo-950 bg-slate-200 text-slate-700 p-6 h-fit">
                    {
                        (discountPrices == undefined || discountPrices.length) === 0 &&
                        <div>No discount prices have been applied.</div>
                    }
                    {
                        discountPrices?.map((discount) => {
                            return <div key={discount.id}>
                                <button className="cursor-pointer" onClick={() => handleDiscountUpdate(discount.id)}>{discount.price.name}&nbsp;${discount.discountPrice}&nbsp;&nbsp;Expires:&nbsp;{addHours(discount.expirationDate, 10).toDateString()}</button>
                            </div>
                        })
                    }
                </div>
            </div>
            <div className="w-full px-12 text-xl mt-2 relative">
                <p className="pl-3 mb-2">Alerts:</p>
                <p className="absolute -top-1 right-2 cursor-pointer hover:scale-105 hover:opacity-80"><RiAddBoxFill size='2.5rem' className="text-slate-100" onClick={handleAlert}/></p>
                <div className="grid grid-cols-2 gap-3 border-2 border-indigo-700 rounded-lg shadow-lg shadow-indigo-950 bg-slate-200 text-slate-700 p-6 h-fit">
                    {
                        <div className="text-2xl">
                            {clientAlert?.alert}
                        </div>
                    }
                </div>
            </div>
            <div className="w-full px-12 text-xl mt-2 relative">
                <p className="pl-3 mb-2">Participation Notes:</p>
                <p className="absolute -top-1 right-2 cursor-pointer hover:scale-105 hover:opacity-80"><RiAddBoxFill size='2.5rem' className="text-slate-100" onClick={handleParticipationNote}/></p>
                <div className="grid grid-cols-2 gap-3 border-2 border-indigo-700 rounded-lg shadow-lg shadow-indigo-950 bg-slate-200 text-slate-700 p-6 h-fit">
                    {
                        <div className="text-2xl">
                            {clientParticipationNote?.note}
                        </div>
                    }
                </div>
            </div>
            <div className="w-full px-12 text-xl mt-2">
                <p className="pl-3 mb-2">Policies:</p>
                <div className="grid grid-cols-2 gap-3 border-2 border-indigo-700 rounded-lg shadow-lg shadow-indigo-950 bg-slate-200 text-slate-700 p-6 h-fit">
                    {
                        accountPolicies.length === 0 &&
                        <div>No account policies have been signed.</div>
                    }
                    {
                        accountPolicies?.map((policy) => {
                            return <div key={policy.id}>
                                <button className="cursor-pointer" onClick={() => handlePolicy(policy.policy?.title || '')}>{policy.policy?.title}</button>
                            </div>
                        })
                    }
                </div>
            </div>
            <Modal
                onClose={() => setIncidentReportModalIsOpen(false)}
                isOpen={incidentReportModalIsOpen}
            >
                <IncidentReportModal clientId={account?.id} onClose={() => setIncidentReportModalIsOpen(false)} refetchNextStep={refetchNextStep} />
            </Modal>
            <Modal
                onClose={() => setIncidentReportModalViewIsOpen(false)}
                isOpen={incidentReportModalViewIsOpen}
            >
                <IncidentReportViewModal id={incidentId} />
            </Modal>
            <Modal
                onClose={() => setAssessmentModalViewIsOpen(false)}
                isOpen={assessmentModalViewIsOpen}
            >
                <AssessmentViewModal assessment={assessment} accountId={account.id} />
            </Modal>
            <Modal
                onClose={() => setIncidentReportRequiredModalIsOpen(false)}
                isOpen={incidentReportRequiredModalIsOpen}
            >
                <IncidentReportRequireModal accountId={accountId} externalId={userId} onClose={() => setIncidentReportRequiredModalIsOpen(false)} refetchNextStep={refetchNextStep} />
            </Modal>
            <Modal
                onClose={() => setAssessmentRequireModalIsOpen(false)}
                isOpen={assmentRequireModalIsOpen}
            >
                <AssessmentRequireModal accountId={accountId} externalId={userId} onClose={() => setIncidentReportRequiredModalIsOpen(false)} refetchNextStep={refetchNextStep} />
            </Modal>
            <Modal
                onClose={() => setClientRequirementModalIsOpen(false)}
                isOpen={clientRequirementModalIsOpen}
            >
                <ClientRequirementModal accountId={accountId} onClose={() => setClientRequirementModalIsOpen(false)} onRefresh={refreshRequirements} />
            </Modal>
            <Modal
                onClose={() => setClientRequirementUpdateModalIsOpen(false)}
                isOpen={clientRequirementUpdateModalIsOpen}
            >
                <ClientRequirementUpdateModal requirementId={requirementId} onClose={() => setClientRequirementUpdateModalIsOpen(false)} onRefresh={refreshRequirements} />
            </Modal>
            <Modal
                onClose={() => setMessageCreateModalIsOpen(false)}
                isOpen={messageCreateModalIsOpen}
            >
                <MessageCreateModal accountId={accountId} externalId={userId} onClose={() => setMessageCreateModalIsOpen(false)} onRefresh={refreshMessages} />
            </Modal>
            {/*<Modal
                onClose={() => setMessageUpdateModalIsOpen(false)}
                isOpen={messageUpdateModalIsOpen}
            >
                <MessageUpdateModal id={messageId} onClose={() => setMessageUpdateModalIsOpen(false)} onRefresh={refreshMessages} />
            </Modal>
            <Modal
                onClose={() => setClinicalNoteCreationModalIsOpen(false)}
                isOpen={clinicalNoteCreationModalIsOpen}
            >
                <ClinicalNoteCreateModal accountId={accountId} externalId={userId} onClose={() => setClinicalNoteCreationModalIsOpen(false)} onRefresh={refreshClinicalNotes} />
            </Modal>
            <Modal
                onClose={() => setClinicalNoteUpdateModalIsOpen(false)}
                isOpen={clinicalNoteUpdateModalIsOpen}
            >
                <ClinicalNoteUpdateModal id={clinicalNoteId} onClose={() => setClinicalNoteUpdateModalIsOpen(false)} onRefresh={refreshClinicalNotes} />
            </Modal>
            <Modal
                onClose={() => setContactCreationModalIsOpen(false)}
                isOpen={contactCreationModalIsOpen}
            >
                <ContactCreateModal accountId={accountId} onClose={() => setContactCreationModalIsOpen(false)} onRefresh={refreshContacts} />
            </Modal>
            <Modal
                onClose={() => setContactViewModalIsOpen(false)}
                isOpen={contactViewModalIsOpen}
            >
                <ContactViewModal contactId={contactId} onClose={() => setContactViewModalIsOpen(false)} onRefresh={refreshContacts} />
            </Modal>
            <Modal
                onClose={() => setDiscountCreationModalIsOpen(false)}
                isOpen={discountCreationModalIsOpen}
            >
                <DiscountCreateModal accountId={accountId} onClose={() => setDiscountCreationModalIsOpen(false)} onRefresh={refreshDiscounts} />
            </Modal>
            <Modal
                onClose={() => setDiscountPriceUpdateModalIsOpen(false)}
                isOpen={discountPriceUpdateModalIsOpen}
            >
                <DiscountUpdateModal id={discountPriceId} onClose={() => setDiscountPriceUpdateModalIsOpen(false)} onRefresh={refreshDiscounts} />
            </Modal>
            <Modal
                onClose={() => setRequireGoalModalIsOpen(false)}
                isOpen={requireGoalModalIsOpen}
            >
                <GoalRequireModal accountId={accountId} onClose={() => setRequireGoalModalIsOpen(false)} refetchNextStep={refetchNextStep} />
            </Modal>
            <LargeModal
                onClose={() => setGoalModalIsOpen(false)}
                isOpen={goalModalIsOpen}
            >
                <GoalUpdateModal accountId={accountId} goal={goalName} requiredGoalId={requiredGoalId} onClose={() => setGoalModalIsOpen(false)} />
            </LargeModal>
            <LargeModal
                onClose={() => setPolicyIsOpen(false)}
                isOpen={policyIsOpen}
            >
                <AccountPolicyModal policyTitle={policyTitle} accountId={accountId} onClose={() => setPolicyIsOpen(false)} />
            </LargeModal>
            <Modal
                onClose={() => setProgressReportModalIsOpen(false)}
                isOpen={progressReportModalIsOpen}
            >
                <ProgressReportModal 
                    firstName={account.firstName} 
                    lastName={account.lastName} 
                    percentComplete={+percentComplete}
                    requirements={clientRequirements.map((req) => {
                        return {fulfilled: req.fulfilledAmount, required: req.requiredAmount, requirementType: req.requirementType.name }})}
                    contacts={contacts.map((c) => {
                        return {name: `${c.firstName} ${c.lastName}`, email: c.email }})}
                    onClose={() => setProgressReportModalIsOpen(false)}
                />
            </Modal>
            <Modal
                onClose={() => setClientAlertModalIsOpen(false)}
                isOpen={clientAlertModalIsOpen}
            >
                <ClientAlertModal accountId={accountId} onClose={() => setClientAlertModalIsOpen(false)} onRefresh={refreshClientAlert} />
            </Modal>
            <Modal
                onClose={() => setParticipationNoteModalIsOpen(false)}
                isOpen={participationNoteModalIsOpen}
            >
                <ParticipationNoteModal accountId={accountId} onClose={() => setParticipationNoteModalIsOpen(false)} onRefresh={refreshParticipationNote} />
            </Modal>
            <Modal
                onClose={() => setUpdateClientModalIsOpen(false)}
                isOpen={updateClientModalIsOpen}
            >
                <ClientUpdateModal id={accountId} onClose={() => setUpdateClientModalIsOpen(false)} onRefresh={refreshClient} />
            </Modal> */}
        </div>
    );
}

export default AccountDashboard;