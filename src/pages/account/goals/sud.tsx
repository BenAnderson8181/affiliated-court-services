import { useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { RiStarFill } from "react-icons/ri";
import HomeButton from "~/components/HomeButton";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

const SubstanceUse: NextPage = () => {
    const { user } = useUser();
    const router = useRouter();
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showNoGoalIdError, setShowNoGoalIdError] = useState(false);
    const [showAnswerError, setShowAnswerError] = useState(false);
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);
    const [consequences1, setConsequences1] = useState('');
    const [consequences2, setConsequences2] = useState('');
    const [consequences3, setConsequences3] = useState('');
    const [causes1, setCauses1] = useState('');
    const [causes2, setCauses2] = useState('');
    const [causes3, setCauses3] = useState('');
    const [avoiding1, setAvoiding1] = useState('');
    const [avoiding2, setAvoiding2] = useState('');
    const [avoiding3, setAvoiding3] = useState('');
    const [avoiding4, setAvoiding4] = useState('');
    const [finding1, setFinding1] = useState('');
    const [finding2, setFinding2] = useState('');
    const [finding3, setFinding3] = useState('');
    const [finding4, setFinding4] = useState('');

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        router.push('/').catch((err) => console.error(err));

    const goalsQuery = api.goal.list.useQuery();
    const requiredGoalsQuery = api.requiredGoal.list.useQuery({ externalId: userId });
    const clientGoalAnswerQuery = api.clientGoalAnswer.list.useQuery({ externalId: userId, goal: 'Substance Use' });
    // const requiredGoalMutation = api.requiredGoal.start.useMutation();
    const clientGoalAnswerUpsert = api.clientGoalAnswer.upsert.useMutation();

    if (requiredGoalsQuery.isLoading || goalsQuery.isLoading || clientGoalAnswerQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (requiredGoalsQuery.isError || goalsQuery.isError || clientGoalAnswerQuery.isError) {
        return <LoadError type='Page' />
    }

    const sudGoal = goalsQuery.data?.find((g) => g.url === 'sud');
    //const sudRequiredGoals = requiredGoalsQuery.data?.filter((g) => g.goal.url === 'sud');
    // const incompleteSUDRequiredGoals = sudRequiredGoals?.filter((g) => g.completed !== true);
    const clientGoalAnswers = clientGoalAnswerQuery.data;

    // if (incompleteSUDRequiredGoals?.length === 0) {
    //     router.push('/account/goals').catch((err) => console.error(err));
    // }

    const handleSave = async (question: string) => {
        let answer: string;
        switch (question) {
            case 'consequences 1':
                answer = consequences1;
                break;

            case 'consequences 2':
                answer = consequences2;
                break;

            case 'consequences 3':
                answer = consequences3;
                break;

            case 'causes 1':
                answer = causes1;
                break;

            case 'causes 2':
                answer = causes2;
                break;

            case 'causes 3':
                answer = causes3;
                break;

            case 'avoiding 1':
                answer = avoiding1;
                break;

            case 'avoiding 2':
                answer = avoiding2;
                break;

            case 'avoiding 3':
                answer = avoiding3;
                break;

            case 'avoiding 4':
                answer = avoiding4;
                break;

            case 'finding 1':
                answer = finding1;
                break;

            case 'finding 2':
                answer = finding2;
                break;

            case 'finding 3':
                answer = finding3;
                break;

            case 'finding 4':
                answer = finding4;
                break;

            default:
                return;
        }

        const sudGoalId: string = sudGoal?.id ?? '';

        if (sudGoalId === '') {
            setShowNoGoalIdError(true);
            return;
        }

        if (answer.length < 10 || answer.length > 1500) {
            setShowAnswerError(true);
            return;
        }

        // if (incompleteSUDRequiredGoals.length > 0) {
        //     if (incompleteSUDRequiredGoals[0]?.started === false) {
        //         await requiredGoalMutation.mutateAsync({
        //             externalId: userId,
        //             goalId: sudGoalId
        //         })
        //         .catch((err) => {
        //             console.error('error: ', err);
        //             setShowErrorAlert(true);
        //         });
        //     }
        // }

        await clientGoalAnswerUpsert.mutateAsync({
            externalId: userId,
            goalId: sudGoalId,
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
                <h1 className="text-2xl font-bold mb-10">Substance Use Disorder Treatment Goals</h1>
                {/* <div className="text-xl mb-3">You may add your answers to the goals before or during the Orientation Workshop you will be attending to start your treatment program.</div> */}
                <div className="text-xl mb-3">To save an answer properly it must be at least 10 characters and no more than 1500 characters.</div>
                {/* <div className="text-xl">Please answer and save at least one goal now so that we know you have seen the goals and you can move on to the next step.</div> */}
                <br />
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Negative consequences of misusing substances</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">1. What negative consequences have you seen from someone else&apos;s substance use?
                    {
                        clientGoalAnswers.find((a) => a.question === 'consequences 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setConsequences1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'consequences 1')?.answer} />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('consequences 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. List three negative consequences of your substance use.
                    {
                        clientGoalAnswers.find((a) => a.question === 'consequences 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setConsequences2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'consequences 2')?.answer} />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('consequences 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. Identify three people who have been affected by your substance misuse.
                    {
                        clientGoalAnswers.find((a) => a.question === 'consequences 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setConsequences3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'consequences 3')?.answer} />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('consequences 3')}>Save</button>
                </div>
                <br />
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Causes of substance misuse</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">1. Describe how you got started misusing substances.
                    {
                        clientGoalAnswers.find((a) => a.question === 'causes 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setCauses1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'causes 1')?.answer} />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('causes 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. List three reasons you continued misusing substances.
                    {
                        clientGoalAnswers.find((a) => a.question === 'causes 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setCauses2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'causes 2')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('causes 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. List any underlying issues you have that contribute to your substance misuse and how you will address them.
                    {
                        clientGoalAnswers.find((a) => a.question === 'causes 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setCauses3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'causes 3')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('causes 3')}>Save</button>
                </div>
                <br />
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Avoiding Relapse</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">1. Identify three relapse triggers for you.
                    {
                        clientGoalAnswers.find((a) => a.question === 'avoiding 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setAvoiding1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'avoiding 1')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('avoiding 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. Identify three relapse prevention techniques that work for you.
                    {
                        clientGoalAnswers.find((a) => a.question === 'avoiding 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setAvoiding2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'avoiding 2')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('avoiding 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. Identify three techniques you will use to avoid relapse.
                    {
                        clientGoalAnswers.find((a) => a.question === 'avoiding 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setAvoiding3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'avoiding 3')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('avoiding 3')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">4. Describe three positive things you can do if you experience a relapse.
                    {
                        clientGoalAnswers.find((a) => a.question === 'avoiding 4')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setAvoiding4(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'avoiding 4')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('avoiding 4')}>Save</button>
                </div>
                <br />
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Finding Support</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">1. List your support people and reach out to at least one of them.
                    {
                        clientGoalAnswers.find((a) => a.question === 'finding 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setFinding1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'finding 1')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('finding 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. Access at least one new community resource.
                    {
                        clientGoalAnswers.find((a) => a.question === 'finding 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setFinding2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'finding 2')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('finding 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. Explain why the people you surround yourself with have such a strong impact on your substance use.
                    {
                        clientGoalAnswers.find((a) => a.question === 'finding 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setFinding3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'finding 3')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('finding 3')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">4. Identify any people in your life that are not supportive of your sobriety and describe how you deal with them.
                    {
                        clientGoalAnswers.find((a) => a.question === 'finding 4')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setFinding4(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'finding 4')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('finding 4')}>Save</button>
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

export default SubstanceUse;