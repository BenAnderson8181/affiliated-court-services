import type { ClientGoalAnswers } from "@prisma/client";
import { useState } from "react";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";
import { RiStarFill } from "react-icons/ri";

type Props = {
    accountId: string;
    goal: string;
    requiredGoalId: string;
}

const GoalUpdateModal = ({ accountId, goal, requiredGoalId }: Props) => {
    const [showReviewError, setShowReviewError] = useState(false);
    const [showReviewSuccess, setShowReviewSuccess] = useState(false);
    const [showStatusError, setShowStatusError] = useState(false);
    const [showStatusSuccess, setShowStatusSuccess] = useState(false);
    const [showInvalidStatusUpdate, setShowInvalidStatusUpdate] = useState(false);
    const [showInvalidReview, setShowInvalidReview] = useState(false);
    const [showInvalidRequire, setShowInvalidRequire] = useState(false);
    const [showMaximumRequiredGoals, setShowMaximumRequiredGoals] = useState(false);
    const [showClientAccessError, setShowClientAccessError] = useState(false);
    const [showClientAccessSuccess, setShowClientAccessSuccess] = useState(false);
    const [showNoGoalIdError, setShowNoGoalIdError] = useState(false);
    const [showClientAcessRemoveSuccess, setShowClientAcessRemoveSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const goalAchievmentStatusQuery = api.goalAchievementStatus.list.useQuery();
    const clientGoalAnswerQuery = api.clientGoalAnswer.list.useQuery({ clientId: accountId, goal });
    const requiredGoalQuery = api.requiredGoal.get.useQuery({ id: requiredGoalId });
    const clientAccessLimitsQuery = api.clientAccessLimit.list.useQuery({ accountId });
    const goalsQuery = api.goal.list.useQuery();
    const goalAnswerReviewMutation = api.clientGoalAnswer.review.useMutation();
    const goalAnswerStatusMutation = api.clientGoalAnswer.status.useMutation();
    const goalAnswerCurrentMutation = api.clientGoalAnswer.current.useMutation();
    const clientAccessLimitsMutation = api.clientAccessLimit.updateActiveGoals.useMutation();
    const clientGoalAnswerUpsert = api.clientGoalAnswer.upsert.useMutation();

    if (goalAchievmentStatusQuery.isLoading || clientGoalAnswerQuery.isLoading || requiredGoalQuery.isLoading || clientAccessLimitsQuery.isLoading || goalsQuery.isLoading) {
        return <Loading type='Modal' />
    }

    if (goalAchievmentStatusQuery.isError || clientGoalAnswerQuery.isError || requiredGoalQuery.isError || clientAccessLimitsQuery.isError || goalsQuery.isError) {
        return <LoadError type='Modal' />
    }

    const goalAchievementStatuses = goalAchievmentStatusQuery.data;
    const inProgressStatusId = goalAchievementStatuses.find((s) => s.name === 'InProgress')?.id;
    if (!inProgressStatusId) {
        return <LoadError type='Modal' />
    }

    const clientAccessLimits = clientAccessLimitsQuery.data;

    // const requiredGoal = requiredGoalQuery.data;
    const clientGoalAnswers = clientGoalAnswerQuery.data;
    let question1: ClientGoalAnswers | null | undefined;
    let question2: ClientGoalAnswers | null | undefined;
    let question3: ClientGoalAnswers | null | undefined;
    let question4: ClientGoalAnswers | null | undefined;
    let question5: ClientGoalAnswers | null | undefined;
    let question6: ClientGoalAnswers | null | undefined;
    let question7: ClientGoalAnswers | null | undefined;
    let question8: ClientGoalAnswers | null | undefined;
    let question9: ClientGoalAnswers | null | undefined;
    let question10: ClientGoalAnswers | null | undefined;
    let question11: ClientGoalAnswers | null | undefined;
    let question12: ClientGoalAnswers | null | undefined;
    let question13: ClientGoalAnswers | null | undefined;
    let question14: ClientGoalAnswers | null | undefined;
    let question15: ClientGoalAnswers | null | undefined;
    let question16: ClientGoalAnswers | null | undefined;
    let question17: ClientGoalAnswers | null | undefined;
    let question18: ClientGoalAnswers | null | undefined;
    let question19: ClientGoalAnswers | null | undefined;
    let question20: ClientGoalAnswers | null | undefined;
    let question21: ClientGoalAnswers | null | undefined;
    let question22: ClientGoalAnswers | null | undefined;
    let question23: ClientGoalAnswers | null | undefined;
    let question24: ClientGoalAnswers | null | undefined;
    let question25: ClientGoalAnswers | null | undefined;
    let question26: ClientGoalAnswers | null | undefined;

    switch (goal) {
        case 'Orientation':
            question1 = clientGoalAnswers.find((a) => a.question === 'confidence 1');
            question2 = clientGoalAnswers.find((a) => a.question === 'confidence 2');
            question3 = clientGoalAnswers.find((a) => a.question === 'confidence 3');
            question4 = clientGoalAnswers.find((a) => a.question === 'confidence 4');
            question5 = clientGoalAnswers.find((a) => a.question === 'accountability 1');
            question6 = clientGoalAnswers.find((a) => a.question === 'accountability 2');
            question7 = clientGoalAnswers.find((a) => a.question === 'accountability 3');
            question8 = clientGoalAnswers.find((a) => a.question === 'accountability 4');
            question9 = clientGoalAnswers.find((a) => a.question === 'communication 1');
            question10 = clientGoalAnswers.find((a) => a.question === 'communication 2');
            question11 = clientGoalAnswers.find((a) => a.question === 'communication 3');
            question12 = clientGoalAnswers.find((a) => a.question === 'communication 4');
            question13 = clientGoalAnswers.find((a) => a.question === 'boundary 1');
            question14 = clientGoalAnswers.find((a) => a.question === 'boundary 2');
            question15 = clientGoalAnswers.find((a) => a.question === 'boundary 3');
            question16 = clientGoalAnswers.find((a) => a.question === 'boundary 4');
            break;

        case 'Domestic Violence':
            question1 = clientGoalAnswers.find((a) => a.question === 'dv accountability 1');
            question2 = clientGoalAnswers.find((a) => a.question === 'dv accountability 2');
            question3 = clientGoalAnswers.find((a) => a.question === 'dv accountability 3');
            question4 = clientGoalAnswers.find((a) => a.question === 'dv accountability 4');
            question5 = clientGoalAnswers.find((a) => a.question === 'regulation 1');
            question6 = clientGoalAnswers.find((a) => a.question === 'regulation 2');
            question7 = clientGoalAnswers.find((a) => a.question === 'regulation 3');
            question8 = clientGoalAnswers.find((a) => a.question === 'regulation 4');
            question9 = clientGoalAnswers.find((a) => a.question === 'healthy 1');
            question10 = clientGoalAnswers.find((a) => a.question === 'healthy 2');
            question11 = clientGoalAnswers.find((a) => a.question === 'healthy 3');
            question12 = clientGoalAnswers.find((a) => a.question === 'healthy 4');
            question13 = clientGoalAnswers.find((a) => a.question === 'conflict 1');
            question14 = clientGoalAnswers.find((a) => a.question === 'conflict 2');
            question15 = clientGoalAnswers.find((a) => a.question === 'conflict 3');
            question16 = clientGoalAnswers.find((a) => a.question === 'conflict 4');
            question17 = clientGoalAnswers.find((a) => a.question === 'belief 1');
            question18 = clientGoalAnswers.find((a) => a.question === 'belief 2');
            question19 = clientGoalAnswers.find((a) => a.question === 'belief 3');
            question20 = clientGoalAnswers.find((a) => a.question === 'belief 4');
            question21 = clientGoalAnswers.find((a) => a.question === 'belief 5');
            question22 = clientGoalAnswers.find((a) => a.question === 'belief 6');
            question23 = clientGoalAnswers.find((a) => a.question === 'belief 7');
            question24 = clientGoalAnswers.find((a) => a.question === 'belief 8');
            question25 = clientGoalAnswers.find((a) => a.question === 'belief 9');
            question26 = clientGoalAnswers.find((a) => a.question === 'belief 10');
            break;

        case 'Substance Use':
            question1 = clientGoalAnswers.find((a) => a.question === 'consequences 1');
            question2 = clientGoalAnswers.find((a) => a.question === 'consequences 2');
            question3 = clientGoalAnswers.find((a) => a.question === 'consequences 3');
            question4 = clientGoalAnswers.find((a) => a.question === 'causes 1');
            question5 = clientGoalAnswers.find((a) => a.question === 'causes 2');
            question6 = clientGoalAnswers.find((a) => a.question === 'causes 3');
            question7 = clientGoalAnswers.find((a) => a.question === 'avoiding 1');
            question8 = clientGoalAnswers.find((a) => a.question === 'avoiding 2');
            question9 = clientGoalAnswers.find((a) => a.question === 'avoiding 3');
            question10 = clientGoalAnswers.find((a) => a.question === 'avoiding 4');
            question11 = clientGoalAnswers.find((a) => a.question === 'finding 1');
            question12 = clientGoalAnswers.find((a) => a.question === 'finding 2');
            question13 = clientGoalAnswers.find((a) => a.question === 'finding 3');
            question14 = clientGoalAnswers.find((a) => a.question === 'finding 4');
            break;

        case 'Anger Management':
            question1 = clientGoalAnswers.find((a) => a.question === 'elements 1');
            question2 = clientGoalAnswers.find((a) => a.question === 'elements 2');
            question3 = clientGoalAnswers.find((a) => a.question === 'elements 3');
            question4 = clientGoalAnswers.find((a) => a.question === 'am consequences 1');
            question5 = clientGoalAnswers.find((a) => a.question === 'am consequences 2');
            question6 = clientGoalAnswers.find((a) => a.question === 'am consequences 3');
            question7 = clientGoalAnswers.find((a) => a.question === 'am consequences 4');
            question8 = clientGoalAnswers.find((a) => a.question === 'aggressive 1');
            question9 = clientGoalAnswers.find((a) => a.question === 'aggressive 2');
            question10 = clientGoalAnswers.find((a) => a.question === 'aggressive 3');
            question11 = clientGoalAnswers.find((a) => a.question === 'aggressive 4');
            question12 = clientGoalAnswers.find((a) => a.question === 'trigger 1');
            question13 = clientGoalAnswers.find((a) => a.question === 'trigger 2');
            question14 = clientGoalAnswers.find((a) => a.question === 'trigger 3');
            question15 = clientGoalAnswers.find((a) => a.question === 'trigger 4');
            question16 = clientGoalAnswers.find((a) => a.question === 'calming 1');
            question17 = clientGoalAnswers.find((a) => a.question === 'calming 2');
            question18 = clientGoalAnswers.find((a) => a.question === 'calming 3');
            question19 = clientGoalAnswers.find((a) => a.question === 'calming 4');
            break;

        case 'Cognitive Restructuring':
            question1 = clientGoalAnswers.find((a) => a.question === 'awareness 1');
            question2 = clientGoalAnswers.find((a) => a.question === 'awareness 2');
            question3 = clientGoalAnswers.find((a) => a.question === 'awareness 3');
            question4 = clientGoalAnswers.find((a) => a.question === 'inaccurate 1');
            question5 = clientGoalAnswers.find((a) => a.question === 'inaccurate 2');
            question6 = clientGoalAnswers.find((a) => a.question === 'inaccurate 3');
            question7 = clientGoalAnswers.find((a) => a.question === 'dysfunctional 1');
            question8 = clientGoalAnswers.find((a) => a.question === 'dysfunctional 2');
            question9 = clientGoalAnswers.find((a) => a.question === 'dysfunctional 3');
            question10 = clientGoalAnswers.find((a) => a.question === 'dysfunctional 4');
            question11 = clientGoalAnswers.find((a) => a.question === 'dysfunctional 5');
            question12 = clientGoalAnswers.find((a) => a.question === 'dysfunctional 6');
            question13 = clientGoalAnswers.find((a) => a.question === 'dysfunctional 7');
            question14 = clientGoalAnswers.find((a) => a.question === 'dysfunctional 8');
            question15 = clientGoalAnswers.find((a) => a.question === 'dysfunctional 9');
            break;

        case 'Miscellaneous':
            question1 = clientGoalAnswers.find((a) => a.question === 'boundaries 1');
            question2 = clientGoalAnswers.find((a) => a.question === 'boundaries 2');
            question3 = clientGoalAnswers.find((a) => a.question === 'boundaries 3');
            question4 = clientGoalAnswers.find((a) => a.question === 'boundaries 4');
            question5 = clientGoalAnswers.find((a) => a.question === 'no 1');
            question6 = clientGoalAnswers.find((a) => a.question === 'no 2');
            question7 = clientGoalAnswers.find((a) => a.question === 'no 3');
            question8 = clientGoalAnswers.find((a) => a.question === 'listening 1');
            question9 = clientGoalAnswers.find((a) => a.question === 'listening 2');
            question10 = clientGoalAnswers.find((a) => a.question === 'listening 3');
            question11 = clientGoalAnswers.find((a) => a.question === 'listening 4');
            question12 = clientGoalAnswers.find((a) => a.question === 'commitment 1');
            question13 = clientGoalAnswers.find((a) => a.question === 'commitment 2');
            question14 = clientGoalAnswers.find((a) => a.question === 'commitment 3');
            question15 = clientGoalAnswers.find((a) => a.question === 'commitment 4');
            question16 = clientGoalAnswers.find((a) => a.question === 'commitment 5');
            break;
    }

    const handleReviewUpdate = async (review: string, id: string) => {
        if (!isProcessing) {
            if (review === '' || id === '') {
                setShowInvalidReview(true);
                return;
            }
    
            setIsProcessing(true);
            await goalAnswerReviewMutation.mutateAsync({
                id,
                review
            })
            .catch((err) => {
                console.error('error: ', err);
                setShowReviewError(true);
                setIsProcessing(false);
                return;
            });
    
            if (!goalAnswerReviewMutation.isError) {
                setShowReviewSuccess(true);
                clearMessages();
                window.setTimeout(() => {
                    setShowReviewSuccess(false);
                    clientGoalAnswerQuery.refetch();
                    setIsProcessing(false);
                }, 5000)
            }
        }
    }

    const handleStatusUpdate = async (statusId: string, id: string) => {
        if (!isProcessing) {
            if (statusId === '' || id === '') {
                setShowInvalidStatusUpdate(true);
                return;
            }

            setIsProcessing(true);
    
            await goalAnswerStatusMutation.mutateAsync({
                id,
                statusId
            })
            .catch((err) => {
                console.error('error: ', err);
                setShowStatusError(true);
                setIsProcessing(false);
                return;
            });
    
            if (!goalAnswerStatusMutation.isError) {
                setShowStatusSuccess(true);
                clearMessages();
                window.setTimeout(() => {
                    setShowStatusSuccess(false);
                    clientGoalAnswerQuery.refetch();
                    setIsProcessing(false);
                }, 5000)
            }
        }
        
    }

    // ** if the question id is empty what we want to do is create a clientgoalanswer similar to a client answering a question
    const handleRequire = async (question: string, questionId?: string) => {
        if (!isProcessing) {
            if ((clientAccessLimits?.activeGoals ?? 0) >= 3) {
                setShowMaximumRequiredGoals(true);
                setIsProcessing(false);
                return;
            }
    
            setIsProcessing(true);
    
            if (questionId != undefined) {
                await goalAnswerCurrentMutation.mutateAsync({
                    id: questionId,
                    current: true
                })
                .catch((err) => {
                    console.error('error: ', err);
                    setShowClientAccessError(true);
                    setIsProcessing(false);
                    return;
                });
            }
            else {
                // This should be a create
                let goalMatch = '';
                switch(goal) {
                    case 'Orientation':
                        goalMatch = 'orientation';
                        break;

                    case 'Domestic Violence':
                        goalMatch = 'dv';
                        break;

                    case 'Substance Use':
                        goalMatch = 'sud';
                        break;

                    case 'Anger Management':
                        goalMatch = 'am';
                        break;

                    case 'Cognitive Restructuring':
                        goalMatch = 'cr';
                        break;

                    case 'Miscellaneous':
                        goalMatch = 'mi';
                        break;
                }

                const goalData = goalsQuery.data?.find((g) => g.url === goalMatch);
                const goalId = goalData?.id;
                
                if (goalId === '' || goalId == undefined) {
                    setShowNoGoalIdError(true);
                    setIsProcessing(false);
                    return;
                }
    
                await clientGoalAnswerUpsert.mutateAsync({
                    clientId: accountId,
                    goalId,
                    question,
                    answer: '',
                    current: true
                })
                .catch((err) => {
                    console.error('error: ', err);
                    setShowClientAccessError(true);
                    setIsProcessing(false);
                    return;
                });
            }
    
            if (!goalAnswerCurrentMutation.isError) {
                clientGoalAnswerQuery.refetch();
            }
    
            await clientAccessLimitsMutation.mutateAsync({
                accountId,
                isIncrease: true
            })
            .catch((err) => {
                console.error('error: ', err);
                setShowClientAccessError(true);
                setIsProcessing(false);
                return;
            });
    
            if (!clientAccessLimitsMutation.isError) {
                setShowClientAccessSuccess(true);
                clientAccessLimitsQuery.refetch();
                clearMessages();
                window.setTimeout(() => {
                    setShowClientAccessSuccess(false);
                    setIsProcessing(false);
                }, 5000);
            }
        }
    }

    const handleRemoveRequire = async (questionId: string) => {
        if (!isProcessing) {
            if (questionId === '') {
                setShowInvalidRequire(true);
                setIsProcessing(false);
                return;
            }
    
            setIsProcessing(true);
    
            await clientAccessLimitsMutation.mutateAsync({
                accountId,
                isIncrease: false
            })
            .catch((err) => {
                console.error('error: ', err);
                setShowClientAccessError(true);
                setIsProcessing(false);
                return;
            });
    
            if (!clientAccessLimitsMutation.isError) {
                setShowClientAcessRemoveSuccess(true);
                clientAccessLimitsQuery.refetch();
                window.setTimeout(() => {
                    setShowClientAcessRemoveSuccess(false);
                    setIsProcessing(false);
                }, 5000);
            }
    
            await goalAnswerCurrentMutation.mutateAsync({
                id: questionId,
                current: false
            })
            .catch((err) => {
                console.error('error: ', err);
                setShowClientAccessError(true);
                setIsProcessing(false);
                return;
            });
    
            if (!goalAnswerCurrentMutation.isError) {
                clientGoalAnswerQuery.refetch();
                clearMessages();
            }
        }
    }

    const clearMessages = () => {
        setShowReviewError(false);
        setShowClientAccessError(false);
        setShowInvalidRequire(false);
        setShowInvalidReview(false);
        setShowInvalidStatusUpdate(false);
        setShowMaximumRequiredGoals(false);
        setShowNoGoalIdError(false);
        setShowReviewError(false);
        setShowStatusError(false);
    }

    return (
        <div className="h-fit w-full text-2xl">
            <div className="flex flex-row justify-center mb-2 text-3xl py-2 bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 w-full">Manage Client Goal</div>
            {
                goal === 'Orientation' && 
                <>
                    <div className="flex flex-col justify-start w-full p-5">
                        <div className="inline-flex justify-between">
                            <div className="font-semibold text-2xl w-full">Treatment Goal 1 - Self Confidence</div>
                        </div>
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>1. Identify 3 of your core values</div>
                            {
                                question1?.id &&
                                <div className="relative">
                                    {
                                        question1?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question1?.id ?? '')} /></span>
                                    }
                                    {
                                        !question1?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('confidence 1', question1?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question1?.review30 === false || question1?.review60 === false || question1?.review90 === false) && question1?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review30 === false ? '30' 
                                            : question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review60 === false ? '60'
                                            : '90'
                                            , question1?.id ?? '')}>
                                        { question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review30 === false ? '30' 
                                            : question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review60 === false ? '60'
                                            : question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question1?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question1?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question1?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('confidence 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'confidence 1')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. Identify 3 of your core strengths</div>
                            {
                                question2?.id &&
                                <div className="relative">
                                    {
                                        question2?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question2?.id ?? '')} /></span>
                                    }
                                    {
                                        !question2?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('confidence 1', question2?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question2?.review30 === false || question2?.review60 === false || question2?.review90 === false) && question2?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review30 === false ? '30' 
                                            : question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review60 === false ? '60'
                                            : '90'
                                            , question2?.id ?? '')}>
                                        { question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review30 === false ? '30' 
                                            : question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review60 === false ? '60'
                                            : question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question2?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question2?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question2?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('confidence 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'confidence 2')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. Identify 3 challenges that lower your self confidence</div>
                            {
                                question3?.id &&
                                <div className="relative">
                                    {
                                        question3?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question3?.id ?? '')} /></span>
                                    }
                                    {
                                        !question3?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('confidence 1', question3?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question3?.review30 === false || question3?.review60 === false || question3?.review90 === false) && question3?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review30 === false ? '30' 
                                            : question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review60 === false ? '60'
                                            : '90'
                                            , question3?.id ?? '')}>
                                        { question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review30 === false ? '30' 
                                            : question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review60 === false ? '60'
                                            : question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question3?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question3?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question3?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('confidence 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'confidence 3')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>4. Choose one new habit for personal development</div>
                            {
                                question4?.id &&
                                <div className="relative">
                                    {
                                        question4?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question4?.id ?? '')} /></span>
                                    }
                                    {
                                        !question4?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('confidence 1', question4?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question4?.review30 === false || question4?.review60 === false || question4?.review90 === false) && question4?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review30 === false ? '30' 
                                            : question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review60 === false ? '60'
                                            : '90'
                                            , question4?.id ?? '')}>
                                        { question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review30 === false ? '30' 
                                            : question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review60 === false ? '60'
                                            : question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question4?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question4?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question4?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('confidence 4')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'confidence 4')?.answer} disabled />
                    </div>
                    <br />
                    <div className="flex flex-col justify-start w-full p-5">
                        <div className="font-semibold text-2xl w-full">Treatment Goal 2 - Accountability</div>
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>1. Identify 3 thinking errors related to avoiding accountability</div>
                            {
                                question5?.id &&
                                <div className="relative">
                                    {
                                        question5?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question5?.id ?? '')} /></span>
                                    }
                                    {
                                        !question5?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('confidence 1', question5?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question5?.review30 === false || question5?.review60 === false || question5?.review90 === false) && question5?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review30 === false ? '30' 
                                            : question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review60 === false ? '60'
                                            : '90'
                                            , question5?.id ?? '')}>
                                        { question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review30 === false ? '30' 
                                            : question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review60 === false ? '60'
                                            : question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question5?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question5?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question5?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('accountability 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'accountability 1')?.answer } disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. Identify 3 excuses used to avoid taking responsibility for actions</div>
                            {
                                question6?.id &&
                                <div className="relative">
                                    {
                                        question6?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question6?.id ?? '')} /></span>
                                    }
                                    {
                                        !question6?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('confidence 1', question6?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question6?.review30 === false || question6?.review60 === false || question6?.review90 === false) && question6?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review30 === false ? '30' 
                                            : question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review60 === false ? '60'
                                            : '90'
                                            , question6?.id ?? '')}>
                                        { question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review30 === false ? '30' 
                                            : question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review60 === false ? '60'
                                            : question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question6?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question6?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question6?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('accountability 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'accountability 2')?.answer } disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. Clearly state your part in the problem without justifying, minimizing or blaming</div>
                            {
                                question7?.id &&
                                <div className="relative">
                                    {
                                        question7?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question7?.id ?? '')} /></span>
                                    }
                                    {
                                        !question7?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('confidence 1', question7?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question7?.review30 === false || question7?.review60 === false || question7?.review90 === false) && question7?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review30 === false ? '30' 
                                            : question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review60 === false ? '60'
                                            : '90'
                                            , question7?.id ?? '')}>
                                        { question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review30 === false ? '30' 
                                            : question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review60 === false ? '60'
                                            : question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question7?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question7?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question7?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('accountability 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'accountability 3')?.answer } disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>4. Explain why accountability = empowerment</div>
                            {
                                question8?.id &&
                                <div className="relative">
                                    {
                                        question8?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question8?.id ?? '')} /></span>
                                    }
                                    {
                                        !question8?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('confidence 1', question8?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question8?.review30 === false || question8?.review60 === false || question8?.review90 === false) && question8?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review30 === false ? '30' 
                                            : question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review60 === false ? '60'
                                            : '90'
                                            , question8?.id ?? '')}>
                                        { question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review30 === false ? '30' 
                                            : question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review60 === false ? '60'
                                            : question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question8?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question8?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question8?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('accountability 4')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'accountability 4')?.answer } disabled />
                    </div>
                    <br />
                    <div className="flex flex-col justify-start w-full p-5">
                        <div className="font-semibold text-2xl w-full">Treatment Goal 3 - Assertive Communication Skills</div>
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>1. Give 3 examples of when you used Aggressive Communication</div>
                            {
                                question9?.id &&
                                <div className="relative">
                                    {
                                        question9?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question9?.id ?? '')} /></span>
                                    }
                                    {
                                        !question9?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('confidence 1', question9?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question9?.review30 === false || question9?.review60 === false || question9?.review90 === false) && question9?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review30 === false ? '30' 
                                            : question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review60 === false ? '60'
                                            : '90'
                                            , question9?.id ?? '')}>
                                        { question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review30 === false ? '30' 
                                            : question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review60 === false ? '60'
                                            : question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question9?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question9?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question9?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('communication 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'communication 1')?.answer } disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. Give 3 examples of when you used Passive Communication</div>
                            {
                                question10?.id &&
                                <div className="relative">
                                    {
                                        question10?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question10?.id ?? '')} /></span>
                                    }
                                    {
                                        !question10?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('confidence 1', question10?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question10?.review30 === false || question10?.review60 === false || question10?.review90 === false) && question10?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review30 === false ? '30' 
                                            : question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review60 === false ? '60'
                                            : '90'
                                            , question10?.id ?? '')}>
                                        { question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review30 === false ? '30' 
                                            : question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review60 === false ? '60'
                                            : question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question10?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question10?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question10?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('communication 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'communication 2')?.answer } disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. Give 3 examples of when you used Passive/Aggressive Communication</div>
                            {
                                question11?.id &&
                                <div className="relative">
                                    {
                                        question11?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question11?.id ?? '')} /></span>
                                    }
                                    {
                                        !question11?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('confidence 1', question11?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question11?.review30 === false || question11?.review60 === false || question11?.review90 === false) && question11?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review30 === false ? '30' 
                                            : question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review60 === false ? '60'
                                            : '90'
                                            , question11?.id ?? '')}>
                                        { question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review30 === false ? '30' 
                                            : question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review60 === false ? '60'
                                            : question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question11?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question11?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question11?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('communication 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'communication 3')?.answer } disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>4. Give 3 examples of when you used Assertive Communication</div>
                            {
                                question12?.id &&
                                <div className="relative">
                                    {
                                        question12?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question12?.id ?? '')} /></span>
                                    }
                                    {
                                        !question12?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('confidence 1', question12?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question12?.review30 === false || question12?.review60 === false || question12?.review90 === false) && question12?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review30 === false ? '30' 
                                            : question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review60 === false ? '60'
                                            : '90'
                                            , question12?.id ?? '')}>
                                        { question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review30 === false ? '30' 
                                            : question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review60 === false ? '60'
                                            : question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question12?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question12?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question12?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('communication 4')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'communication 4')?.answer } disabled />
                    </div>
                    <br />
                    <div className="flex flex-col justify-start w-full p-5">
                        <div className="font-semibold text-2xl w-full">Treatment Goal 4 - Boundary Setting Skills</div>
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>1. Explain why boundaries are important</div>
                            {
                                question13?.id &&
                                <div className="relative">
                                    {
                                        question13?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question13?.id ?? '')} /></span>
                                    }
                                    {
                                        !question13?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('confidence 1', question13?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question13?.review30 === false || question13?.review60 === false || question13?.review90 === false) && question13?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review30 === false ? '30' 
                                            : question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review60 === false ? '60'
                                            : '90'
                                            , question13?.id ?? '')}>
                                        { question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review30 === false ? '30' 
                                            : question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review60 === false ? '60'
                                            : question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question13?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question13?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question13?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('boundary 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'boundary 1')?.answer } disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. Identify 3 non-negotiable boundaries, and state consequences</div>
                            {
                                question14?.id &&
                                <div className="relative">
                                    {
                                        question14?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question14?.id ?? '')} /></span>
                                    }
                                    {
                                        !question14?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('confidence 1', question14?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question14?.review30 === false || question14?.review60 === false || question14?.review90 === false) && question14?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review30 === false ? '30' 
                                            : question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review60 === false ? '60'
                                            : '90'
                                            , question14?.id ?? '')}>
                                        { question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review30 === false ? '30' 
                                            : question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review60 === false ? '60'
                                            : question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question14?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question14?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question14?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('boundary 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'boundary 2')?.answer } disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. Identify 3 negotiable boundaries, and state consequnces</div>
                            {
                                question15?.id &&
                                <div className="relative">
                                    {
                                        question15?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question15?.id ?? '')} /></span>
                                    }
                                    {
                                        !question15?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('confidence 1', question15?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question15?.review30 === false || question15?.review60 === false || question15?.review90 === false) && question15?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review30 === false ? '30' 
                                            : question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review60 === false ? '60'
                                            : '90'
                                            , question15?.id ?? '')}>
                                        { question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review30 === false ? '30' 
                                            : question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review60 === false ? '60'
                                            : question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question15?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question15?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question15?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('boundary 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'boundary 3')?.answer } disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>4. Practice saying no to someone who&apos;s disrespecting your boundaries</div>
                            {
                                question16?.id &&
                                <div className="relative">
                                    {
                                        question16?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question16?.id ?? '')} /></span>
                                    }
                                    {
                                        !question16?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('confidence 1', question16?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question16?.review30 === false || question16?.review60 === false || question16?.review90 === false) && question16?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question16?.goalAchievmentStatusId === inProgressStatusId && question16?.review30 === false ? '30' 
                                            : question16?.goalAchievmentStatusId === inProgressStatusId && question16?.review60 === false ? '60'
                                            : '90'
                                            , question16?.id ?? '')}>
                                        { question16?.goalAchievmentStatusId === inProgressStatusId && question16?.review30 === false ? '30' 
                                            : question16?.goalAchievmentStatusId === inProgressStatusId && question16?.review60 === false ? '60'
                                            : question16?.goalAchievmentStatusId === inProgressStatusId && question16?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question16?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question16?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question16?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('boundary 4')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'boundary 4')?.answer } disabled />
                    </div>
                </>
            }
            {
                goal === 'Domestic Violence' &&
                <>
                    <div className="flex flex-col justify-start w-full p-5">
                        <div className="inline-flex justify-between">
                            <div className="font-semibold text-2xl w-full">Accountability</div>
                        </div>
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>1. Explain why blaming your partner is not helpful to you.</div>
                            {
                                question1?.id &&
                                <div className="relative">
                                    {
                                        question1?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question1?.id ?? '')} /></span>
                                    }
                                    {
                                        !question1?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('dv accountability 1', question1?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question1?.review30 === false || question1?.review60 === false || question1?.review90 === false) && question1?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review30 === false ? '30' 
                                            : question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review60 === false ? '60'
                                            : '90'
                                            , question1?.id ?? '')}>
                                        { question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review30 === false ? '30' 
                                            : question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review60 === false ? '60'
                                            : question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question1?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question1?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question1?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('dv accountability 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'dv accountability 1')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. Explain why blaming the legal system is detrimental to you.</div>
                            {
                                question2?.id &&
                                <div className="relative">
                                    {
                                        question2?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question2?.id ?? '')} /></span>
                                    }
                                    {
                                        !question2?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('dv accountability 2', question2?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question2?.review30 === false || question2?.review60 === false || question2?.review90 === false) && question2?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review30 === false ? '30' 
                                            : question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review60 === false ? '60'
                                            : '90'
                                            , question2?.id ?? '')}>
                                        { question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review30 === false ? '30' 
                                            : question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review60 === false ? '60'
                                            : question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question2?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question2?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question2?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('dv accountability 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'dv accountability 2')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. Identify three thinking errors that have kept you from taking responsibility for your legal situation.</div>
                            {
                                question3?.id &&
                                <div className="relative">
                                    {
                                        question3?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question3?.id ?? '')} /></span>
                                    }
                                    {
                                        !question3?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('dv accountability 3', question3?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question3?.review30 === false || question3?.review60 === false || question3?.review90 === false) && question3?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review30 === false ? '30' 
                                            : question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review60 === false ? '60'
                                            : '90'
                                            , question3?.id ?? '')}>
                                        { question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review30 === false ? '30' 
                                            : question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review60 === false ? '60'
                                            : question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question3?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question3?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question3?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('dv accountability 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'dv accountability 3')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>4. Clearly state your part in the incident that resulted in your charges without justifying, minimizing, or blaming.  &#40;Start with the phrase, &#34;I am a good person that made a mistake.  This is what I did.&#34;&#41;</div>
                            {
                                question4?.id &&
                                <div className="relative">
                                    {
                                        question4?.isCurrent &&
                                        <span className="cursor-pointer absolute right-32"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question4?.id ?? '')} /></span>
                                    }
                                    {
                                        !question4?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('dv accountability 4', question4?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question4?.review30 === false || question4?.review60 === false || question4?.review90 === false) && question4?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className={`p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer ${!question4?.isCurrent ? '' : 'ml-16'} mb-3`}
                                        onClick={() => handleReviewUpdate(question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review30 === false ? '30' 
                                            : question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review60 === false ? '60'
                                            : '90'
                                            , question4?.id ?? '')}>
                                        { question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review30 === false ? '30' 
                                            : question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review60 === false ? '60'
                                            : question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question4?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question4?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question4?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('dv accountability 4')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'dv accountability 4')?.answer} disabled />
                        <br />
                        <div className="inline-flex justify-start w-full p-5">
                            <div className="font-semibold text-2xl w-full">Emotional Regulation</div>
                        </div>
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>1. Identify three things that trigger intense emotions in you.</div>
                            {
                                question5?.id &&
                                <div className="relative">
                                    {
                                        question5?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question5?.id ?? '')} /></span>
                                    }
                                    {
                                        !question5?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('regulation 1', question5?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question5?.review30 === false || question5?.review60 === false || question5?.review90 === false) && question5?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review30 === false ? '30' 
                                            : question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review60 === false ? '60'
                                            : '90'
                                            , question5?.id ?? '')}>
                                        { question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review30 === false ? '30' 
                                            : question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review60 === false ? '60'
                                            : question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question5?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question5?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question5?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('regulation 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'regulation 1')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. Identify three deep emotions you have covered up with anger.</div>
                            {
                                question6?.id &&
                                <div className="relative">
                                    {
                                        question6?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question6?.id ?? '')} /></span>
                                    }
                                    {
                                        !question6?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('regulation 2', question6?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question6?.review30 === false || question6?.review60 === false || question6?.review90 === false) && question6?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review30 === false ? '30' 
                                            : question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review60 === false ? '60'
                                            : '90'
                                            , question6?.id ?? '')}>
                                        { question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review30 === false ? '30' 
                                            : question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review60 === false ? '60'
                                            : question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question6?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question6?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question6?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('regulation 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'regulation 2')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. Identify three trigger thoughts that escalate your emotions and three thoughts that calm you down.</div>
                            {
                                question7?.id &&
                                <div className="relative">
                                    {
                                        question7?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question7?.id ?? '')} /></span>
                                    }
                                    {
                                        !question7?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('regulation 3', question7?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question7?.review30 === false || question7?.review60 === false || question7?.review90 === false) && question7?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review30 === false ? '30' 
                                            : question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review60 === false ? '60'
                                            : '90'
                                            , question7?.id ?? '')}>
                                        { question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review30 === false ? '30' 
                                            : question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review60 === false ? '60'
                                            : question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question7?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question7?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question7?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('regulation 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'regulation 3')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>4. Identify three techniques to regulate intense emotions.</div>
                            {
                                question8?.id &&
                                <div className="relative">
                                    {
                                        question8?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question8?.id ?? '')} /></span>
                                    }
                                    {
                                        !question8?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('regulation 4', question8?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question8?.review30 === false || question8?.review60 === false || question8?.review90 === false) && question8?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review30 === false ? '30' 
                                            : question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review60 === false ? '60'
                                            : '90'
                                            , question8?.id ?? '')}>
                                        { question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review30 === false ? '30' 
                                            : question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review60 === false ? '60'
                                            : question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question8?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question8?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question8?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('regulation 4')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'regulation 4')?.answer} disabled />
                        <br />
                        <div className="inline-flex justify-start w-full p-5">
                            <div className="font-semibold text-2xl w-full">Healthy Relationships</div>
                        </div>
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>1. Identify three communication skills that improve relationships.</div>
                            {
                                question9?.id &&
                                <div className="relative">
                                    {
                                        question9?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question9?.id ?? '')} /></span>
                                    }
                                    {
                                        !question9?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('healthy 1', question9?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question9?.review30 === false || question9?.review60 === false || question9?.review90 === false) && question9?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review30 === false ? '30' 
                                            : question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review60 === false ? '60'
                                            : '90'
                                            , question9?.id ?? '')}>
                                        { question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review30 === false ? '30' 
                                            : question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review60 === false ? '60'
                                            : question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question9?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question9?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question9?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('healthy 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'healthy 1')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. Identify the things you argue about most frequently and list any related thinking errors.</div>
                            {
                                question10?.id &&
                                <div className="relative">
                                    {
                                        question10?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question10?.id ?? '')} /></span>
                                    }
                                    {
                                        !question10?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('healthy 2', question10?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question10?.review30 === false || question10?.review60 === false || question10?.review90 === false) && question10?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review30 === false ? '30' 
                                            : question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review60 === false ? '60'
                                            : '90'
                                            , question10?.id ?? '')}>
                                        { question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review30 === false ? '30' 
                                            : question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review60 === false ? '60'
                                            : question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question10?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question10?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question10?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('healthy 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'healthy 2')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. What dysfunctional beliefs do you have (or have used) that damage your relationship.</div>
                            {
                                question11?.id &&
                                <div className="relative">
                                    {
                                        question11?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question11?.id ?? '')} /></span>
                                    }
                                    {
                                        !question11?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('healthy3', question11?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question11?.review30 === false || question11?.review60 === false || question11?.review90 === false) && question11?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review30 === false ? '30' 
                                            : question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review60 === false ? '60'
                                            : '90'
                                            , question11?.id ?? '')}>
                                        { question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review30 === false ? '30' 
                                            : question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review60 === false ? '60'
                                            : question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question11?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question11?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question11?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('healthy 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'healthy 3')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>4. List three ways to repair your relationship after an emotional injury.</div>
                            {
                                question12?.id &&
                                <div className="relative">
                                    {
                                        question12?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question12?.id ?? '')} /></span>
                                    }
                                    {
                                        !question12?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('healthy 4', question12?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question12?.review30 === false || question12?.review60 === false || question12?.review90 === false) && question12?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review30 === false ? '30' 
                                            : question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review60 === false ? '60'
                                            : '90'
                                            , question12?.id ?? '')}>
                                        { question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review30 === false ? '30' 
                                            : question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review60 === false ? '60'
                                            : question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question12?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question12?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question12?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('healthy 4')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'healthy 4')?.answer} disabled />
                        <br />
                        <div className="inline-flex justify-start w-full p-5">
                            <div className="font-semibold text-2xl w-full">Conflict Resolution</div>
                        </div>
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>1. List four styles of conflict resolution and when it would be appropriate to use them.</div>
                            {
                                question13?.id &&
                                <div className="relative">
                                    {
                                        question13?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question13?.id ?? '')} /></span>
                                    }
                                    {
                                        !question13?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('conflict 1', question13?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question13?.review30 === false || question13?.review60 === false || question13?.review90 === false) && question13?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review30 === false ? '30' 
                                            : question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review60 === false ? '60'
                                            : '90'
                                            , question13?.id ?? '')}>
                                        { question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review30 === false ? '30' 
                                            : question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review60 === false ? '60'
                                            : question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question13?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question13?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question13?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('conflict 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'conflict 1')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. Explain why it is to your advantage to understand the other person&apos;s point of view.</div>
                            {
                                question14?.id &&
                                <div className="relative">
                                    {
                                        question14?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question14?.id ?? '')} /></span>
                                    }
                                    {
                                        !question14?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('conflict 2', question14?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question14?.review30 === false || question14?.review60 === false || question14?.review90 === false) && question14?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review30 === false ? '30' 
                                            : question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review60 === false ? '60'
                                            : '90'
                                            , question14?.id ?? '')}>
                                        { question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review30 === false ? '30' 
                                            : question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review60 === false ? '60'
                                            : question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question14?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question14?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question14?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('conflict 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'conflict 2')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. Describe three steps to prepare for a difficult conversation.</div>
                            {
                                question15?.id &&
                                <div className="relative">
                                    {
                                        question15?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question15?.id ?? '')} /></span>
                                    }
                                    {
                                        !question15?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('conflict 3', question15?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question15?.review30 === false || question15?.review60 === false || question15?.review90 === false) && question15?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review30 === false ? '30' 
                                            : question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review60 === false ? '60'
                                            : '90'
                                            , question15?.id ?? '')}>
                                        { question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review30 === false ? '30' 
                                            : question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review60 === false ? '60'
                                            : question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question15?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question15?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question15?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('conflict 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'conflict 3')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>4. Describe a time when you assertively confronted a conflict.</div>
                            {
                                question16?.id &&
                                <div className="relative">
                                    {
                                        question16?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question16?.id ?? '')} /></span>
                                    }
                                    {
                                        !question16?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('conflict 4', question16?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question16?.review30 === false || question16?.review60 === false || question16?.review90 === false) && question16?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question16?.goalAchievmentStatusId === inProgressStatusId && question16?.review30 === false ? '30' 
                                            : question16?.goalAchievmentStatusId === inProgressStatusId && question16?.review60 === false ? '60'
                                            : '90'
                                            , question16?.id ?? '')}>
                                        { question16?.goalAchievmentStatusId === inProgressStatusId && question16?.review30 === false ? '30' 
                                            : question16?.goalAchievmentStatusId === inProgressStatusId && question16?.review60 === false ? '60'
                                            : question16?.goalAchievmentStatusId === inProgressStatusId && question16?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question16?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question16?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question16?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('conflict 4')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'conflict 4')?.answer} disabled />
                        <br />
                        <div className="inline-flex justify-start w-full p-5">
                            <div className="font-semibold text-2xl w-full">Beliefs that Perpetuate Violence</div>
                        </div>
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>&quot;I demand respect!&quot; Explain why this belief is a problem.</div>
                            {
                                question17?.id &&
                                <div className="relative">
                                    {
                                        question17?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question17?.id ?? '')} /></span>
                                    }
                                    {
                                        !question17?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('belief 1', question17?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question17?.review30 === false || question17?.review60 === false || question17?.review90 === false) && question17?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question17?.goalAchievmentStatusId === inProgressStatusId && question17?.review30 === false ? '30' 
                                            : question17?.goalAchievmentStatusId === inProgressStatusId && question17?.review60 === false ? '60'
                                            : '90'
                                            , question17?.id ?? '')}>
                                        { question17?.goalAchievmentStatusId === inProgressStatusId && question17?.review30 === false ? '30' 
                                            : question17?.goalAchievmentStatusId === inProgressStatusId && question17?.review60 === false ? '60'
                                            : question17?.goalAchievmentStatusId === inProgressStatusId && question17?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question17?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question17?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question17?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('belief 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'belief 1')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. &quot;I cannot show weakness of any kind.&quot; Explain why this belief is a problem.</div>
                            {
                                question18?.id &&
                                <div className="relative">
                                    {
                                        question18?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question18?.id ?? '')} /></span>
                                    }
                                    {
                                        !question18?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('belief 2', question18?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question18?.review30 === false || question18?.review60 === false || question18?.review90 === false) && question18?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question18?.goalAchievmentStatusId === inProgressStatusId && question18?.review30 === false ? '30' 
                                            : question18?.goalAchievmentStatusId === inProgressStatusId && question18?.review60 === false ? '60'
                                            : '90'
                                            , question18?.id ?? '')}>
                                        { question18?.goalAchievmentStatusId === inProgressStatusId && question18?.review30 === false ? '30' 
                                            : question18?.goalAchievmentStatusId === inProgressStatusId && question18?.review60 === false ? '60'
                                            : question18?.goalAchievmentStatusId === inProgressStatusId && question18?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question18?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question18?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question18?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('belief 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'belief 2')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. &quot;They deserved it because _____.&quot; Explain why this belief is a problem.</div>
                            {
                                question19?.id &&
                                <div className="relative">
                                    {
                                        question19?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question19?.id ?? '')} /></span>
                                    }
                                    {
                                        !question19?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('belief 3', question19?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question19?.review30 === false || question19?.review60 === false || question19?.review90 === false) && question19?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question19?.goalAchievmentStatusId === inProgressStatusId && question19?.review30 === false ? '30' 
                                            : question19?.goalAchievmentStatusId === inProgressStatusId && question19?.review60 === false ? '60'
                                            : '90'
                                            , question19?.id ?? '')}>
                                        { question19?.goalAchievmentStatusId === inProgressStatusId && question19?.review30 === false ? '30' 
                                            : question19?.goalAchievmentStatusId === inProgressStatusId && question19?.review60 === false ? '60'
                                            : question19?.goalAchievmentStatusId === inProgressStatusId && question19?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question19?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question19?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question19?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('belief 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'belief 3')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>4. &quot;Men should not show emotions.&quot; Explain why this belief is a problem.</div>
                            {
                                question20?.id &&
                                <div className="relative">
                                    {
                                        question20?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question20?.id ?? '')} /></span>
                                    }
                                    {
                                        !question20?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('belief 4', question20?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question20?.review30 === false || question20?.review60 === false || question20?.review90 === false) && question20?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question20?.goalAchievmentStatusId === inProgressStatusId && question20?.review30 === false ? '30' 
                                            : question20?.goalAchievmentStatusId === inProgressStatusId && question20?.review60 === false ? '60'
                                            : '90'
                                            , question20?.id ?? '')}>
                                        { question20?.goalAchievmentStatusId === inProgressStatusId && question20?.review30 === false ? '30' 
                                            : question20?.goalAchievmentStatusId === inProgressStatusId && question20?.review60 === false ? '60'
                                            : question20?.goalAchievmentStatusId === inProgressStatusId && question20?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question20?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question20?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question20?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('belief 4')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'belief 4')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>5. &quot;Men can&apos;t win in the judicial system.&quot; Explain why this belief is a problem.</div>
                            {
                                question21?.id &&
                                <div className="relative">
                                    {
                                        question21?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question21?.id ?? '')} /></span>
                                    }
                                    {
                                        !question21?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('belief 5', question21?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question21?.review30 === false || question21?.review60 === false || question21?.review90 === false) && question21?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question21?.goalAchievmentStatusId === inProgressStatusId && question21?.review30 === false ? '30' 
                                            : question21?.goalAchievmentStatusId === inProgressStatusId && question21?.review60 === false ? '60'
                                            : '90'
                                            , question21?.id ?? '')}>
                                        { question21?.goalAchievmentStatusId === inProgressStatusId && question21?.review30 === false ? '30' 
                                            : question21?.goalAchievmentStatusId === inProgressStatusId && question21?.review60 === false ? '60'
                                            : question21?.goalAchievmentStatusId === inProgressStatusId && question21?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question21?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question21?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question21?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('belief 5')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'belief 5')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>6. &quot;Women (or men) always _______.&quot; Explain why this belief is a problem.</div>
                            {
                                question22?.id &&
                                <div className="relative">
                                    {
                                        question22?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question22?.id ?? '')} /></span>
                                    }
                                    {
                                        !question22?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('belief 6', question22?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question22?.review30 === false || question22?.review60 === false || question22?.review90 === false) && question22?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question22?.goalAchievmentStatusId === inProgressStatusId && question22?.review30 === false ? '30' 
                                            : question22?.goalAchievmentStatusId === inProgressStatusId && question22?.review60 === false ? '60'
                                            : '90'
                                            , question22?.id ?? '')}>
                                        { question22?.goalAchievmentStatusId === inProgressStatusId && question22?.review30 === false ? '30' 
                                            : question22?.goalAchievmentStatusId === inProgressStatusId && question22?.review60 === false ? '60'
                                            : question22?.goalAchievmentStatusId === inProgressStatusId && question22?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question22?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question22?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question22?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('belief 6')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'belief 6')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>7. Describe a time when you justified your aggressive behavior because you were &quot;right.&quot;</div>
                            {
                                question23?.id &&
                                <div className="relative">
                                    {
                                        question23?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question23?.id ?? '')} /></span>
                                    }
                                    {
                                        !question23?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('belief 7', question23?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question23?.review30 === false || question23?.review60 === false || question23?.review90 === false) && question23?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question23?.goalAchievmentStatusId === inProgressStatusId && question23?.review30 === false ? '30' 
                                            : question23?.goalAchievmentStatusId === inProgressStatusId && question23?.review60 === false ? '60'
                                            : '90'
                                            , question23?.id ?? '')}>
                                        { question23?.goalAchievmentStatusId === inProgressStatusId && question23?.review30 === false ? '30' 
                                            : question23?.goalAchievmentStatusId === inProgressStatusId && question23?.review60 === false ? '60'
                                            : question23?.goalAchievmentStatusId === inProgressStatusId && question23?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question23?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question23?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question23?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('belief 7')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'belief 7')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>8. Describe a time when you used intimidation to get something you &quot;deserve.&quot;</div>
                            {
                                question24?.id &&
                                <div className="relative">
                                    {
                                        question24?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question24?.id ?? '')} /></span>
                                    }
                                    {
                                        !question24?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('belief 8', question24?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question24?.review30 === false || question24?.review60 === false || question24?.review90 === false) && question24?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question24?.goalAchievmentStatusId === inProgressStatusId && question24?.review30 === false ? '30' 
                                            : question24?.goalAchievmentStatusId === inProgressStatusId && question24?.review60 === false ? '60'
                                            : '90'
                                            , question24?.id ?? '')}>
                                        { question24?.goalAchievmentStatusId === inProgressStatusId && question24?.review30 === false ? '30' 
                                            : question24?.goalAchievmentStatusId === inProgressStatusId && question24?.review60 === false ? '60'
                                            : question24?.goalAchievmentStatusId === inProgressStatusId && question24?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question24?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question24?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question24?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('belief 8')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'belief 8')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>9. Describe a time when you started a conflict by expecting someone to accept and submit to your set of rules.</div>
                            {
                                question25?.id &&
                                <div className="relative">
                                    {
                                        question25?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question25?.id ?? '')} /></span>
                                    }
                                    {
                                        !question25?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('belief 9', question25?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question25?.review30 === false || question25?.review60 === false || question25?.review90 === false) && question25?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question25?.goalAchievmentStatusId === inProgressStatusId && question25?.review30 === false ? '30' 
                                            : question25?.goalAchievmentStatusId === inProgressStatusId && question25?.review60 === false ? '60'
                                            : '90'
                                            , question25?.id ?? '')}>
                                        { question25?.goalAchievmentStatusId === inProgressStatusId && question25?.review30 === false ? '30' 
                                            : question25?.goalAchievmentStatusId === inProgressStatusId && question25?.review60 === false ? '60'
                                            : question25?.goalAchievmentStatusId === inProgressStatusId && question25?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question25?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question25?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question25?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('belief 9')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'belief 9')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>10. List three inaccurate beliefs you have (or had) that justify aggression or assault.</div>
                            {
                                question26?.id &&
                                <div className="relative">
                                    {
                                        question26?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question26?.id ?? '')} /></span>
                                    }
                                    {
                                        !question26?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('belief 10', question26?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question26?.review30 === false || question26?.review60 === false || question26?.review90 === false) && question26?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question26?.goalAchievmentStatusId === inProgressStatusId && question26?.review30 === false ? '30' 
                                            : question26?.goalAchievmentStatusId === inProgressStatusId && question26?.review60 === false ? '60'
                                            : '90'
                                            , question26?.id ?? '')}>
                                        { question26?.goalAchievmentStatusId === inProgressStatusId && question26?.review30 === false ? '30' 
                                            : question26?.goalAchievmentStatusId === inProgressStatusId && question26?.review60 === false ? '60'
                                            : question26?.goalAchievmentStatusId === inProgressStatusId && question26?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question26?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question26?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question26?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('belief 10')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'belief 10')?.answer} disabled />
                        <br />
                    </div>
                </>
            }
              {
                goal === 'Substance Use' &&
                <>
                    <div className="flex flex-col justify-start w-full p-5">
                        <div className="inline-flex justify-between">
                            <div className="font-semibold text-2xl w-full">Negative consequences of misusing substances</div>
                        </div>
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>1. What negative consequences have you seen from someone else&apos;s substance use?</div>
                            {
                                question1?.id &&
                                <div className="relative">
                                    {
                                        question1?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question1?.id ?? '')} /></span>
                                    }
                                    {
                                        !question1?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('consequences 1', question1?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question1?.review30 === false || question1?.review60 === false || question1?.review90 === false) && question1?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review30 === false ? '30' 
                                            : question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review60 === false ? '60'
                                            : '90'
                                            , question1?.id ?? '')}>
                                        { question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review30 === false ? '30' 
                                            : question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review60 === false ? '60'
                                            : question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question1?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question1?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question1?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('consequences 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'consequences 1')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. List three negative consequences of your substance use.</div>
                            {
                                question2?.id &&
                                <div className="relative">
                                    {
                                        question2?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question2?.id ?? '')} /></span>
                                    }
                                    {
                                        !question2?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('consequences 2', question2?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question2?.review30 === false || question2?.review60 === false || question2?.review90 === false) && question2?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review30 === false ? '30' 
                                            : question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review60 === false ? '60'
                                            : '90'
                                            , question2?.id ?? '')}>
                                        { question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review30 === false ? '30' 
                                            : question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review60 === false ? '60'
                                            : question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question2?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question2?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question2?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('consequences 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'consequences 2')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. Identify three people who have been affected by your substance misuse.</div>
                            {
                                question3?.id &&
                                <div className="relative">
                                    {
                                        question3?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question3?.id ?? '')} /></span>
                                    }
                                    {
                                        !question3?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('consequences 3', question3?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question3?.review30 === false || question3?.review60 === false || question3?.review90 === false) && question3?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review30 === false ? '30' 
                                            : question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review60 === false ? '60'
                                            : '90'
                                            , question3?.id ?? '')}>
                                        { question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review30 === false ? '30' 
                                            : question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review60 === false ? '60'
                                            : question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question3?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question3?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question3?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('consequences 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'consequences 3')?.answer} disabled />
                        <br />
                        <div className="inline-flex justify-between">
                            <div className="font-semibold text-2xl w-full">Causes of substancce misuse</div>
                        </div>
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>1. Describe how you got started misusing substances.</div>
                            {
                                question4?.id &&
                                <div className="relative">
                                    {
                                        question4?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question4?.id ?? '')} /></span>
                                    }
                                    {
                                        !question4?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('causes 1', question4?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question4?.review30 === false || question4?.review60 === false || question4?.review90 === false) && question4?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review30 === false ? '30' 
                                            : question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review60 === false ? '60'
                                            : '90'
                                            , question4?.id ?? '')}>
                                        { question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review30 === false ? '30' 
                                            : question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review60 === false ? '60'
                                            : question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question4?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question4?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question4?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('causes 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'causes 1')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. List three reasons you continued misusing substances.</div>
                            {
                                question5?.id &&
                                <div className="relative">
                                    {
                                        question5?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question5?.id ?? '')} /></span>
                                    }
                                    {
                                        !question5?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('causes 2', question5?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question5?.review30 === false || question5?.review60 === false || question5?.review90 === false) && question5?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review30 === false ? '30' 
                                            : question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review60 === false ? '60'
                                            : '90'
                                            , question5?.id ?? '')}>
                                        { question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review30 === false ? '30' 
                                            : question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review60 === false ? '60'
                                            : question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question5?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question5?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question5?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('causes 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'causes 2')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. List any underlying issues you have that contribute to your substance misuse and how you will address them.</div>
                            {
                                question6?.id &&
                                <div className="relative">
                                    {
                                        question6?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question6?.id ?? '')} /></span>
                                    }
                                    {
                                        !question6?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('causes 3', question6?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question6?.review30 === false || question6?.review60 === false || question6?.review90 === false) && question6?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review30 === false ? '30' 
                                            : question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review60 === false ? '60'
                                            : '90'
                                            , question6?.id ?? '')}>
                                        { question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review30 === false ? '30' 
                                            : question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review60 === false ? '60'
                                            : question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question6?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question6?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question6?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('causes 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'causes 3')?.answer} disabled />
                        <br />
                        <div className="inline-flex justify-between">
                            <div className="font-semibold text-2xl w-full">Avoiding Relapse</div>
                        </div>
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>1. Identify three relapse triggers for you.</div>
                            {
                                question7?.id &&
                                <div className="relative">
                                    {
                                        question7?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question7?.id ?? '')} /></span>
                                    }
                                    {
                                        !question7?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('avoiding 1', question7?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question7?.review30 === false || question7?.review60 === false || question7?.review90 === false) && question7?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review30 === false ? '30' 
                                            : question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review60 === false ? '60'
                                            : '90'
                                            , question7?.id ?? '')}>
                                        { question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review30 === false ? '30' 
                                            : question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review60 === false ? '60'
                                            : question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question7?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question7?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question7?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('avoiding 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'avoiding 1')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. Identify three relapse prevention techniques that work for you.</div>
                            {
                                question8?.id &&
                                <div className="relative">
                                    {
                                        question8?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question8?.id ?? '')} /></span>
                                    }
                                    {
                                        !question8?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('avoiding 2', question8?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question8?.review30 === false || question8?.review60 === false || question8?.review90 === false) && question8?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review30 === false ? '30' 
                                            : question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review60 === false ? '60'
                                            : '90'
                                            , question8?.id ?? '')}>
                                        { question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review30 === false ? '30' 
                                            : question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review60 === false ? '60'
                                            : question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question8?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question8?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question8?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('avoiding 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'avoiding 2')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. Identify three techniques you will use to avoid relapse.</div>
                            {
                                question9?.id &&
                                <div className="relative">
                                    {
                                        question9?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question9?.id ?? '')} /></span>
                                    }
                                    {
                                        !question9?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('avoiding 3', question9?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question9?.review30 === false || question9?.review60 === false || question9?.review90 === false) && question9?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review30 === false ? '30' 
                                            : question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review60 === false ? '60'
                                            : '90'
                                            , question9?.id ?? '')}>
                                        { question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review30 === false ? '30' 
                                            : question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review60 === false ? '60'
                                            : question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question9?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question9?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question9?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('avoiding 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'avoiding 3')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>4. Describe three positive things you can do if you experience a relapse.</div>
                            {
                                question10?.id &&
                                <div className="relative">
                                    {
                                        question10?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question10?.id ?? '')} /></span>
                                    }
                                    {
                                        !question10?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('avoiding 4', question10?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question10?.review30 === false || question10?.review60 === false || question10?.review90 === false) && question10?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review30 === false ? '30' 
                                            : question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review60 === false ? '60'
                                            : '90'
                                            , question10?.id ?? '')}>
                                        { question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review30 === false ? '30' 
                                            : question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review60 === false ? '60'
                                            : question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question10?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question10?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question10?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('avoiding 4')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'avoiding 4')?.answer} disabled />
                        <br />
                        <div className="inline-flex justify-between">
                            <div className="font-semibold text-2xl w-full">Finding Support</div>
                        </div>
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>1. List your support people and reach out to at least one of them.</div>
                            {
                                question11?.id &&
                                <div className="relative">
                                    {
                                        question11?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question11?.id ?? '')} /></span>
                                    }
                                    {
                                        !question11?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('finding 1', question11?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question11?.review30 === false || question11?.review60 === false || question11?.review90 === false) && question11?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review30 === false ? '30' 
                                            : question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review60 === false ? '60'
                                            : '90'
                                            , question11?.id ?? '')}>
                                        { question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review30 === false ? '30' 
                                            : question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review60 === false ? '60'
                                            : question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question11?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question11?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question11?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('finding 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'finding 1')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. Access at least one new community resource.</div>
                            {
                                question12?.id &&
                                <div className="relative">
                                    {
                                        question12?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question12?.id ?? '')} /></span>
                                    }
                                    {
                                        !question12?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('finding 2', question12?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question12?.review30 === false || question12?.review60 === false || question12?.review90 === false) && question12?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review30 === false ? '30' 
                                            : question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review60 === false ? '60'
                                            : '90'
                                            , question12?.id ?? '')}>
                                        { question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review30 === false ? '30' 
                                            : question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review60 === false ? '60'
                                            : question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question12?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question12?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question12?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('finding 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'finding 2')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. Explain why the people you surround yourself with have such a strong impact on your substance use.</div>
                            {
                                question13?.id &&
                                <div className="relative">
                                    {
                                        question13?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question13?.id ?? '')} /></span>
                                    }
                                    {
                                        !question13?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('finding 3', question13?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question13?.review30 === false || question13?.review60 === false || question13?.review90 === false) && question13?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review30 === false ? '30' 
                                            : question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review60 === false ? '60'
                                            : '90'
                                            , question13?.id ?? '')}>
                                        { question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review30 === false ? '30' 
                                            : question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review60 === false ? '60'
                                            : question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question13?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question13?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question13?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('finding 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'finding 3')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>4. Identify any people in your life that are not supportive of your sobriety and describe how you deal with them.</div>
                            {
                                question14?.id &&
                                <div className="relative">
                                    {
                                        question14?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question14?.id ?? '')} /></span>
                                    }
                                    {
                                        !question14?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('finding 4', question14?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question14?.review30 === false || question14?.review60 === false || question14?.review90 === false) && question14?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review30 === false ? '30' 
                                            : question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review60 === false ? '60'
                                            : '90'
                                            , question14?.id ?? '')}>
                                        { question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review30 === false ? '30' 
                                            : question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review60 === false ? '60'
                                            : question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question14?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question14?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question14?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('finding 4')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'finding 4')?.answer} disabled />
                        <br />
                    </div>
                </>
            }
              {
                goal === 'Anger Management' &&
                <>
                    <div className="flex flex-col justify-start w-full p-5">
                        <div className="inline-flex justify-between">
                            <div className="font-semibold text-2xl w-full">Elements of Anger</div>
                        </div>
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>1. Describe how anger was experienced in your childhood home.</div>
                            {
                                question1?.id &&
                                <div className="relative">
                                    {
                                        question1?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question1?.id ?? '')} /></span>
                                    }
                                    {
                                        !question1?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('elements 1', question1?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question1?.review30 === false || question1?.review60 === false || question1?.review90 === false) && question1?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review30 === false ? '30' 
                                            : question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review60 === false ? '60'
                                            : '90'
                                            , question1?.id ?? '')}>
                                        { question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review30 === false ? '30' 
                                            : question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review60 === false ? '60'
                                            : question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question1?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question1?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question1?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('elements 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'elements 1')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. Identify current life situations that affect your level of anger.</div>
                            {
                                question2?.id &&
                                <div className="relative">
                                    {
                                        question2?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question2?.id ?? '')} /></span>
                                    }
                                    {
                                        !question2?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('elements 2', question2?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question2?.review30 === false || question2?.review60 === false || question2?.review90 === false) && question2?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review30 === false ? '30' 
                                            : question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review60 === false ? '60'
                                            : '90'
                                            , question2?.id ?? '')}>
                                        { question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review30 === false ? '30' 
                                            : question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review60 === false ? '60'
                                            : question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question2?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question2?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question2?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('elements 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'elements 2')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. Identify a dysfunctional core belief that supports your anger and three thoughts that support that belief.</div>
                            {
                                question3?.id &&
                                <div className="relative">
                                    {
                                        question3?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question3?.id ?? '')} /></span>
                                    }
                                    {
                                        !question3?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('elements 3', question3?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question3?.review30 === false || question3?.review60 === false || question3?.review90 === false) && question3?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review30 === false ? '30' 
                                            : question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review60 === false ? '60'
                                            : '90'
                                            , question3?.id ?? '')}>
                                        { question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review30 === false ? '30' 
                                            : question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review60 === false ? '60'
                                            : question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question3?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question3?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question3?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('elements 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'elements 3')?.answer} disabled />
                        <br />
                        <div className="inline-flex justify-between">
                            <div className="font-semibold text-2xl w-full">Consequences of Anger</div>
                        </div>
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>1. Identify three negative Consequences of Anger.</div>
                            {
                                question4?.id &&
                                <div className="relative">
                                    {
                                        question4?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question4?.id ?? '')} /></span>
                                    }
                                    {
                                        !question4?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('am consequences 1', question4?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question4?.review30 === false || question4?.review60 === false || question4?.review90 === false) && question4?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review30 === false ? '30' 
                                            : question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review60 === false ? '60'
                                            : '90'
                                            , question4?.id ?? '')}>
                                        { question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review30 === false ? '30' 
                                            : question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review60 === false ? '60'
                                            : question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question4?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question4?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question4?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('am consequences 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'am consequences 1')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. Identify three things anger causes in relationships.</div>
                            {
                                question5?.id &&
                                <div className="relative">
                                    {
                                        question5?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question5?.id ?? '')} /></span>
                                    }
                                    {
                                        !question5?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('am consequences 2', question5?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question5?.review30 === false || question5?.review60 === false || question5?.review90 === false) && question5?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review30 === false ? '30' 
                                            : question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review60 === false ? '60'
                                            : '90'
                                            , question5?.id ?? '')}>
                                        { question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review30 === false ? '30' 
                                            : question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review60 === false ? '60'
                                            : question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question5?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question5?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question5?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('am consequences 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'am consequences 2')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. Identify a time when your anger caused a big problem.</div>
                            {
                                question6?.id &&
                                <div className="relative">
                                    {
                                        question6?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question6?.id ?? '')} /></span>
                                    }
                                    {
                                        !question6?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('am consequences 3', question6?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question6?.review30 === false || question6?.review60 === false || question6?.review90 === false) && question6?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review30 === false ? '30' 
                                            : question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review60 === false ? '60'
                                            : '90'
                                            , question6?.id ?? '')}>
                                        { question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review30 === false ? '30' 
                                            : question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review60 === false ? '60'
                                            : question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question6?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question6?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question6?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('am consequences 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'am consequences 3')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>4. Identify a time when your anger did (or could have) cost you a relationship.</div>
                            {
                                question7?.id &&
                                <div className="relative">
                                    {
                                        question7?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question7?.id ?? '')} /></span>
                                    }
                                    {
                                        !question7?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('am consequences 4', question7?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question7?.review30 === false || question7?.review60 === false || question7?.review90 === false) && question7?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review30 === false ? '30' 
                                            : question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review60 === false ? '60'
                                            : '90'
                                            , question7?.id ?? '')}>
                                        { question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review30 === false ? '30' 
                                            : question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review60 === false ? '60'
                                            : question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question7?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question7?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question7?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('am consequences 4')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'am consequences 4')?.answer} disabled />
                        <br />
                        <div className="inline-flex justify-between">
                            <div className="font-semibold text-2xl w-full">Aggressive Communication</div>
                        </div>
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>1. Explain three differences between assertive and aggressive communication.</div>
                            {
                                question8?.id &&
                                <div className="relative">
                                    {
                                        question8?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question8?.id ?? '')} /></span>
                                    }
                                    {
                                        !question8?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('aggressive 1', question8?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question8?.review30 === false || question8?.review60 === false || question8?.review90 === false) && question8?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review30 === false ? '30' 
                                            : question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review60 === false ? '60'
                                            : '90'
                                            , question8?.id ?? '')}>
                                        { question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review30 === false ? '30' 
                                            : question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review60 === false ? '60'
                                            : question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question8?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question8?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question8?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('aggressive 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'aggressive 1')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. Identify three ways nonverbal messages can show aggression.</div>
                            {
                                question9?.id &&
                                <div className="relative">
                                    {
                                        question9?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question9?.id ?? '')} /></span>
                                    }
                                    {
                                        !question9?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('aggressive 2', question9?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question9?.review30 === false || question9?.review60 === false || question9?.review90 === false) && question9?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review30 === false ? '30' 
                                            : question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review60 === false ? '60'
                                            : '90'
                                            , question9?.id ?? '')}>
                                        { question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review30 === false ? '30' 
                                            : question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review60 === false ? '60'
                                            : question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question9?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question9?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question9?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('aggressive 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'aggressive 2')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. Identify three nonverbal messages you tend to use (or have used) in your communication style.</div>
                            {
                                question10?.id &&
                                <div className="relative">
                                    {
                                        question10?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question10?.id ?? '')} /></span>
                                    }
                                    {
                                        !question10?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('aggressive 3', question10?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question10?.review30 === false || question10?.review60 === false || question10?.review90 === false) && question10?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review30 === false ? '30' 
                                            : question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review60 === false ? '60'
                                            : '90'
                                            , question10?.id ?? '')}>
                                        { question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review30 === false ? '30' 
                                            : question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review60 === false ? '60'
                                            : question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question10?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question10?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question10?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('aggressive 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'aggressive 3')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>4. Identify three ways to avoid using aggressive communication.</div>
                            {
                                question11?.id &&
                                <div className="relative">
                                    {
                                        question11?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question11?.id ?? '')} /></span>
                                    }
                                    {
                                        !question11?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('aggressive 4', question11?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question11?.review30 === false || question11?.review60 === false || question11?.review90 === false) && question11?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review30 === false ? '30' 
                                            : question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review60 === false ? '60'
                                            : '90'
                                            , question11?.id ?? '')}>
                                        { question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review30 === false ? '30' 
                                            : question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review60 === false ? '60'
                                            : question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question11?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question11?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question11?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('aggressive 4')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'aggressive 4')?.answer} disabled />
                        <br />
                        <div className="inline-flex justify-between">
                            <div className="font-semibold text-2xl w-full">Trigger Thoughts</div>
                        </div>
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>1. Explain the connection between events, thoughts, emotions and actions.</div>
                            {
                                question12?.id &&
                                <div className="relative">
                                    {
                                        question12?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question12?.id ?? '')} /></span>
                                    }
                                    {
                                        !question12?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('trigger 1', question12?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question12?.review30 === false || question12?.review60 === false || question12?.review90 === false) && question12?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review30 === false ? '30' 
                                            : question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review60 === false ? '60'
                                            : '90'
                                            , question12?.id ?? '')}>
                                        { question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review30 === false ? '30' 
                                            : question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review60 === false ? '60'
                                            : question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question12?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question12?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question12?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('trigger 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'trigger 1')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. Identify three hot thoughts that increase your anger.</div>
                            {
                                question13?.id &&
                                <div className="relative">
                                    {
                                        question13?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question13?.id ?? '')} /></span>
                                    }
                                    {
                                        !question13?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('trigger 2', question13?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question13?.review30 === false || question13?.review60 === false || question13?.review90 === false) && question13?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review30 === false ? '30' 
                                            : question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review60 === false ? '60'
                                            : '90'
                                            , question13?.id ?? '')}>
                                        { question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review30 === false ? '30' 
                                            : question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review60 === false ? '60'
                                            : question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question13?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question13?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question13?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('trigger 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'trigger 2')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. Identify three calming thoughts that decrease your anger.</div>
                            {
                                question14?.id &&
                                <div className="relative">
                                    {
                                        question14?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question14?.id ?? '')} /></span>
                                    }
                                    {
                                        !question14?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('trigger 3', question14?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question14?.review30 === false || question14?.review60 === false || question14?.review90 === false) && question14?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review30 === false ? '30' 
                                            : question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review60 === false ? '60'
                                            : '90'
                                            , question14?.id ?? '')}>
                                        { question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review30 === false ? '30' 
                                            : question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review60 === false ? '60'
                                            : question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question14?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question14?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question14?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('trigger 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'trigger 3')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>4. Describe a time when you replaced hot thoughts with calming thoughts.</div>
                            {
                                question15?.id &&
                                <div className="relative">
                                    {
                                        question15?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question15?.id ?? '')} /></span>
                                    }
                                    {
                                        !question15?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('trigger 4', question15?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question15?.review30 === false || question15?.review60 === false || question15?.review90 === false) && question15?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review30 === false ? '30' 
                                            : question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review60 === false ? '60'
                                            : '90'
                                            , question15?.id ?? '')}>
                                        { question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review30 === false ? '30' 
                                            : question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review60 === false ? '60'
                                            : question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question15?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question15?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question15?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('trigger 4')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'trigger 4')?.answer} disabled />
                        <br />
                        <div className="inline-flex justify-between">
                            <div className="font-semibold text-2xl w-full">Calming Anger</div>
                        </div>
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>1. Identify three cooling down techniques.</div>
                            {
                                question16?.id &&
                                <div className="relative">
                                    {
                                        question16?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question16?.id ?? '')} /></span>
                                    }
                                    {
                                        !question16?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('calming 1', question16?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question16?.review30 === false || question16?.review60 === false || question16?.review90 === false) && question16?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question16?.goalAchievmentStatusId === inProgressStatusId && question16?.review30 === false ? '30' 
                                            : question16?.goalAchievmentStatusId === inProgressStatusId && question16?.review60 === false ? '60'
                                            : '90'
                                            , question16?.id ?? '')}>
                                        { question16?.goalAchievmentStatusId === inProgressStatusId && question16?.review30 === false ? '30' 
                                            : question16?.goalAchievmentStatusId === inProgressStatusId && question16?.review60 === false ? '60'
                                            : question16?.goalAchievmentStatusId === inProgressStatusId && question16?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question16?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question16?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question16?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('calming 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'calming 1')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. Describe the steps in calling a time out for yourself.</div>
                            {
                                question17?.id &&
                                <div className="relative">
                                    {
                                        question17?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question17?.id ?? '')} /></span>
                                    }
                                    {
                                        !question17?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('calming 2', question17?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question17?.review30 === false || question17?.review60 === false || question17?.review90 === false) && question17?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question17?.goalAchievmentStatusId === inProgressStatusId && question17?.review30 === false ? '30' 
                                            : question17?.goalAchievmentStatusId === inProgressStatusId && question17?.review60 === false ? '60'
                                            : '90'
                                            , question17?.id ?? '')}>
                                        { question17?.goalAchievmentStatusId === inProgressStatusId && question17?.review30 === false ? '30' 
                                            : question17?.goalAchievmentStatusId === inProgressStatusId && question17?.review60 === false ? '60'
                                            : question17?.goalAchievmentStatusId === inProgressStatusId && question17?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question17?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question17?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question17?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('calming 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'calming 2')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. What questions can you ask yourself to stay calm?</div>
                            {
                                question18?.id &&
                                <div className="relative">
                                    {
                                        question18?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question18?.id ?? '')} /></span>
                                    }
                                    {
                                        !question18?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('calming 3', question18?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question18?.review30 === false || question18?.review60 === false || question18?.review90 === false) && question18?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question18?.goalAchievmentStatusId === inProgressStatusId && question18?.review30 === false ? '30' 
                                            : question18?.goalAchievmentStatusId === inProgressStatusId && question18?.review60 === false ? '60'
                                            : '90'
                                            , question18?.id ?? '')}>
                                        { question18?.goalAchievmentStatusId === inProgressStatusId && question18?.review30 === false ? '30' 
                                            : question18?.goalAchievmentStatusId === inProgressStatusId && question18?.review60 === false ? '60'
                                            : question18?.goalAchievmentStatusId === inProgressStatusId && question18?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question18?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question18?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question18?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('calming 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'calming 3')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>4. Describe a time when you successfully calmed yourself down from anger.</div>
                            {
                                question19?.id &&
                                <div className="relative">
                                    {
                                        question19?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question19?.id ?? '')} /></span>
                                    }
                                    {
                                        !question19?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('calming 4', question19?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question19?.review30 === false || question19?.review60 === false || question19?.review90 === false) && question19?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question19?.goalAchievmentStatusId === inProgressStatusId && question19?.review30 === false ? '30' 
                                            : question19?.goalAchievmentStatusId === inProgressStatusId && question19?.review60 === false ? '60'
                                            : '90'
                                            , question19?.id ?? '')}>
                                        { question19?.goalAchievmentStatusId === inProgressStatusId && question19?.review30 === false ? '30' 
                                            : question19?.goalAchievmentStatusId === inProgressStatusId && question19?.review60 === false ? '60'
                                            : question19?.goalAchievmentStatusId === inProgressStatusId && question19?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question19?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question19?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question19?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('calming 4')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'calming 4')?.answer} disabled />
                        <br />
                    </div>
                </>
            }
              {
                goal === 'Cognitive Restructuring' &&
                <>
                    <div className="flex flex-col justify-start w-full p-5">
                        <div className="inline-flex justify-between">
                            <div className="font-semibold text-2xl w-full">Awareness of thinking patterns</div>
                        </div>
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>1. Explain how automatic thoughts are formed.</div>
                            {
                                question1?.id &&
                                <div className="relative">
                                    {
                                        question1?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question1?.id ?? '')} /></span>
                                    }
                                    {
                                        !question1?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('awareness 1', question1?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question1?.review30 === false || question1?.review60 === false || question1?.review90 === false) && question1?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review30 === false ? '30' 
                                            : question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review60 === false ? '60'
                                            : '90'
                                            , question1?.id ?? '')}>
                                        { question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review30 === false ? '30' 
                                            : question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review60 === false ? '60'
                                            : question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question1?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question1?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question1?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('awareness 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'awareness 1')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. List three categories of thinking errors.</div>
                            {
                                question2?.id &&
                                <div className="relative">
                                    {
                                        question2?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question2?.id ?? '')} /></span>
                                    }
                                    {
                                        !question2?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('awareness 2', question2?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question2?.review30 === false || question2?.review60 === false || question2?.review90 === false) && question2?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review30 === false ? '30' 
                                            : question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review60 === false ? '60'
                                            : '90'
                                            , question2?.id ?? '')}>
                                        { question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review30 === false ? '30' 
                                            : question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review60 === false ? '60'
                                            : question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question2?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question2?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question2?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('awareness 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'awareness 2')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. Identify three maladaptive thinking patterns you have that you were previously unaware of.</div>
                            {
                                question3?.id &&
                                <div className="relative">
                                    {
                                        question3?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question3?.id ?? '')} /></span>
                                    }
                                    {
                                        !question3?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('awareness 3', question3?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question3?.review30 === false || question3?.review60 === false || question3?.review90 === false) && question3?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review30 === false ? '30' 
                                            : question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review60 === false ? '60'
                                            : '90'
                                            , question3?.id ?? '')}>
                                        { question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review30 === false ? '30' 
                                            : question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review60 === false ? '60'
                                            : question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question3?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question3?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question3?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('awareness 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'awareness 3')?.answer} disabled />
                        <br />
                        <div className="inline-flex justify-between">
                            <div className="font-semibold text-2xl w-full">Inaccurate Thoughts</div>
                        </div>
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>1. Identify a time you exaggerated and rewrite a more accurate statement.</div>
                            {
                                question4?.id &&
                                <div className="relative">
                                    {
                                        question4?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question4?.id ?? '')} /></span>
                                    }
                                    {
                                        !question4?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('inaccurate 1', question4?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question4?.review30 === false || question4?.review60 === false || question4?.review90 === false) && question4?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review30 === false ? '30' 
                                            : question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review60 === false ? '60'
                                            : '90'
                                            , question4?.id ?? '')}>
                                        { question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review30 === false ? '30' 
                                            : question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review60 === false ? '60'
                                            : question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question4?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question4?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question4?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('inaccurate 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'inaccurate 1')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. Identify a time you had an unreasonable expectation of yourself, or someone else, and rewrite a more rational one.</div>
                            {
                                question5?.id &&
                                <div className="relative">
                                    {
                                        question5?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question5?.id ?? '')} /></span>
                                    }
                                    {
                                        !question5?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('inaccurate 2', question5?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question5?.review30 === false || question5?.review60 === false || question5?.review90 === false) && question5?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review30 === false ? '30' 
                                            : question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review60 === false ? '60'
                                            : '90'
                                            , question5?.id ?? '')}>
                                        { question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review30 === false ? '30' 
                                            : question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review60 === false ? '60'
                                            : question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question5?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question5?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question5?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('inaccurate 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'inaccurate 2')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. Identify a time when you made an assumption that caused problems.</div>
                            {
                                question6?.id &&
                                <div className="relative">
                                    {
                                        question6?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question6?.id ?? '')} /></span>
                                    }
                                    {
                                        !question6?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('inaccurate 3', question6?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question6?.review30 === false || question6?.review60 === false || question6?.review90 === false) && question6?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review30 === false ? '30' 
                                            : question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review60 === false ? '60'
                                            : '90'
                                            , question6?.id ?? '')}>
                                        { question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review30 === false ? '30' 
                                            : question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review60 === false ? '60'
                                            : question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question6?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question6?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question6?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('inaccurate 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'inaccurate 3')?.answer} disabled />
                        <br />
                        <div className="inline-flex justify-between">
                            <div className="font-semibold text-2xl w-full">Common Dysfuncitonal Beliefs</div>
                        </div>
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>1. &quot;Life should be fair.&quot; Explain why this belief is a problem.</div>
                            {
                                question7?.id &&
                                <div className="relative">
                                    {
                                        question7?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question7?.id ?? '')} /></span>
                                    }
                                    {
                                        !question7?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('dysfunctional 1', question7?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question7?.review30 === false || question7?.review60 === false || question7?.review90 === false) && question7?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review30 === false ? '30' 
                                            : question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review60 === false ? '60'
                                            : '90'
                                            , question7?.id ?? '')}>
                                        { question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review30 === false ? '30' 
                                            : question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review60 === false ? '60'
                                            : question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question7?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question7?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question7?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('dysfunctional 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'dysfunctional 1')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. &quot;I should be respected.&quot; Explain why this belief is a problem.</div>
                            {
                                question8?.id &&
                                <div className="relative">
                                    {
                                        question8?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question8?.id ?? '')} /></span>
                                    }
                                    {
                                        !question8?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('dysfunctional 2', question8?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question8?.review30 === false || question8?.review60 === false || question8?.review90 === false) && question8?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review30 === false ? '30' 
                                            : question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review60 === false ? '60'
                                            : '90'
                                            , question8?.id ?? '')}>
                                        { question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review30 === false ? '30' 
                                            : question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review60 === false ? '60'
                                            : question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question8?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question8?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question8?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('dysfunctional 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'dysfunctional 2')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. &quot;I should have the things I want.&quot; Explain why this belief is a problem.</div>
                            {
                                question9?.id &&
                                <div className="relative">
                                    {
                                        question9?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question9?.id ?? '')} /></span>
                                    }
                                    {
                                        !question9?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('dysfunctional 3', question9?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question9?.review30 === false || question9?.review60 === false || question9?.review90 === false) && question9?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review30 === false ? '30' 
                                            : question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review60 === false ? '60'
                                            : '90'
                                            , question9?.id ?? '')}>
                                        { question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review30 === false ? '30' 
                                            : question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review60 === false ? '60'
                                            : question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question9?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question9?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question9?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('dysfunctional 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'dysfunctional 3')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>4. &quot;Mistakes are unacceptable.&quot; Explain why this belief is a problem.</div>
                            {
                                question10?.id &&
                                <div className="relative">
                                    {
                                        question10?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question10?.id ?? '')} /></span>
                                    }
                                    {
                                        !question10?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('dysfunctional 4', question10?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question10?.review30 === false || question10?.review60 === false || question10?.review90 === false) && question10?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review30 === false ? '30' 
                                            : question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review60 === false ? '60'
                                            : '90'
                                            , question10?.id ?? '')}>
                                        { question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review30 === false ? '30' 
                                            : question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review60 === false ? '60'
                                            : question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question10?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question10?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question10?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('dysfunctional 4')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'dysfunctional 4')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>5. &quot;Everyone treats me bad.&quot; Explain why this belief is a problem.</div>
                            {
                                question11?.id &&
                                <div className="relative">
                                    {
                                        question11?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question11?.id ?? '')} /></span>
                                    }
                                    {
                                        !question11?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('dysfunctional 5', question11?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question11?.review30 === false || question11?.review60 === false || question11?.review90 === false) && question11?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review30 === false ? '30' 
                                            : question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review60 === false ? '60'
                                            : '90'
                                            , question11?.id ?? '')}>
                                        { question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review30 === false ? '30' 
                                            : question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review60 === false ? '60'
                                            : question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question11?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question11?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question11?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('dysfunctional 5')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'dysfunctional 5')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>6. &quot;The cops tried to get me for _____.&quot; Explain why this belief is a problem.</div>
                            {
                                question12?.id &&
                                <div className="relative">
                                    {
                                        question12?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question12?.id ?? '')} /></span>
                                    }
                                    {
                                        !question12?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('dysfunctional 6', question12?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question12?.review30 === false || question12?.review60 === false || question12?.review90 === false) && question12?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review30 === false ? '30' 
                                            : question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review60 === false ? '60'
                                            : '90'
                                            , question12?.id ?? '')}>
                                        { question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review30 === false ? '30' 
                                            : question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review60 === false ? '60'
                                            : question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question12?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question12?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question12?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('dysfunctional 6')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'dysfunctional 6')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>7. &quot;The system is against me.&quot; Explain why this belief is a problem.</div>
                            {
                                question13?.id &&
                                <div className="relative">
                                    {
                                        question13?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question13?.id ?? '')} /></span>
                                    }
                                    {
                                        !question13?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('dysfunctional 7', question13?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question13?.review30 === false || question13?.review60 === false || question13?.review90 === false) && question13?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review30 === false ? '30' 
                                            : question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review60 === false ? '60'
                                            : '90'
                                            , question13?.id ?? '')}>
                                        { question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review30 === false ? '30' 
                                            : question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review60 === false ? '60'
                                            : question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question13?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question13?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question13?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('dysfunctional 7')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'dysfunctional 7')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>8. &quot;It&apos;s all about the money.&quot; Explain why this belief is a problem.</div>
                            {
                                question14?.id &&
                                <div className="relative">
                                    {
                                        question14?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question14?.id ?? '')} /></span>
                                    }
                                    {
                                        !question14?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('dysfunctional 8', question14?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question14?.review30 === false || question14?.review60 === false || question14?.review90 === false) && question14?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review30 === false ? '30' 
                                            : question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review60 === false ? '60'
                                            : '90'
                                            , question14?.id ?? '')}>
                                        { question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review30 === false ? '30' 
                                            : question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review60 === false ? '60'
                                            : question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question14?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question14?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question14?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('dysfunctional 8')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'dysfunctional 8')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>9. &quot;I can&apos;t do anything about it.&quot; Explain why this belief is a problem.</div>
                            {
                                question15?.id &&
                                <div className="relative">
                                    {
                                        question15?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question15?.id ?? '')} /></span>
                                    }
                                    {
                                        !question15?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('dysfunctional 9', question15?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question15?.review30 === false || question15?.review60 === false || question15?.review90 === false) && question15?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review30 === false ? '30' 
                                            : question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review60 === false ? '60'
                                            : '90'
                                            , question15?.id ?? '')}>
                                        { question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review30 === false ? '30' 
                                            : question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review60 === false ? '60'
                                            : question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question15?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question15?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question15?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('dysfunctional 9')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'dysfunctional 9')?.answer} disabled />
                        <br />
                    </div>
                </>
            }
            {
                goal === 'Miscellaneous' &&
                <>
                    <div className="flex flex-col justify-start w-full p-5">
                        <div className="inline-flex justify-between">
                            <div className="font-semibold text-2xl w-full">Boundaries</div>
                        </div>
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>1. Explain the difference between a request and a demand.</div>
                            {
                                question1?.id &&
                                <div className="relative">
                                    {
                                        question1?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question1?.id ?? '')} /></span>
                                    }
                                    {
                                        !question1?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('boundaries 1', question1?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question1?.review30 === false || question1?.review60 === false || question1?.review90 === false) && question1?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review30 === false ? '30' 
                                            : question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review60 === false ? '60'
                                            : '90'
                                            , question1?.id ?? '')}>
                                        { question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review30 === false ? '30' 
                                            : question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review60 === false ? '60'
                                            : question1?.goalAchievmentStatusId === inProgressStatusId && question1?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question1?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question1?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question1?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('boundaries 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'boundaries 1')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. Identify three behaviors in others that are dealbreakers for you and state the consequences of that behavior.</div>
                            {
                                question2?.id &&
                                <div className="relative">
                                    {
                                        question2?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question2?.id ?? '')} /></span>
                                    }
                                    {
                                        !question2?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('boundaries 2', question2?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question2?.review30 === false || question2?.review60 === false || question2?.review90 === false) && question2?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review30 === false ? '30' 
                                            : question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review60 === false ? '60'
                                            : '90'
                                            , question2?.id ?? '')}>
                                        { question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review30 === false ? '30' 
                                            : question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review60 === false ? '60'
                                            : question2?.goalAchievmentStatusId === inProgressStatusId && question2?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question2?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question2?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question2?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('boundaries 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'boundaries 2')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. Identify three behaviors you would like someone to change but are not dealbreakers, and how you would handle someone disregarding them.</div>
                            {
                                question3?.id &&
                                <div className="relative">
                                    {
                                        question3?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question3?.id ?? '')} /></span>
                                    }
                                    {
                                        !question3?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('boundaries 3', question3?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question3?.review30 === false || question3?.review60 === false || question3?.review90 === false) && question3?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review30 === false ? '30' 
                                            : question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review60 === false ? '60'
                                            : '90'
                                            , question3?.id ?? '')}>
                                        { question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review30 === false ? '30' 
                                            : question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review60 === false ? '60'
                                            : question3?.goalAchievmentStatusId === inProgressStatusId && question3?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question3?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question3?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question3?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('boundaries 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'boundaries 3')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>4. Identify a boundary you need to set with someone and talk to them about it.</div>
                            {
                                question4?.id &&
                                <div className="relative">
                                    {
                                        question4?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question4?.id ?? '')} /></span>
                                    }
                                    {
                                        !question4?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('boundaries 4', question4?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question4?.review30 === false || question4?.review60 === false || question4?.review90 === false) && question4?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review30 === false ? '30' 
                                            : question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review60 === false ? '60'
                                            : '90'
                                            , question4?.id ?? '')}>
                                        { question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review30 === false ? '30' 
                                            : question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review60 === false ? '60'
                                            : question4?.goalAchievmentStatusId === inProgressStatusId && question4?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question4?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question4?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question4?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('boundaries 4')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'boundaries 4')?.answer} disabled />
                        <br />
                        <div className="inline-flex justify-between">
                            <div className="font-semibold text-2xl w-full">Saying no</div>
                        </div>
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>1. Identify three reasons why &quot;no&quot; might be ignored.</div>
                            {
                                question5?.id &&
                                <div className="relative">
                                    {
                                        question5?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question5?.id ?? '')} /></span>
                                    }
                                    {
                                        !question5?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('no 1', question5?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question5?.review30 === false || question5?.review60 === false || question5?.review90 === false) && question5?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review30 === false ? '30' 
                                            : question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review60 === false ? '60'
                                            : '90'
                                            , question5?.id ?? '')}>
                                        { question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review30 === false ? '30' 
                                            : question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review60 === false ? '60'
                                            : question5?.goalAchievmentStatusId === inProgressStatusId && question5?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question5?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question5?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question5?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('no 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'no 1')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. Explain why it&apos;s ok for you to say no when it&apos;s appropriate to do so.</div>
                            {
                                question6?.id &&
                                <div className="relative">
                                    {
                                        question6?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question6?.id ?? '')} /></span>
                                    }
                                    {
                                        !question6?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('no 2', question6?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question6?.review30 === false || question6?.review60 === false || question6?.review90 === false) && question6?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review30 === false ? '30' 
                                            : question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review60 === false ? '60'
                                            : '90'
                                            , question6?.id ?? '')}>
                                        { question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review30 === false ? '30' 
                                            : question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review60 === false ? '60'
                                            : question6?.goalAchievmentStatusId === inProgressStatusId && question6?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question6?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question6?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question6?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('no 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'no 2')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. Descibe a time when you appropriately turned down a request.</div>
                            {
                                question7?.id &&
                                <div className="relative">
                                    {
                                        question7?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question7?.id ?? '')} /></span>
                                    }
                                    {
                                        !question7?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('no 3', question7?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question7?.review30 === false || question7?.review60 === false || question7?.review90 === false) && question7?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review30 === false ? '30' 
                                            : question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review60 === false ? '60'
                                            : '90'
                                            , question7?.id ?? '')}>
                                        { question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review30 === false ? '30' 
                                            : question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review60 === false ? '60'
                                            : question7?.goalAchievmentStatusId === inProgressStatusId && question7?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question7?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question7?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question7?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('no 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'no 3')?.answer} disabled />
                        <br />
                        <div className="inline-flex justify-between">
                            <div className="font-semibold text-2xl w-full">Listening</div>
                        </div>
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>1. Explain the difference between hearing and listening.</div>
                            {
                                question8?.id &&
                                <div className="relative">
                                    {
                                        question8?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question8?.id ?? '')} /></span>
                                    }
                                    {
                                        !question8?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('listening 1', question8?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question8?.review30 === false || question8?.review60 === false || question8?.review90 === false) && question8?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review30 === false ? '30' 
                                            : question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review60 === false ? '60'
                                            : '90'
                                            , question8?.id ?? '')}>
                                        { question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review30 === false ? '30' 
                                            : question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review60 === false ? '60'
                                            : question8?.goalAchievmentStatusId === inProgressStatusId && question8?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question8?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question8?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question8?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('listening 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'listening 1')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. List three reasons it&apos;s to your advantage to listen to the other person.</div>
                            {
                                question9?.id &&
                                <div className="relative">
                                    {
                                        question9?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question9?.id ?? '')} /></span>
                                    }
                                    {
                                        !question9?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('listening 2', question9?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question9?.review30 === false || question9?.review60 === false || question9?.review90 === false) && question9?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review30 === false ? '30' 
                                            : question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review60 === false ? '60'
                                            : '90'
                                            , question9?.id ?? '')}>
                                        { question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review30 === false ? '30' 
                                            : question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review60 === false ? '60'
                                            : question9?.goalAchievmentStatusId === inProgressStatusId && question9?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question9?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question9?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question9?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('listening 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'listening 2')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. List three things that got in the way of listening.</div>
                            {
                                question10?.id &&
                                <div className="relative">
                                    {
                                        question10?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question10?.id ?? '')} /></span>
                                    }
                                    {
                                        !question10?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('listening 3', question10?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question10?.review30 === false || question10?.review60 === false || question10?.review90 === false) && question10?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review30 === false ? '30' 
                                            : question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review60 === false ? '60'
                                            : '90'
                                            , question10?.id ?? '')}>
                                        { question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review30 === false ? '30' 
                                            : question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review60 === false ? '60'
                                            : question10?.goalAchievmentStatusId === inProgressStatusId && question10?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question10?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question10?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question10?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('listening 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'listening 3')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>4. Choose one person to listen to with the intention of understanding what they are trying to tell you and describe what that experience was like.</div>
                            {
                                question11?.id &&
                                <div className="relative">
                                    {
                                        question11?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question11?.id ?? '')} /></span>
                                    }
                                    {
                                        !question11?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('listening 4', question11?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question11?.review30 === false || question11?.review60 === false || question11?.review90 === false) && question11?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review30 === false ? '30' 
                                            : question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review60 === false ? '60'
                                            : '90'
                                            , question11?.id ?? '')}>
                                        { question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review30 === false ? '30' 
                                            : question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review60 === false ? '60'
                                            : question11?.goalAchievmentStatusId === inProgressStatusId && question11?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question11?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question11?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question11?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('listening 4')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'listening 4')?.answer} disabled />
                        <br />
                        <div className="inline-flex justify-between">
                            <div className="font-semibold text-2xl w-full">Commitment</div>
                        </div>
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>1. Identify one of your problem behaviors.</div>
                            {
                                question12?.id &&
                                <div className="relative">
                                    {
                                        question12?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question12?.id ?? '')} /></span>
                                    }
                                    {
                                        !question12?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('commitment 1', question12?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question12?.review30 === false || question12?.review60 === false || question12?.review90 === false) && question12?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review30 === false ? '30' 
                                            : question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review60 === false ? '60'
                                            : '90'
                                            , question12?.id ?? '')}>
                                        { question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review30 === false ? '30' 
                                            : question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review60 === false ? '60'
                                            : question12?.goalAchievmentStatusId === inProgressStatusId && question12?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question12?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question12?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question12?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('commitment 1')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'commitment 1')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>2. Decide how and when you want to make a change.</div>
                            {
                                question13?.id &&
                                <div className="relative">
                                    {
                                        question13?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question13?.id ?? '')} /></span>
                                    }
                                    {
                                        !question13?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('commitment 2', question13?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question13?.review30 === false || question13?.review60 === false || question13?.review90 === false) && question13?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review30 === false ? '30' 
                                            : question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review60 === false ? '60'
                                            : '90'
                                            , question13?.id ?? '')}>
                                        { question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review30 === false ? '30' 
                                            : question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review60 === false ? '60'
                                            : question13?.goalAchievmentStatusId === inProgressStatusId && question13?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question13?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question13?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question13?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('commitment 2')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'commitment 2')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>3. Write out your statement of commitment. &#40;&quot;I will...,&quot; not I&apos;ll try to...&quot;&#41;</div>
                            {
                                question14?.id &&
                                <div className="relative">
                                    {
                                        question14?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question14?.id ?? '')} /></span>
                                    }
                                    {
                                        !question14?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('commitment 3', question14?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question14?.review30 === false || question14?.review60 === false || question14?.review90 === false) && question14?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review30 === false ? '30' 
                                            : question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review60 === false ? '60'
                                            : '90'
                                            , question14?.id ?? '')}>
                                        { question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review30 === false ? '30' 
                                            : question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review60 === false ? '60'
                                            : question14?.goalAchievmentStatusId === inProgressStatusId && question14?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question14?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question14?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question14?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('commitment 3')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'commitment 3')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>4. Implement your strategy and describe how it worked.</div>
                            {
                                question15?.id &&
                                <div className="relative">
                                    {
                                        question15?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question15?.id ?? '')} /></span>
                                    }
                                    {
                                        !question15?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('commitment 4', question15?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question15?.review30 === false || question15?.review60 === false || question15?.review90 === false) && question15?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review30 === false ? '30' 
                                            : question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review60 === false ? '60'
                                            : '90'
                                            , question15?.id ?? '')}>
                                        { question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review30 === false ? '30' 
                                            : question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review60 === false ? '60'
                                            : question15?.goalAchievmentStatusId === inProgressStatusId && question15?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question15?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question15?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question15?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('commitment 4')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'commitment 4')?.answer} disabled />
                        <br />
                        <div className="text-xl w-full inline-flex justify-between">
                            <div>5. Determine if you need to modify your strategy.</div>
                            {
                                question16?.id &&
                                <div className="relative">
                                    {
                                        question16?.isCurrent &&
                                        <span className="cursor-pointer absolute right-48"><RiStarFill size='2.5rem' className="text-amber-400" onClick={() => handleRemoveRequire(question16?.id ?? '')} /></span>
                                    }
                                    {
                                        !question16?.isCurrent &&
                                        <button 
                                            className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                            onClick={() => handleRequire('commitment 5', question16?.id)}>
                                            Require
                                        </button>
                                    }
                                    {
                                        (question16?.review30 === false || question16?.review60 === false || question16?.review90 === false) && question16?.goalAchievmentStatusId === inProgressStatusId &&
                                        <button className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                        onClick={() => handleReviewUpdate(question16?.goalAchievmentStatusId === inProgressStatusId && question16?.review30 === false ? '30' 
                                            : question16?.goalAchievmentStatusId === inProgressStatusId && question16?.review60 === false ? '60'
                                            : '90'
                                            , question16?.id ?? '')}>
                                        { question16?.goalAchievmentStatusId === inProgressStatusId && question16?.review30 === false ? '30' 
                                            : question16?.goalAchievmentStatusId === inProgressStatusId && question16?.review60 === false ? '60'
                                            : question16?.goalAchievmentStatusId === inProgressStatusId && question16?.review90 === false ? '90'
                                        : ''}
                                        </button>
                                    }
                                    <span>
                                        <select
                                            className="border border-indigo-700 shadow-md shadow-purple-950 p-1 rounded-md"
                                            defaultValue={question16?.goalAchievmentStatusId ?? inProgressStatusId}
                                            onChange={(e) => handleStatusUpdate(e.target.value, question16?.id ?? '')}
                                        >
                                            {
                                                goalAchievementStatuses.map((s) => {
                                                    return <option key={s.id} value={s.id}>{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </span>
                                </div>
                            }
                            {
                                !question16?.id && 
                                <button 
                                    className="p-1 bg-purple-800 border border-indigo-700 shadow-md shadow-purple-950 text-slate-200 rounded-md mr-3 cursor-pointer"
                                    onClick={() => handleRequire('commitment 5')}>
                                    Require
                                </button>
                            }
                        </div>
                        <br />
                        <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" defaultValue={clientGoalAnswers.find((a) => a.question === 'commitment 5')?.answer} disabled />
                        <br />
                    </div>
                </>
            }
            {
                showReviewError &&
                <div className="border border-yellow-700 rounded-lg mt-4 p-3 text-yellow-700 text-2xl fixed z-20 bottom-10 bg-yellow-200 w-3/4">Failed to set the review flag.  Please try again or contact IT.</div>
            }
            {
                showReviewSuccess &&
                <div className="border border-green-800 round p-3 text-green-800 text-4xl fixed z-20 bottom-10 animate-pulse bg-green-200 w-3/4">Review flag has been successfully set.</div>
            }
            {
                showStatusError &&
                <div className="border border-yellow-700 rounded-lg mt-4 p-3 text-yellow-700 text-2xl fixed z-20 bottom-10 bg-yellow-200 w-3/4">Failed to set the status.  Please try again or contact IT.</div>
            }
            {
                showStatusSuccess &&
                <div className="border border-green-800 round p-3 text-green-800 text-4xl fixed z-20 bottom-10 animate-pulse bg-green-200 w-3/4">Status has been successfully updated.</div>
            }
            {
                showInvalidStatusUpdate &&
                <div className="border border-yellow-700 rounded-lg mt-4 p-3 text-yellow-700 text-2xl fixed z-20 bottom-10 bg-yellow-200 w-3/4">Can only update goal achievment status on a question with an answer.</div>
            }
            {
                showInvalidReview &&
                <div className="border border-yellow-700 rounded-lg mt-4 p-3 text-yellow-700 text-2xl fixed z-20 bottom-10 bg-yellow-200 w-3/4">Can only update review on a question with an answer.</div>
            }
            {
                showInvalidRequire &&
                <div className="border border-yellow-700 rounded-lg mt-4 p-3 text-yellow-700 text-2xl fixed z-20 bottom-10 bg-yellow-200 w-3/4">Failed to require the goal.  Please try again or contact IT.</div>
            }
            {
                showMaximumRequiredGoals &&
                <div className="border border-yellow-700 rounded-lg mt-4 p-3 text-yellow-700 text-2xl fixed z-20 bottom-10 bg-yellow-200 w-3/4">The client is already at 3 active goals.</div>
            }
            {
                showClientAccessError &&
                <div className="border border-yellow-700 rounded-lg mt-4 p-3 text-yellow-700 text-2xl fixed z-20 bottom-10 bg-yellow-200 w-3/4">Failed to set the goal as current.  Please try again or contact IT.</div>
            }
            {
                showClientAccessSuccess &&
                <div className="border border-green-800 round p-3 text-green-800 text-4xl fixed z-20 bottom-10 animate-pulse bg-green-200 w-3/4">Goal has been successfully set as a current goal.</div>
            }
            {
                showClientAcessRemoveSuccess &&
                <div className="border border-green-800 round p-3 text-green-800 text-4xl fixed z-20 bottom-10 animate-pulse bg-green-200 w-3/4">Goal has been successfully removed from being a current goal.</div>
            }
            {
                showNoGoalIdError &&
                <div className="border border-yellow-700 rounded-lg mt-4 p-3 text-yellow-700 text-2xl fixed z-20 bottom-10 bg-yellow-200 w-3/4">Unable to find the goal.  Please contact IT.</div>
            }
        </div>
    )
}

export default GoalUpdateModal;