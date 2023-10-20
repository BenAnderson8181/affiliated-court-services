import { useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import HomeButton from "~/components/HomeButton";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

const Anxiety: NextPage = () => {
    const { user } = useUser();
    const router = useRouter();
    const {register, handleSubmit, formState: { isSubmitting, isValid }} = useForm();
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showProcessing, setShowProcessing] = useState(false);

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        router.push('/').catch((err) => console.error(err));

    const questionQuery = api.question.list.useQuery({ assessmentURL: 'anxiety' });
    const assessmentsQuery = api.assessment.list.useQuery();
    const requiredAssessmentsQuery = api.requiredAssessments.list.useQuery({ externalId: userId });
    const completeRequiredAssessmentMutation = api.requiredAssessments.complete.useMutation();
    const clientAssessmentAnswers = api.clientAssessmentAnswers.create.useMutation();
    const domainScoreCardMutation = api.domainScoreCard.anxiety.useMutation();

    if (questionQuery.isLoading || assessmentsQuery.isLoading || requiredAssessmentsQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (questionQuery.isError || assessmentsQuery.isError || requiredAssessmentsQuery.isError) {
        return <LoadError type='Page' />
    }

    const questions = questionQuery.data;
    const anxietyAssessment = assessmentsQuery.data?.find((assessment) => assessment.url === 'anxiety');
    const requiredAnxietyAssessments = requiredAssessmentsQuery.data?.filter((assessment) => assessment.assessment.url === 'anxiety');
    const incompleteAnxietyRequiredAssessments = requiredAnxietyAssessments?.filter((assessment) => assessment.completed !== true);

    if (incompleteAnxietyRequiredAssessments?.length === 0) {
        router.push('/account/assessments').catch((err) => console.error(err));
    }

    type Data = {
        [key: string|number]: string | null
    }

    const onSubmit = async (data: Data) => {
        const anxietyAssessmentId = anxietyAssessment?.id;

        if (!anxietyAssessmentId) {
            console.error('could not find anxiety assessment id');
            setShowSuccessAlert(false);
            return;
        }

        const nullAnswers = Object.keys(data).filter((key) => data[key] === null);

        if (nullAnswers.length > 0) {
            console.log('null answers found');
            setShowErrorAlert(true);
            return;
        }

        const answers = Object.keys(data).map((key) => {
            const answer = data[key]!.split('-'); // we know this is because in null answers we checked for nulls and returned, TS can't understand though
            return {
                questionId: key,
                answer: answer[0] ?? ''
            }
        });

        const answerSum = answers.reduce((acc, answer) => acc + parseInt(answer.answer), 0);

        if (answerSum < 7) {
            console.log('sum of answers must be at least 7');
            setShowSuccessAlert(false);
            return;
        }

        const { tscore, se, risk } = getTScore(answerSum);

        const result = await clientAssessmentAnswers.mutateAsync({
            externalId: userId,
            assessmentId: anxietyAssessmentId,
            answers
        })
        .catch((err) => {
            console.log(err);
            setShowSuccessAlert(false);
            return;
        });

        const completeResult = await completeRequiredAssessmentMutation.mutateAsync({
            externalId: userId,
            assessmentId: anxietyAssessmentId
        })
        .catch((err) => {
            console.log(err);
            setShowSuccessAlert(false);
            return;
        });

        const domainScoreCardResult = await domainScoreCardMutation.mutateAsync({
            externalId: userId,
            anxietyTScore: tscore,
            anxietySE: se,
            anxietyRisk: risk
        })
        .catch((err) => {
            console.log(err);
            setShowSuccessAlert(false);
            return;
        });

        if (result && completeResult && domainScoreCardResult) {
            setShowProcessing(true);
            window.setTimeout(() => {
                router.push('/account/assessments').catch((err) => console.error(err));
            }, 2500);
        }
    }

    const getTScore = (score: number) => {
        const result = { tscore: 0, se: 0, risk: '' };

        switch (score) {
            case 7:
                result.tscore = 36.3;
                result.se = 5.4;
                break;

            case 8:
                result.tscore = 42.1;
                result.se = 3.4;
                break;

            case 9:
                result.tscore = 44.7;
                result.se = 2.9;
                break;

            case 10:
                result.tscore = 46.7;
                result.se = 2.6;
                break;

            case 11:
                result.tscore = 48.4;
                result.se = 2.4;
                break;

            case 12:
                result.tscore = 49.9;
                result.se = 2.3;
                break;

            case 13:
                result.tscore = 51.3;
                result.se = 2.3;
                break;

            case 14:
                result.tscore = 52.6;
                result.se = 2.2;
                break;

            case 15:
                result.tscore = 53.8;
                result.se = 2.2;
                break;

            case 16:
                result.tscore = 55.1;
                result.se = 2.2;
                break;

            case 17:
                result.tscore = 56.3;
                result.se = 2.2;
                break;

            case 18:
                result.tscore = 57.6;
                result.se = 2.2;
                break;

            case 19:
                result.tscore = 58.8;
                result.se = 2.2;
                break;

            case 20:
                result.tscore = 60.0;
                result.se = 2.2;
                break;

            case 21:
                result.tscore = 61.3;
                result.se = 2.2;
                break;

            case 22:
                result.tscore = 62.6;
                result.se = 2.2;
                break;

            case 23:
                result.tscore = 63.8;
                result.se = 2.2;
                break;

            case 24:
                result.tscore = 65.1;
                result.se = 2.2;
                break;

            case 25:
                result.tscore = 66.4;
                result.se = 2.2;
                break;

            case 26:
                result.tscore = 67.7;
                result.se = 2.2;
                break;

            case 27:
                result.tscore = 68.9;
                result.se = 2.2;
                break;

            case 28:
                result.tscore = 70.2;
                result.se = 2.2;
                break;

            case 29:
                result.tscore = 71.5;
                result.se = 2.2;
                break;

            case 30:
                result.tscore = 72.9;
                result.se = 2.2;
                break;

            case 31:
                result.tscore = 74.3;
                result.se = 2.2;
                break;

            case 32:
                result.tscore = 75.8;
                result.se = 2.3;
                break;

            case 33:
                result.tscore = 77.4;
                result.se = 2.4;
                break;

            case 34:
                result.tscore = 79.5;
                result.se = 2.7;
                break;

            case 35:
                result.tscore = 82.7;
                result.se = 3.5;
                break;
        }

        if (result.tscore < 55) {
            result.risk = 'None to slight';
        }
        else if (result.tscore >= 55 && result.tscore < 60) {
            result.risk = 'Mild';
        }
        else if (result.tscore >= 60 && result.tscore < 70) {
            result.risk = 'Moderate';
        }
        else if (result.tscore >= 70) {
            result.risk = 'Severe';
        }

        return result;
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-700 pt-5">
            <div className="absolute top-5 left-5"><HomeButton /></div>
            <div className="flex flex-col items-center justify-center border border-indigo-700 rounded shadow-xl shadow-purple-900 bg-slate-100 w-5/6 p-5">
                <h1 className="text-xl font-bold mb-3">{anxietyAssessment?.description}</h1>
                <div>On the DSM-5 Level 1 cross-cutting questionnaire that you just completed, you indicated that <span className="italics">during the past 2 weeks</span>you have been bothered by 
                &#34;feeling nervous, anxious, frightened, worried, or on edge&#34;, &#34;feeling panic or being frightened&#34;, and/or &#34;avoiding situations that make
                you anxious&#34; at a mild or greater level of severity.  The questions below ask about these
                feelings in more detail and especially how often you have been bothered by a list of symptoms <span className="font-semibold underline">during the past 7 
                days.</span>  
                </div>
                <div className="mt-3"><span className="font-semibold">Please respond to each item by selecting one box per row.</span></div>
                <div className="flex justify-start mt-3">
                    <p className="mr-4"><span className="font-semibold">Never &#40;1&#41;</span></p>
                    <p className="mr-4"><span className="font-semibold">Rarely &#40;2&#41;</span></p>
                    <p className="mr-4"><span className="font-semibold">Sometimes &#40;3&#41;</span></p>
                    <p className="mr-4"><span className="font-semibold">Often &#40;4&#41;</span></p>
                    <p className=""><span className="font-semibold">Always &#40;5&#41;</span></p>
                </div>
            
                <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                { questions?.map((question, index) => (
                    <div key={question.id}>
                        <div className={`py-2 ${index % 2 === 0 ? '' : 'bg-slate-200'}`}>
                            <div className="justify-start w-2/3 inline-flex font-semibold">{question.question}</div>
                            <div className="justify-end w-1/3 inline-flex">
                                <div>
                                    <input className="peer hidden" type="radio" id={`0-${index}`} value="1" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`0-${index}`}>1</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`1-${index}`} value="2" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`1-${index}`}>2</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`2-${index}`} value="3" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`2-${index}`}>3</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`3-${index}`} value="4" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`3-${index}`}>4</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`4-${index}`} value="5" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`4-${index}`}>5</label>
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

export default Anxiety;