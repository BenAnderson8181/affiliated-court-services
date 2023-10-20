import { useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import HomeButton from "~/components/HomeButton";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

const Repetitive: NextPage = () => {
    const { user } = useUser();
    const router = useRouter();
    const {register, handleSubmit, formState: { isSubmitting, isValid }} = useForm();
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showProcessing, setShowProcessing] = useState(false);

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        router.push('/').catch((err) => console.error(err));

    const questionQuery = api.question.list.useQuery({ assessmentURL: 'repetitive' });
    const assessmentsQuery = api.assessment.list.useQuery();
    const requiredAssessmentsQuery = api.requiredAssessments.list.useQuery({ externalId: userId });
    const completeRequiredAssessmentMutation = api.requiredAssessments.complete.useMutation();
    const clientAssessmentAnswers = api.clientAssessmentAnswers.create.useMutation();
    const domainScoreCardMutation = api.domainScoreCard.repetitive.useMutation();

    if (questionQuery.isLoading || assessmentsQuery.isLoading || requiredAssessmentsQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (questionQuery.isError || assessmentsQuery.isError || requiredAssessmentsQuery.isError || questionQuery.status !== 'success') {
        return <LoadError type='Modal' />
    }

    const questions = questionQuery.data;
    const repetitiveAssessment = assessmentsQuery.data?.find(a => a.url === 'repetitive');
    const requiredRepetitiveAssessments = requiredAssessmentsQuery.data?.filter(a => a.assessment.url === 'repetitive');
    const incompleteRepetitiveRequiredAssessments = requiredRepetitiveAssessments?.filter((a) => a.completed !== true);

    if (incompleteRepetitiveRequiredAssessments?.length === 0) {
        router.push('/account/assessments').catch((err) => console.error(err));
    }
    
    if (questions?.length !== 5)
        return <LoadError type='Modal' />

    const firstQuestion = Array(questions[0]!);
    const secondQuestion = Array(questions[1]!);
    const thirdQuestion = Array(questions[2]!);
    const fourthQuestion = Array(questions[3]!);
    const fifthQuestion = Array(questions[4]!);

    type Data = {
        [key: string|number]: string | null
    }

    const onSubmit = async (data: Data) => {
        const repetitiveAssessmentId = repetitiveAssessment?.id;

        if (!repetitiveAssessmentId) {
            console.error('could not find repetitive assessment id');
            setShowSuccessAlert(false);
            return;
        }

        const nullAnswers = Object.keys(data).filter((key) => data[key] === null);

        if (nullAnswers.length > 0) {
            console.error('null answers found');
            setShowErrorAlert(true);
            return;
        }

        const answers = Object.keys(data).map((key) => {
            const answer = data[key]!.split('-');
            return {
                questionId: key,
                answer: answer[0] ?? '0',
            }
        });

        const answerSum = answers.reduce((acc, answer) => acc + parseInt(answer.answer), 0);

        let severity = '';

        const averageScore = answerSum / 5;

        if (averageScore < 0.5) {
            severity = 'none';
        }
        else if (averageScore >= 0.5 && averageScore < 1.5) {
            severity = 'mild';
        }
        else if (averageScore >= 1.5 && averageScore < 2.5) {
            severity = 'moderate';
        }
        else if (averageScore >= 2.5 && averageScore < 3.5) {
            severity = 'severe';
        }
        else if (averageScore >= 3.5) {
            severity = 'extreme';
        }

        const result = await clientAssessmentAnswers.mutateAsync({
            externalId: userId,
            assessmentId: repetitiveAssessmentId,
            answers,
        })
        .catch((error) => {
            console.error(error);
            setShowSuccessAlert(true);
            return;
        });

        const completeResult = await completeRequiredAssessmentMutation.mutateAsync({
            externalId: userId,
            assessmentId: repetitiveAssessmentId,
        })
        .catch((error) => {
            console.error(error);
            setShowSuccessAlert(true);
            return;
        });

        const domainScoreCardResult = await domainScoreCardMutation.mutateAsync({
            externalId: userId,
            repetitiveAverage: averageScore,
            repetitiveSeverity: severity,
        })
        .catch((error) => {
            console.error(error);
            setShowSuccessAlert(true);
            return;
        });

        if (result && completeResult && domainScoreCardResult) {
            setShowProcessing(true);
            window.setTimeout(() => {
                router.push('/account/assessments').catch((err) => console.error(err));
            }, 2500);
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-700 pt-5">
            <div className="absolute top-5 left-5"><HomeButton /></div>
            <div className="flex flex-col items-center justify-center border border-indigo-700 rounded shadow-xl shadow-purple-900 bg-slate-100 w-5/6 p-5">
                <h1 className="text-xl font-bold mb-3">{repetitiveAssessment?.description}</h1>
                <div>On the DSM-5 Level 1 cross-cutting questionnaire that you just completed , you indicated that <span className="italics">during the past 2 weeks</span>you have been bothered by 
                &#34;unwanted repeated thoughts, images, or urges&#34; and/or &#34;being driven to perform certain behaviors or mental acts over and over&#34; at a mild or greater level of severity.  The questions below ask about these
                feelings in more detail and especially how often you have been bothered by a list of symptoms <span className="font-semibold underline">during the past 7 
                days.</span>  
                </div>
                <div className="mt-3"><span className="font-semibold">Please respond to each item by selecting one box per row.</span></div>
                <div className="flex justify-start mt-3">
                    <p className="mr-4"><span className="font-semibold">0-None </span></p>
                    <p className="mr-4"><span className="font-semibold">1-Mild &#40;less than an hour a day&#41;</span></p>
                    <p className="mr-4"><span className="font-semibold">2-Moderate &#40;1 to 3 hours a day&#41;</span></p>
                    <p className="mr-4"><span className="font-semibold">3-Severe &#40;3 to 8 hours a day&#41;</span></p>
                    <p className=""><span className="font-semibold">4-Extreme &#40;more than 8 hours a day&#41;</span></p>
                </div>
              
                <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                { 
                    firstQuestion.map((question, index) => (
                    <div key={question.id}>
                        <div className="mt-3">
                            <div className="justify-start w-2/3 inline-flex font-semibold">{question.question}</div>
                            <div className="justify-end w-1/3 inline-flex">
                                <div>
                                    <input className="peer hidden" type="radio" id={`0-${index}`} value="0" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`0-${index}`}>0</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`1-${index}`} value="2" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`1-${index}`}>1</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`2-${index}`} value="3" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`2-${index}`}>2</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`3-${index}`} value="4" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`3-${index}`}>3</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`4-${index}`} value="5" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`4-${index}`}>4</label>
                                </div>
                            </div>
                        </div>
                        <hr />
                    </div>
                ))}
                    <div className="flex justify-center mt-3">
                        <p className="mr-4"><span className="font-semibold">0-None</span></p>
                        <p className="mr-4"><span className="font-semibold">1-Mild &#40;slightly disturbing&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">2-Moderate &#40;disturbing but still manageable&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">3-Severe &#40;very disturbing&#41;</span></p>
                        <p className=""><span className="font-semibold">4-Extreme &#40;overwhelming distress&#41;</span></p>
                    </div>
                {
                    secondQuestion?.map((question, index) => (
                    <div key={question.id}>
                        <div className="mt-3">
                            <div className="justify-start w-2/3 inline-flex font-semibold">{question.question}</div>
                            <div className="justify-end w-1/3 inline-flex">
                                <div>
                                    <input className="peer hidden" type="radio" id={`5-${index}`} value="0" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`5-${index}`}>0</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`6-${index}`} value="1" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`6-${index}`}>1</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`7-${index}`} value="2" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`7-${index}`}>2</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`8-${index}`} value="3" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`8-${index}`}>3</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`9-${index}`} value="4" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`9-${index}`}>4</label>
                                </div>
                            </div>
                        </div>
                        <hr />
                    </div>
                ))}
                    <div className="flex justify-center mt-3">
                        <p className="mr-4"><span className="font-semibold">0-Complete control</span></p>
                        <p className="mr-4"><span className="font-semibold">1-Much control &#40;usually able to control thoughts or behaviors&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">2-Moderate control &#40;sometimes able to control thoughts or behvaiors&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">3-Little control &#40;infrequently able to control thoughts or behaviors&#41;</span></p>
                        <p className=""><span className="font-semibold">4-No control &#40;unable to control thoughts or behaviors&#41;</span></p>
                    </div>
                {
                    thirdQuestion.map((question, index) => (
                    <div key={question.id}>
                        <div className="mt-3">
                            <div className="justify-start w-2/3 inline-flex font-semibold">{question.question}</div>
                            <div className="justify-end w-1/3 inline-flex">
                                <div>
                                    <input className="peer hidden" type="radio" id={`10-${index}`} value="0" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`10-${index}`}>0</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`11-${index}`} value="1" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`11-${index}`}>1</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`12-${index}`} value="2" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`12-${index}`}>2</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`13-${index}`} value="3" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`13-${index}`}>3</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`14-${index}`} value="4" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`14-${index}`}>4</label>
                                </div>
                            </div>
                        </div>
                        <hr />
                    </div>
                ))}
                    <div className="flex justify-center mt-3">
                        <p className="mr-4"><span className="font-semibold">0-No avoidance</span></p>
                        <p className="mr-4"><span className="font-semibold">1-Mild &#40;occasional avoidance&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">2-Moderate &#40;regulary avoid doing these things&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">3-Severe &#40;frequent and extreme avoidance&#41;</span></p>
                        <p className=""><span className="font-semibold">4-Extreme &#40;nearly complete avoidance, house-bound&#41;</span></p>
                    </div>
                {
                    fourthQuestion.map((question, index) => (
                    <div key={question.id}>
                        <div className="mt-3">
                            <div className="justify-start w-2/3 inline-flex font-semibold">{question.question}</div>
                            <div className="justify-end w-1/3 inline-flex">
                                <div>
                                    <input className="peer hidden" type="radio" id={`15-${index}`} value="0" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`15-${index}`}>0</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`16-${index}`} value="1" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`16-${index}`}>1</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`17-${index}`} value="2" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`17-${index}`}>2</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`18-${index}`} value="3" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`18-${index}`}>3</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`19-${index}`} value="4" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`19-${index}`}>4</label>
                                </div>
                            </div>
                        </div>
                        <hr />
                    </div>
                ))}
                    <div className="flex justify-center mt-3">
                        <p className="mr-4"><span className="font-semibold">0-None</span></p>
                        <p className="mr-4"><span className="font-semibold">1-Mild &#40;slight interference&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">2-Moderate &#40;definite interference with functioning, nut still manageable&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">3-Severe &#40;substantial interference&#41;</span></p>
                        <p className=""><span className="font-semibold">4-Extreme &#40;near total interference, incapacitated&#41;</span></p>
                    </div>
                {
                    fifthQuestion.map((question, index) => (
                    <div key={question.id}>
                        <div className="mt-3">
                            <div className="justify-start w-2/3 inline-flex font-semibold">{question.question}</div>
                            <div className="justify-end w-1/3 inline-flex">
                                <div>
                                    <input className="peer hidden" type="radio" id={`20-${index}`} value="0" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`20-${index}`}>0</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`21-${index}`} value="1" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`21-${index}`}>1</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`22-${index}`} value="2" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`22-${index}`}>2</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`23-${index}`} value="3" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`23-${index}`}>3</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`24-${index}`} value="4" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`24-${index}`}>4</label>
                                </div>
                            </div>
                        </div>
                        <hr />
                    </div>
                ))}
                    <input
                        type="submit"
                        disabled={isSubmitting || !isValid}
                        className="rounded border border-indigo-700 text-slate-700 ml-2 px-5 py-2 duration-300 hover:opacity-50 cursor-pointer mt-5"
                    />
                </form>

                { showErrorAlert &&
                    <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Every question needs an answer to continue.</div>
                }
                { showSuccessAlert &&
                    <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Something went wrong saving the assessment.  Please try again or contact our office at 801-888-8888</div>
                }
                { showProcessing &&
                    <div className="border-2 border-green-700 rounded p-12 m-12 text-slate-700 flex flex-col my-auto items-center fixed top-auto w-full z-50 text-4xl animate-pulse">Processing the assessment...</div>
                }
            </div>
        </div>
    )
}

export default Repetitive;