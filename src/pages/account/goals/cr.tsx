import { useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { RiStarFill } from "react-icons/ri";
import HomeButton from "~/components/HomeButton";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

const CognitiveRestructuring: NextPage = () => {
    const { user } = useUser();
    const router = useRouter();
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showNoGoalIdError, setShowNoGoalIdError] = useState(false);
    const [showAnswerError, setShowAnswerError] = useState(false);
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);
    const [awareness1, setAwareness1] = useState('');
    const [awareness2, setAwareness2] = useState('');
    const [awareness3, setAwareness3] = useState('');
    const [inaccurate1, setInaccurate1] = useState('');
    const [inaccurate2, setInaccurate2] = useState('');
    const [inaccurate3, setInaccurate3] = useState('');
    const [dysfunctional1, setDysfunctional1] = useState('');
    const [dysfunctional2, setDysfunctional2] = useState('');
    const [dysfunctional3, setDysfunctional3] = useState('');
    const [dysfunctional4, setDysfunctional4] = useState('');
    const [dysfunctional5, setDysfunctional5] = useState('');
    const [dysfunctional6, setDysfunctional6] = useState('');
    const [dysfunctional7, setDysfunctional7] = useState('');
    const [dysfunctional8, setDysfunctional8] = useState('');
    const [dysfunctional9, setDysfunctional9] = useState('');

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        router.push('/').catch((err) => console.error(err));

    const goalsQuery = api.goal.list.useQuery();
    const requiredGoalsQuery = api.requiredGoal.list.useQuery({ externalId: userId });
    const clientGoalAnswerQuery = api.clientGoalAnswer.list.useQuery({ externalId: userId, goal: 'Cognitive Restructuring' });
    // const requiredGoalMutation = api.requiredGoal.start.useMutation();
    const clientGoalAnswerUpsert = api.clientGoalAnswer.upsert.useMutation();

    if (requiredGoalsQuery.isLoading || goalsQuery.isLoading || clientGoalAnswerQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (requiredGoalsQuery.isError || goalsQuery.isError || clientGoalAnswerQuery.isError) {
        return <LoadError type='Page' />
    }

    const crGoal = goalsQuery.data?.find((g) => g.url === 'cr');
    // const crRequiredGoals = requiredGoalsQuery.data?.filter((g) => g.goal.url === 'cr');
    const clientGoalAnswers = clientGoalAnswerQuery.data;

    const handleSave = async (question: string) => {
        let answer: string;
        switch (question) {
            case 'awareness 1':
                answer = awareness1;
                break;

            case 'awareness 2':
                answer = awareness2;
                break;

            case 'awareness 3':
                answer = awareness3;
                break;

            case 'inaccurate 1':
                answer = inaccurate1;
                break;

            case 'inaccurate 2':
                answer = inaccurate2;
                break;

            case 'inaccurate 3':
                answer = inaccurate3;
                break;

            case 'dysfunctional 1':
                answer = dysfunctional1;
                break;

            case 'dysfunctional 2':
                answer = dysfunctional2;
                break;

            case 'dysfunctional 3':
                answer = dysfunctional3;
                break;

            case 'dysfunctional 4':
                answer = dysfunctional4;
                break;

            case 'dysfunctional 5':
                answer = dysfunctional5;
                break;

            case 'dysfunctional 6':
                answer = dysfunctional6;
                break;

            case 'dysfunctional 7':
                answer = dysfunctional7;
                break;

            case 'dysfunctional 8':
                answer = dysfunctional8;
                break;

            case 'dysfunctional 9':
                answer = dysfunctional9;
                break;

            default:
                return;
        }

        const crGoalId: string = crGoal?.id ?? '';

        if (crGoalId === '') {
            setShowNoGoalIdError(true);
            return;
        }

        if (answer.length < 10 || answer.length > 1500) {
            setShowAnswerError(true);
            return;
        }

        // await requiredGoalMutation.mutateAsync({
        //     externalId: userId,
        //     goalId: crGoalId
        // })
        // .catch((err) => {
        //     console.error('error: ', err);
        //     setShowErrorAlert(true);
        // });

        await clientGoalAnswerUpsert.mutateAsync({
            externalId: userId,
            goalId: crGoalId,
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
                <h1 className="text-2xl font-bold mb-10">Cognitive Restructuring Treatment Goals</h1>
                {/* <div className="text-xl mb-3">You may add your answers to the goals before or during the Orientation Workshop you will be attending to start your treatment program.</div> */}
                <div className="text-xl mb-3">To save an answer properly it must be at least 10 characters and no more than 1500 characters.</div>
                {/* <div className="text-xl">Please answer and save at least one goal now so that we know you have seen the goals and you can move on to the next step.</div> */}
                <br />
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Awareness of thinking patterns</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">1. Explain how automatic thoughts are formed.
                    {
                        clientGoalAnswers.find((a) => a.question === 'awareness 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setAwareness1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'awareness 1')?.answer} />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('awareness 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. List three categories of thinking errors.
                    {
                        clientGoalAnswers.find((a) => a.question === 'awareness 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setAwareness2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'awareness 2')?.answer} />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('awareness 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. Identify three maladaptive thinking patterns you have that you were previously unaware of.
                    {
                        clientGoalAnswers.find((a) => a.question === 'awareness 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setAwareness3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'awareness 3')?.answer} />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('awareness 3')}>Save</button>
                </div>
                <br />
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Inaccurate Thoughts</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">1. Identify a time you exaggerated and rewrite a more accurate statement.
                    {
                        clientGoalAnswers.find((a) => a.question === 'inaccurate 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setInaccurate1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'inaccurate 1')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('inaccurate 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. Identify a time you had an unreasonable expectation of yourself, or someone else, and rewrite a more rational one.
                    {
                        clientGoalAnswers.find((a) => a.question === 'inaccurate 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setInaccurate2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'inaccurate 2')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('inaccurate 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. Identify a time when you made an assumption that caused problems.
                    {
                        clientGoalAnswers.find((a) => a.question === 'inaccurate 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setInaccurate3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'inaccurate 3')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('inaccurate 3')}>Save</button>
                </div>
                <br />
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Common Dysfunctional Beliefs</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">1. &quot;Life should be fair.&quot; Explain why this belief is a problem.
                    {
                        clientGoalAnswers.find((a) => a.question === 'dysfunctional 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setDysfunctional1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'dysfunctional 1')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('dysfunctional 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. &quot;I should be respected.&quot; Explain why this belief is a problem.
                    {
                        clientGoalAnswers.find((a) => a.question === 'dysfunctional 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setDysfunctional2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'dysfunctional 2')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('dysfunctional 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. &quot;I should have the things I want.&quot; Explain why this belief is a problem.
                    {
                        clientGoalAnswers.find((a) => a.question === 'dysfunctional 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setDysfunctional3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'dysfunctional 3')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('dysfunctional 3')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">4. &quot;Mistakes are unacceptable.&quot; Explain why this belief is a problem.
                    {
                        clientGoalAnswers.find((a) => a.question === 'dysfunctional 4')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setDysfunctional4(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'dysfunctional 4')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('dysfunctional 4')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">5. &quot;Everyone treats me bad.&quot; Explain why this belief is a problem.
                    {
                        clientGoalAnswers.find((a) => a.question === 'dysfunctional 5')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setDysfunctional5(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'dysfunctional 5')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('dysfunctional 5')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">6. &quot;The cops tried to get me for _____.&quot; Explain why this belief is a problem.
                    {
                        clientGoalAnswers.find((a) => a.question === 'dysfunctional 6')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setDysfunctional6(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'dysfunctional 6')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('dysfunctional 6')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">7. &quot;The system is against me.&quot; Explain why this belief is a problem.
                    {
                        clientGoalAnswers.find((a) => a.question === 'dysfunctional 7')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setDysfunctional7(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'dysfunctional 7')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('dysfunctional 7')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">8. &quot;It&apos;s all about the money.&quot; Explain why this belief is a problem.
                    {
                        clientGoalAnswers.find((a) => a.question === 'dysfunctional 8')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setDysfunctional8(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'dysfunctional 8')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('dysfunctional 8')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">9. &quot;I can&apos;t do anything about it.&quot; Explain why this belief is a problem.
                    {
                        clientGoalAnswers.find((a) => a.question === 'dysfunctional 9')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setDysfunctional9(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'dysfunctional 9')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('dysfunctional 9')}>Save</button>
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

export default CognitiveRestructuring;