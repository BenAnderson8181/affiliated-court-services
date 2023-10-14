import { useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { RiStarFill } from "react-icons/ri";
import HomeButton from "~/components/HomeButton";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

const AngerManagement: NextPage = () => {
    const { user } = useUser();
    const router = useRouter();
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showNoGoalIdError, setShowNoGoalIdError] = useState(false);
    const [showAnswerError, setShowAnswerError] = useState(false);
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);
    const [elements1, setElements1] = useState('');
    const [elements2, setElements2] = useState('');
    const [elements3, setElements3] = useState('');
    const [amConsequences1, setAMConsequences1] = useState('');
    const [amConsequences2, setAMConsequences2] = useState('');
    const [amConsequences3, setAMConsequences3] = useState('');
    const [amConsequences4, setAMConsequences4] = useState('');
    const [aggressive1, setAggressive1] = useState('');
    const [aggressive2, setAggressive2] = useState('');
    const [aggressive3, setAggressive3] = useState('');
    const [aggressive4, setAggressive4] = useState('');
    const [trigger1, setTrigger1] = useState('');
    const [trigger2, setTrigger2] = useState('');
    const [trigger3, setTrigger3] = useState('');
    const [trigger4, setTrigger4] = useState('');
    const [calming1, setCalming1] = useState('');
    const [calming2, setCalming2] = useState('');
    const [calming3, setCalming3] = useState('');
    const [calming4, setCalming4] = useState('');

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        router.push('/').catch((err) => console.error(err));

    const goalsQuery = api.goal.list.useQuery();
    const requiredGoalsQuery = api.requiredGoal.list.useQuery({ externalId: userId });
    const clientGoalAnswerQuery = api.clientGoalAnswer.list.useQuery({ externalId: userId, goal: 'Anger Management' });
    const requiredGoalMutation = api.requiredGoal.start.useMutation();
    const clientGoalAnswerUpsert = api.clientGoalAnswer.upsert.useMutation();

    if (requiredGoalsQuery.isLoading || goalsQuery.isLoading || clientGoalAnswerQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (requiredGoalsQuery.isError || goalsQuery.isError || clientGoalAnswerQuery.isError) {
        return <LoadError type='Page' />
    }

    const amGoal = goalsQuery.data?.find((g) => g.url === 'am');
    const amRequiredGoals = requiredGoalsQuery.data?.filter((g) => g.goal.url === 'am');
    const clientGoalAnswers = clientGoalAnswerQuery.data;

    const handleSave = async (question: string) => {
        let answer: string;
        switch (question) {
            case 'elements 1':
                answer = elements1;
                break;

            case 'elements 2':
                answer = elements2;
                break;

            case 'elements 3':
                answer = elements3;
                break;

            case 'am consequences 1':
                answer = amConsequences1;
                break;

            case 'am consequences 2':
                answer = amConsequences2;
                break;

            case 'am consequences 3':
                answer = amConsequences3;
                break;

            case 'am consequences 4':
                answer = amConsequences4;
                break;

            case 'aggressive 1':
                answer = aggressive1;
                break;

            case 'aggressive 2':
                answer = aggressive2;
                break;

            case 'aggressive 3':
                answer = aggressive3;
                break;

            case 'aggressive 4':
                answer = aggressive4;
                break;

            case 'trigger 1':
                answer = trigger1;
                break;

            case 'trigger 2':
                answer = trigger2;
                break;

            case 'trigger 3':
                answer = trigger3;
                break;

            case 'trigger 4':
                answer = trigger4;
                break;

            case 'calming 1':
                answer = calming1;
                break;

            case 'calming 2':
                answer = calming2;
                break;

            case 'calming 3':
                answer = calming3;
                break;

            case 'calming 4':
                answer = calming4;
                break;

            default:
                return;
        }

        const amGoalId: string = amGoal?.id ?? '';

        if (amGoalId === '') {
            setShowNoGoalIdError(true);
            return;
        }

        if (answer.length < 10 || answer.length > 1500) {
            setShowAnswerError(true);
            return;
        }

        // await requiredGoalMutation.mutateAsync({
        //     externalId: userId,
        //     goalId: amGoalId
        // })
        // .catch((err) => {
        //     console.error('error: ', err);
        //     setShowErrorAlert(true);
        // });

        await clientGoalAnswerUpsert.mutateAsync({
            externalId: userId,
            goalId: amGoalId,
            answer,
            question
        })
        .catch((err) => {
            console.error('error: ', err);
            setShowErrorAlert(true);
        });

        if (!requiredGoalMutation.isError && !clientGoalAnswerUpsert.isError) {
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
                <h1 className="text-2xl font-bold mb-10">Anger Management Treatment Goals</h1>
                {/* <div className="text-xl mb-3">You may add your answers to the goals before or during the Orientation Workshop you will be attending to start your treatment program.</div> */}
                <div className="text-xl mb-3">To save an answer properly it must be at least 10 characters and no more than 1500 characters.</div>
                {/* <div className="text-xl">Please answer and save at least one goal now so that we know you have seen the goals and you can move on to the next step.</div> */}
                <br />
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Elements of Anger</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">1. Describe how anger was experienced in your childhood home.
                    {
                        clientGoalAnswers.find((a) => a.question === 'elements 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setElements1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'elements 1')?.answer} />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('elements 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. Identify current life situations that affect your level of anger.
                    {
                        clientGoalAnswers.find((a) => a.question === 'elements 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setElements2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'elements 2')?.answer} />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('elements 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. Identify a dysfunctional core belief that supports your anger and three thoughts that support that belief.
                    {
                        clientGoalAnswers.find((a) => a.question === 'elements 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setElements3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'elements 3')?.answer} />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('elements 3')}>Save</button>
                </div>
                <br />
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Consequences of Anger</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">1. Identify three negative Consequences of Anger.
                    {
                        clientGoalAnswers.find((a) => a.question === 'am consequences 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setAMConsequences1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'am consequences 1')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('am consequences 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. Identify three things anger causes in relationships.
                    {
                        clientGoalAnswers.find((a) => a.question === 'am consequences 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setAMConsequences2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'am consequences 2')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('am consequences 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. Identify a time when your anger caused a big problem.
                    {
                        clientGoalAnswers.find((a) => a.question === 'am consequences 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setAMConsequences3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'am consequences 3')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('am consequences 3')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">4. Identify a time when your anger did (or could have) cost you a relationship.
                    {
                        clientGoalAnswers.find((a) => a.question === 'am consequences 4')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setAMConsequences4(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'am consequences 4')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('am consequences 4')}>Save</button>
                </div>
                <br />
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Aggressive Communication</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">1. Explain three differences between assertive and aggressive communication.
                    {
                        clientGoalAnswers.find((a) => a.question === 'aggressive 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setAggressive1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'aggressive 1')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('aggressive 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. Identify three ways nonverbal messages can show aggression.
                    {
                        clientGoalAnswers.find((a) => a.question === 'aggressive 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setAggressive2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'aggressive 2')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('aggressive 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. Identify three nonverbal messages you tend to use (or have used) in your communication style.
                    {
                        clientGoalAnswers.find((a) => a.question === 'aggressive 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setAggressive3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'aggressive 3')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('aggressive 3')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">4. Identify three ways to avoid using aggressive communication.
                    {
                        clientGoalAnswers.find((a) => a.question === 'aggressive 4')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setAggressive4(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'aggressive 4')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('aggressive 4')}>Save</button>
                </div>
                <br />
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Trigger Thoughts</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">1. Explain the connection between events, thoughts, emotions and actions.
                    {
                        clientGoalAnswers.find((a) => a.question === 'trigger 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setTrigger1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'trigger 1')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('trigger 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. Identify three hot thoughts that increase your anger.
                    {
                        clientGoalAnswers.find((a) => a.question === 'trigger 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setTrigger2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'trigger 2')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('trigger 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. Identify three calming thoughts that decrease your anger.
                    {
                        clientGoalAnswers.find((a) => a.question === 'trigger 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setTrigger3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'trigger 3')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('trigger 3')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">4. Describe a time when you replaced hot thoughts with calming thoughts.
                    {
                        clientGoalAnswers.find((a) => a.question === 'trigger 4')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setTrigger4(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'trigger 4')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('trigger 4')}>Save</button>
                </div>
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Calming Anger</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">1. Identify three cooling down techniques.
                    {
                        clientGoalAnswers.find((a) => a.question === 'calming 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setCalming1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'calming 1')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('calming 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. Describe the steps in calling a time out for yourself.
                    {
                        clientGoalAnswers.find((a) => a.question === 'calming 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setCalming2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'calming 2')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('calming 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. What questions can you ask yourself to stay calm?
                    {
                        clientGoalAnswers.find((a) => a.question === 'calming 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setCalming3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'calming 3')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('calming 3')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">4. Describe a time when you successfully calmed yourself down from anger.
                    {
                        clientGoalAnswers.find((a) => a.question === 'calming 4')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setCalming4(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'calming 4')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('calming 4')}>Save</button>
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

export default AngerManagement;