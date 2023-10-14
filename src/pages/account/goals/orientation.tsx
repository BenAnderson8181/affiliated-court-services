import { useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { RiStarFill } from "react-icons/ri";
import HomeButton from "~/components/HomeButton";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

const Orientation: NextPage = () => {
    const { user } = useUser();
    const router = useRouter();
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showNoGoalIdError, setShowNoGoalIdError] = useState(false);
    const [showAnswerError, setShowAnswerError] = useState(false);
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);
    const [confidence1, setConfidence1] = useState('');
    const [confidence2, setConfidence2] = useState('');
    const [confidence3, setConfidence3] = useState('');
    const [confidence4, setConfidence4] = useState('');
    const [accountability1, setAccountability1] = useState('');
    const [accountability2, setAccountability2] = useState('');
    const [accountability3, setAccountability3] = useState('');
    const [accountability4, setAccountability4] = useState('');
    const [communication1, setCommunication1] = useState('');
    const [communication2, setCommunication2] = useState('');
    const [communication3, setCommunication3] = useState('');
    const [communication4, setCommunication4] = useState('');
    const [boundary1, setBoundary1] = useState('');
    const [boundary2, setBoundary2] = useState('');
    const [boundary3, setBoundary3] = useState('');
    const [boundary4, setBoundary4] = useState('');

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        router.push('/').catch((err) => console.error(err));

    const goalsQuery = api.goal.list.useQuery();
    const requiredGoalsQuery = api.requiredGoal.list.useQuery({ externalId: userId });
    const clientGoalAnswerQuery = api.clientGoalAnswer.list.useQuery({ externalId: userId, goal: 'Orientation' });
    //const requiredGoalMutation = api.requiredGoal.start.useMutation();
    const clientGoalAnswerUpsert = api.clientGoalAnswer.upsert.useMutation();

    if (requiredGoalsQuery.isLoading || goalsQuery.isLoading || clientGoalAnswerQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (requiredGoalsQuery.isError || goalsQuery.isError || clientGoalAnswerQuery.isError) {
        return <LoadError type='Page' />
    }

    const orientationGoal = goalsQuery.data?.find((g) => g.url === 'orientation');
    const clientGoalAnswers = clientGoalAnswerQuery.data;

    const handleSave = async (question: string) => {
        let answer: string;
        switch (question) {
            case 'confidence 1':
                answer = confidence1;
                break;

            case 'confidence 2':
                answer = confidence2;
                break;

            case 'confidence 3':
                answer = confidence3;
                break;

            case 'confidence 4':
                answer = confidence4;
                break;

            case 'accountability 1':
                answer = accountability1;
                break;

            case 'accountability 2':
                answer = accountability2;
                break;

            case 'accountability 3':
                answer = accountability3;
                break;

            case 'accountability 4':
                answer = accountability4;
                break;

                case 'communication 1':
                answer = communication1;
                break;

            case 'communication 2':
                answer = communication2;
                break;

            case 'communication 3':
                answer = communication3;
                break;

            case 'communication 4':
                answer = communication4;
                break;

                case 'boundary 1':
                answer = boundary1;
                break;

            case 'boundary 2':
                answer = boundary2;
                break;

            case 'boundary 3':
                answer = boundary3;
                break;

            case 'boundary 4':
                answer = boundary4;
                break;

            default:
                return;
        }

        const orientationGoalId: string = orientationGoal?.id ?? '';

        if (orientationGoalId === '') {
            setShowNoGoalIdError(true);
            return;
        }

        if (answer.length < 10 || answer.length > 1500) {
            setShowAnswerError(true);
            return;
        }

        // if (incompleteOrientationRequiredGoals.length > 0) {
        //     if (incompleteOrientationRequiredGoals[0]?.started === false) {
        //         await requiredGoalMutation.mutateAsync({
        //             externalId: userId,
        //             goalId: orientationGoalId
        //         })
        //         .catch((err) => {
        //             console.error('error: ', err);
        //             setShowErrorAlert(true);
        //         });
        //     }
        // }

        await clientGoalAnswerUpsert.mutateAsync({
            externalId: userId,
            goalId: orientationGoalId,
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
                <h1 className="text-2xl font-bold mb-10">Orientation Treatment Goals</h1>
                <div className="text-xl mb-3">You may add your answers to the goals before or during the Orientation Workshop you will be attending to start your treatment program.</div>
                <div className="text-xl mb-3 w-full">To save an answer properly it must be at least 10 characters and no more than 1500 characters.</div>
                <div className="text-xl">Please answer and save any goals with a star.  You are free to answer additional goals and may be asked to do more at a later time.</div>
                <br />
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Treatment Goal 1 - Self Confidence</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">1. Identify 3 of your core values
                    {
                        clientGoalAnswers.find((a) => a.question === 'confidence 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setConfidence1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'confidence 1')?.answer} />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('confidence 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. Identify 3 of your core strengths
                    {
                        clientGoalAnswers.find((a) => a.question === 'confidence 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setConfidence2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'confidence 2')?.answer} />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('confidence 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. Identify 3 challenges that lower your self confidence
                    {
                        clientGoalAnswers.find((a) => a.question === 'confidence 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setConfidence3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'confidence 3')?.answer} />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('confidence 3')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">4. Choose one new habit for personal development
                    {
                        clientGoalAnswers.find((a) => a.question === 'confidence 4')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setConfidence4(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'confidence 4')?.answer} />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('confidence 4')}>Save</button>
                </div>
                <br />
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Treatment Goal 2 - Accountability</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">1. Identify 3 thinking errors related to avoiding accountability
                    {
                        clientGoalAnswers.find((a) => a.question === 'accountability 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setAccountability1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'accountability 1')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('accountability 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. Identify 3 excuses used to avoid taking responsibility for actions
                    {
                        clientGoalAnswers.find((a) => a.question === 'accountability 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setAccountability2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'accountability 2')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('accountability 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. Clearly state your part in the problem without justifying, minimizing or blaming
                    {
                        clientGoalAnswers.find((a) => a.question === 'accountability 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setAccountability3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'accountability 3')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('accountability 3')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">4. Explain why accountability = empowerment
                    {
                        clientGoalAnswers.find((a) => a.question === 'accountability 4')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setAccountability4(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'accountability 4')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('accountability 4')}>Save</button>
                </div>
                <br />
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Treatment Goal 3 - Assertive Communication Skills</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">1. Give 3 examples of when you used Aggressive Communication
                    {
                        clientGoalAnswers.find((a) => a.question === 'communication 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setCommunication1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'communication 1')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('communication 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. Give 3 examples of when you used Passive Communication
                    {
                        clientGoalAnswers.find((a) => a.question === 'communication 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setCommunication2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'communication 2')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('communication 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. Give 3 examples of when you used Passive/Aggressive Communication
                    {
                        clientGoalAnswers.find((a) => a.question === 'communication 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setCommunication3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'communication 3')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('communication 3')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">4. Give 3 examples of when you used Assertive Communication
                    {
                        clientGoalAnswers.find((a) => a.question === 'communication 4')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setCommunication4(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'communication 4')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('communication 4')}>Save</button>
                </div>
                <br />
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Treatment Goal 4 - Boundary Setting Skills</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">1. Explain why boundaries are important
                    {
                        clientGoalAnswers.find((a) => a.question === 'boundary 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setBoundary1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'boundary 1')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('boundary 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. Identify 3 non-negotiable boundaries, and state consequences
                    {
                        clientGoalAnswers.find((a) => a.question === 'boundary 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setBoundary2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'boundary 2')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('boundary 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. Identify 3 negotiable boundaries, and state consequnces
                    {
                        clientGoalAnswers.find((a) => a.question === 'boundary 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setBoundary3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'boundary 3')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('boundary 3')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">4. Practice saying no to someone who&apos;s disrespecting your boundaries
                    {
                        clientGoalAnswers.find((a) => a.question === 'boundary 4')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setBoundary4(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'boundary 4')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('boundary 4')}>Save</button>
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

export default Orientation;