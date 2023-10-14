import { useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { RiStarFill } from "react-icons/ri";
import HomeButton from "~/components/HomeButton";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

const DomesticViolence: NextPage = () => {
    const { user } = useUser();
    const router = useRouter();
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showNoGoalIdError, setShowNoGoalIdError] = useState(false);
    const [showAnswerError, setShowAnswerError] = useState(false);
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);
    const [dvAccountability1, setDVAccountability1] = useState('');
    const [dvAccountability2, setDVAccountability2] = useState('');
    const [dvAccountability3, setDVAccountability3] = useState('');
    const [dvAccountability4, setDVAccountability4] = useState('');
    const [regulation1, setRegulation1] = useState('');
    const [regulation2, setRegulation2] = useState('');
    const [regulation3, setRegulation3] = useState('');
    const [regulation4, setRegulation4] = useState('');
    const [healthy1, setHealthy1] = useState('');
    const [healthy2, setHealthy2] = useState('');
    const [healthy3, setHealthy3] = useState('');
    const [healthy4, setHealthy4] = useState('');
    const [conflict1, setConflict1] = useState('');
    const [conflict2, setConflict2] = useState('');
    const [conflict3, setConflict3] = useState('');
    const [conflict4, setConflict4] = useState('');
    const [belief1, setBelief1] = useState('');
    const [belief2, setBelief2] = useState('');
    const [belief3, setBelief3] = useState('');
    const [belief4, setBelief4] = useState('');
    const [belief5, setBelief5] = useState('');
    const [belief6, setBelief6] = useState('');
    const [belief7, setBelief7] = useState('');
    const [belief8, setBelief8] = useState('');
    const [belief9, setBelief9] = useState('');
    const [belief10, setBelief10] = useState('');

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        router.push('/').catch((err) => console.error(err));

    const goalsQuery = api.goal.list.useQuery();
    const requiredGoalsQuery = api.requiredGoal.list.useQuery({ externalId: userId });
    const clientGoalAnswerQuery = api.clientGoalAnswer.list.useQuery({ externalId: userId, goal: 'Domestic Violence' });
    //const requiredGoalMutation = api.requiredGoal.start.useMutation();
    const clientGoalAnswerUpsert = api.clientGoalAnswer.upsert.useMutation();

    if (requiredGoalsQuery.isLoading || goalsQuery.isLoading || clientGoalAnswerQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (requiredGoalsQuery.isError || goalsQuery.isError || clientGoalAnswerQuery.isError) {
        return <LoadError type='Page' />
    }

    const dvGoal = goalsQuery.data?.find((g) => g.url === 'dv');
    //const dvRequiredGoals = requiredGoalsQuery.data?.filter((g) => g.goal.url === 'dv');
    const clientGoalAnswers = clientGoalAnswerQuery.data;

    const handleSave = async (question: string) => {
        let answer: string;
        switch (question) {
            case 'dv accountability 1':
                answer = dvAccountability1;
                break;

            case 'dv accountability 2':
                answer = dvAccountability2;
                break;

            case 'dv accountability 3':
                answer = dvAccountability3;
                break;

            case 'dv accountability 4':
                answer = dvAccountability4;
                break;

            case 'regulation 1':
                answer = regulation1;
                break;

            case 'regulation 2':
                answer = regulation2;
                break;

            case 'regulation 3':
                answer = regulation3;
                break;

            case 'regulation 4':
                answer = regulation4;
                break;

            case 'healthy 1':
                answer = healthy1;
                break;

            case 'healthy 2':
                answer = healthy2;
                break;

            case 'healthy 3':
                answer = healthy3;
                break;

            case 'healthy 4':
                answer = healthy4;
                break;

            case 'conflict 1':
                answer = conflict1;
                break;

            case 'conflict 2':
                answer = conflict2;
                break;

            case 'conflict 3':
                answer = conflict3;
                break;

            case 'conflict 4':
                answer = conflict4;
                break;

            case 'belief 1':
                answer = belief1;
                break;

            case 'belief 2':
                answer = belief2;
                break;

            case 'belief 3':
                answer = belief3;
                break;

            case 'belief 4':
                answer = belief4;
                break;

            case 'belief 5':
                answer = belief5;
                break;

            case 'belief 6':
                answer = belief6;
                break;

            case 'belief 7':
                answer = belief7;
                break;

            case 'belief 8':
                answer = belief8;
                break;

            case 'belief 9':
                answer = belief9;
                break;

            case 'belief 10':
                answer = belief10;
                break;

            default:
                return;
        }

        const dvGoalId: string = dvGoal?.id ?? '';

        if (dvGoalId === '') {
            setShowNoGoalIdError(true);
            return;
        }

        if (answer.length < 10 || answer.length > 1500) {
            setShowAnswerError(true);
            return;
        }

        // await requiredGoalMutation.mutateAsync({
        //     externalId: userId,
        //     goalId: dvGoalId
        // })
        // .catch((err) => {
        //     console.error('error: ', err);
        //     setShowErrorAlert(true);
        // });

        await clientGoalAnswerUpsert.mutateAsync({
            externalId: userId,
            goalId: dvGoalId,
            answer,
            question
        })
        .catch((err) => {
            console.error('error: ', err);
            setShowErrorAlert(true);
        });

        if (/*!requiredGoalMutation.isError &&*/ !clientGoalAnswerUpsert.isError) {
            setShowNoGoalIdError(false);
            setShowAnswerError(false);
            setShowErrorAlert(false);
            setShowSaveSuccess(true);
            window.setTimeout(() => {
                setShowSaveSuccess(false);
            }, 5000)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-700 py-5">
            <div className="fixed top-5 left-5"><HomeButton /></div>
            <div className="flex flex-col items-center justify-center border border-indigo-700 rounded shadow-xl shadow-purple-900 bg-slate-100 w-5/6 p-5">
                <h1 className="text-2xl font-bold mb-10">Domestic Violence Treatment Goals</h1>
                {/* <div className="text-xl mb-3">You may add your answers to the goals before or during the Orientation Workshop you will be attending to start your treatment program.</div> */}
                <div className="text-xl mb-3">To save an answer properly it must be at least 10 characters and no more than 1500 characters.</div>
                {/* <div className="text-xl">Please answer and save at least one goal now so that we know you have seen the goals and you can move on to the next step.</div> */}
                <br />
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Accountability</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">1. Explain why blaming your partner is not helpful to you.
                    {
                        clientGoalAnswers.find((a) => a.question === 'dv accountability 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setDVAccountability1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'dv accountability 1')?.answer} />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('dv accountability 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. Explain why blaming the legal system is detrimental to you.
                    {
                        clientGoalAnswers.find((a) => a.question === 'dv accountability 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setDVAccountability2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'dv accountability 2')?.answer} />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('dv accountability 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. Identify three thinking errors that have kept you from taking responsibility for your legal situation.
                    {
                        clientGoalAnswers.find((a) => a.question === 'dv accountability 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setDVAccountability3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'dv accountability 3')?.answer} />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('dv accountability 3')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">4. Clearly state your part in the incident that resulted in your charges without justifying, minimizing, or blaming.  &#40;Start with the phrase, &#34;I am a good person that made a mistake.  This is what I did.&#34;&#41;
                    {
                        clientGoalAnswers.find((a) => a.question === 'dv accountability 4')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setDVAccountability4(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'dv accountability 4')?.answer} />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('dv accountability 4')}>Save</button>
                </div>
                <br />
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Emotional Regulation</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">1. Identify three things that trigger intense emotions in you.
                    {
                        clientGoalAnswers.find((a) => a.question === 'regulation 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setRegulation1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'regulation 1')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('regulation 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. Identify three deep emotions you have covered up with anger.
                    {
                        clientGoalAnswers.find((a) => a.question === 'regulation 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setRegulation2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'regulation 2')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('regulation 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. Identify three trigger thoughts that escalate your emotions and three thoughts that calm you down.
                    {
                        clientGoalAnswers.find((a) => a.question === 'regulation 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setRegulation3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'regulation 3')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('regulation 3')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">4. Identify three techniques to regulate intense emotions.
                    {
                        clientGoalAnswers.find((a) => a.question === 'regulation 4')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setRegulation4(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'regulation 4')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('regulation 4')}>Save</button>
                </div>
                <br />
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Healthy Relationships</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">1. Identify three communication skills that improve relationships.
                    {
                        clientGoalAnswers.find((a) => a.question === 'healthy 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setHealthy1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'healthy 1')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('healthy 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. Identify the things you argue about most frequently and list any related thinking errors.
                    {
                        clientGoalAnswers.find((a) => a.question === 'healthy 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setHealthy2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'healthy 2')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('healthy 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. What dysfunctional beliefs do you have (or have used) that damage your relationship.
                    {
                        clientGoalAnswers.find((a) => a.question === 'healthy 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setHealthy3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'healthy 3')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('healthy 3')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">4. List three ways to repair your relationship after an emotional injury.
                    {
                        clientGoalAnswers.find((a) => a.question === 'healthy 4')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setHealthy4(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'healthy 4')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('healthy 4')}>Save</button>
                </div>
                <br />
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Conflict Resolution</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">1. List four styles of conflict resolution and when it would be appropriate to use them.
                    {
                        clientGoalAnswers.find((a) => a.question === 'conflict 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setConflict1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'conflict 1')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('conflict 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. Explain why it is to your advantage to understand the other person&apos;s point of view.
                    {
                        clientGoalAnswers.find((a) => a.question === 'conflict 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setConflict2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'conflict 2')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('conflict 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. Describe three steps to prepare for a difficult conversation.
                    {
                        clientGoalAnswers.find((a) => a.question === 'conflict 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setConflict3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'conflict 3')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('conflict 3')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">4. Describe a time when you assertively confronted a conflict.
                    {
                        clientGoalAnswers.find((a) => a.question === 'conflict 4')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setConflict4(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'conflict 4')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('conflict 4')}>Save</button>
                </div>
                <br />
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Beliefs that Perpetuate Violence</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">&quot;I demand respect!&quot; Explain why this belief is a problem.5.
                    {
                        clientGoalAnswers.find((a) => a.question === 'belief 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setBelief1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'belief 1')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('belief 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. &quot;I cannot show weakness of any kind.&quot; Explain why this belief is a problem.
                    {
                        clientGoalAnswers.find((a) => a.question === 'belief 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setBelief2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'belief 2')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('belief 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. &quot;They deserved it because _____.&quot; Explain why this belief is a problem.
                    {
                        clientGoalAnswers.find((a) => a.question === 'belief 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setBelief3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'belief 3')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('belief 3')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">4. &quot;Men should not show emotions.&quot; Explain why this belief is a problem.
                    {
                        clientGoalAnswers.find((a) => a.question === 'belief 4')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setBelief4(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'belief 4')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('belief 4')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">&quot;Men can&apos;t win in the judicial system.&quot; Explain why this belief is a problem.
                    {
                        clientGoalAnswers.find((a) => a.question === 'belief 5')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setBelief5(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'belief 5')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('belief 5')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl- relative">6. &quot;Women (or men) always _______.&quot; Explain why this belief is a problem.
                    {
                        clientGoalAnswers.find((a) => a.question === 'belief 6')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setBelief6(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'belief 6')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('belief 6')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">7. Describe a time when you justified your aggressive behavior because you were &quot;right.&quot;
                    {
                        clientGoalAnswers.find((a) => a.question === 'belief 7')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setBelief7(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'belief 7')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('belief 7')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">8. Describe a time when you used intimidation to get something you &quot;deserve.&quot;
                    {
                        clientGoalAnswers.find((a) => a.question === 'belief 8')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setBelief8(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'belief 8')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('belief 8')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">9. Describe a time when you started a conflict by expecting someone to accept and submit to your set of rules.
                    {
                        clientGoalAnswers.find((a) => a.question === 'belief 9')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setBelief9(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'belief 9')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('belief 9')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">10. List three inaccurate beliefs you have (or had) that justify aggression or assault.
                    {
                        clientGoalAnswers.find((a) => a.question === 'belief 10')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setBelief10(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'belief 10')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('belief 10')}>Save</button>
                </div>
            </div>
            { showNoGoalIdError &&
                <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">Unable to find the goal.  Please contact our office at 8018881234 for assistance</div>
            }
            {
                showAnswerError &&
                <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">Answer to the question must be at least 10 characters and no more then 1500 characters</div>
            }
            {
                showErrorAlert &&
                <div className="border border-yellow-700 rounded-lg mt-4 p-3 text-yellow-700 text-2xl fixed z-20 bottom-10 bg-yellow-200 w-3/4">Failed to save the answer.  Please contact our office at 8018881234 for assistance</div>
            }
            {
                showSaveSuccess &&
                <div className="border border-green-800 round p-3 text-green-800 text-4xl fixed z-20 bottom-10 animate-pulse bg-green-200 w-3/4">Answer saved successfully.</div>
            }
        </div>
    )
}

export default DomesticViolence;