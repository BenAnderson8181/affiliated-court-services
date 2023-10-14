import { useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { RiStarFill } from "react-icons/ri";
import HomeButton from "~/components/HomeButton";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

const Miscellaneous: NextPage = () => {
    const { user } = useUser();
    const router = useRouter();
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showNoGoalIdError, setShowNoGoalIdError] = useState(false);
    const [showAnswerError, setShowAnswerError] = useState(false);
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);
    const [boundaries1, setBoundaries1] = useState('');
    const [boundaries2, setBoundaries2] = useState('');
    const [boundaries3, setBoundaries3] = useState('');
    const [boundaries4, setBoundaries4] = useState('');
    const [no1, setNo1] = useState('');
    const [no2, setNo2] = useState('');
    const [no3, setNo3] = useState('');
    const [listening1, setListening1] = useState('');
    const [listening2, setListening2] = useState('');
    const [listening3, setListening3] = useState('');
    const [listening4, setListening4] = useState('');
    const [commitment1, setCommitment1] = useState('');
    const [commitment2, setCommitment2] = useState('');
    const [commitment3, setCommitment3] = useState('');
    const [commitment4, setCommitment4] = useState('');
    const [commitment5, setCommitment5] = useState('');

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        router.push('/').catch((err) => console.error(err));

    const goalsQuery = api.goal.list.useQuery();
    const requiredGoalsQuery = api.requiredGoal.list.useQuery({ externalId: userId });
    const clientGoalAnswerQuery = api.clientGoalAnswer.list.useQuery({ externalId: userId, goal: 'Orientation' });
    //const requiredGoalMulistening1tation = api.requiredGoal.start.useMutation();
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
            case 'boundaries 1':
                answer = boundaries1;
                break;

            case 'boundaries 2':
                answer = boundaries2;
                break;

            case 'boundaries 3':
                answer = boundaries3;
                break;

            case 'boundaries 4':
                answer = boundaries4;
                break;

            case 'no 1':
                answer = no1;
                break;

            case 'no 2':
                answer = no2;
                break;

            case 'no 3':
                answer = no3;
                break;

            case 'listening 1':
                answer = listening1;
                break;

            case 'listening 2':
                answer = listening2;
                break;

            case 'listening 3':
                answer = listening3;
                break;

            case 'listening 4':
                answer = listening4;
                break;

            case 'commitment 1':
                answer = commitment1;
                break;

            case 'commitment 2':
                answer = commitment2;
                break;

            case 'commitment 3':
                answer = commitment3;
                break;

            case 'commitment 4':
                answer = commitment4;
                break;

            case 'commitment 5':
                answer = commitment5;
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
                <h1 className="text-2xl font-bold mb-10">Miscellaneous Goals</h1>
                {/* <div className="text-xl mb-3">You may add your answers to the goals before or during the Orientation Workshop you will be attending to start your treatment program.</div> */}
                <div className="text-xl mb-3">To save an answer properly it must be at least 10 characters and no more than 1500 characters.</div>
                {/* <div className="text-xl">Please answer and save any goals with a star.  You are free to answer additional goals and may be asked to do more at a later time.</div> */}
                <br />
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Boundaries</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">1. Explain the difference between a request and a demand.
                    {
                        clientGoalAnswers.find((a) => a.question === 'boundaries 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setBoundaries1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'boundaries 1')?.answer} />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('boundaries 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. Identify three behaviors in others that are dealbreakers for you and state the consequences of that behavior.
                    {
                        clientGoalAnswers.find((a) => a.question === 'boundaries 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setBoundaries2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'boundaries 2')?.answer} />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('boundaries 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. Identify three behaviors you would like someone to change but are not dealbreakers, and how you would handle someone disregarding them.
                    {
                        clientGoalAnswers.find((a) => a.question === 'boundaries 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setBoundaries3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'boundaries 3')?.answer} />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('boundaries 3')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">4. Identify a boundary you need to set with someone and talk to them about it.
                    {
                        clientGoalAnswers.find((a) => a.question === 'boundaries 4')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setBoundaries4(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'boundaries 4')?.answer} />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('boundaries 4')}>Save</button>
                </div>
                <br />
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Saying no</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">1. Identify three reasons why &quot;no&quot; might be ignored.
                    {
                        clientGoalAnswers.find((a) => a.question === 'no 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setNo1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'no 1')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('no 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. Explain why it&apos;s ok for you to say no when it&apos;s appropriate to do so.
                    {
                        clientGoalAnswers.find((a) => a.question === 'no 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setNo2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'no 2')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('no 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. Descibe a time when you appropriately turned down a request.
                    {
                        clientGoalAnswers.find((a) => a.question === 'no 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setNo3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'no 3')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('no 3')}>Save</button>
                </div>
                <br />
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Listening</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">1. Explain the difference between hearing and listening.
                    {
                        clientGoalAnswers.find((a) => a.question === 'listening 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setListening1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'listening 1')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('listening 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. List three reasons it&apos;s to your advantage to listen to the other person.
                    {
                        clientGoalAnswers.find((a) => a.question === 'listening 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setListening2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'listening 2')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('listening 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. List three things that got in the way of listening.
                    {
                        clientGoalAnswers.find((a) => a.question === 'listening 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setListening3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'listening 3')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('listening 3')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">4. Choose one person to listen to with the intention of understanding what they are trying to tell you and describe what that experience was like.
                    {
                        clientGoalAnswers.find((a) => a.question === 'listening 4')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setListening4(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'listening 4')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('listening 4')}>Save</button>
                </div>
                <br />
                <div className="flex flex-col justify-start w-full">
                    <div className="font-semibold text-2xl w-full">Commitment</div>
                    <br />
                    <div className="text-xl w-full pl-8 relative">1. Identify one of your problem behaviors.
                    {
                        clientGoalAnswers.find((a) => a.question === 'commitment 1')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setCommitment1(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'commitment 1')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('commitment 1')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">2. Decide how and when you want to make a change.
                    {
                        clientGoalAnswers.find((a) => a.question === 'commitment 2')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setCommitment2(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'commitment 2')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('commitment 2')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">3. Write out your statement of commitment. &#40;&quot;I will...,&quot; not I&apos;ll try to...&quot;&#41;
                    {
                        clientGoalAnswers.find((a) => a.question === 'commitment 3')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setCommitment3(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'commitment 3')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('commitment 3')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">4. Implement your strategy and describe how it worked.
                    {
                        clientGoalAnswers.find((a) => a.question === 'commitment 4')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setCommitment4(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'commitment 4')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('commitment 4')}>Save</button>
                    <br />
                    <div className="text-xl w-full pl-8 relative">5. Determine if you need to modify your strategy.
                    {
                        clientGoalAnswers.find((a) => a.question === 'commitment 5')?.isCurrent === true &&
                        <span className="cursor-pointer absolute -left-4 -bottom-2"><RiStarFill size='2.5rem' className="text-amber-400" /></span>
                    }
                    </div>
                    <br />
                    <textarea className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md h-48 p-3" onChange={(e) => setCommitment5(e.target.value)} defaultValue={clientGoalAnswers.find((a) => a.question === 'commitment 5')?.answer } />
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 p-2 mt-4 hover:scale-102 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90" onClick={() => handleSave('commitment 5')}>Save</button>
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

export default Miscellaneous;