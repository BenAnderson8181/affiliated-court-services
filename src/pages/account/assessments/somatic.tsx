import { useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import HomeButton from "~/components/HomeButton";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

const Somatic: NextPage = () => {
    const { user } = useUser();
    const router = useRouter();
    const {register, handleSubmit, formState: { isSubmitting, isValid }} = useForm();
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showProcessing, setShowProcessing] = useState(false);

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        router.push('/').catch((err) => console.error(err));

    const questionQuery = api.question.list.useQuery({ assessmentURL: 'somatic' });
    const assessmentsQuery = api.assessment.list.useQuery();
    const requiredAssessmentsQuery = api.requiredAssessments.list.useQuery({ externalId: userId });
    const completeRequiredAssessmentMutation = api.requiredAssessments.complete.useMutation();
    const clientAssessmentAnswers = api.clientAssessmentAnswers.create.useMutation();
    const domainScoreCardMutation = api.domainScoreCard.somatic.useMutation();

    if (questionQuery.isLoading || assessmentsQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (questionQuery.isError || assessmentsQuery.isError || requiredAssessmentsQuery.isError) {
        return <LoadError type='Modal' />
    }

    const questions = questionQuery.data;
    const somaticAssessment = assessmentsQuery.data?.find((assessment) => assessment.url === 'somatic');
    const requiredSomaticAssessments = requiredAssessmentsQuery.data?.filter((assessment) => assessment.assessment.url === 'somatic');
    const incompleteSomaticRequiredAssessments = requiredSomaticAssessments?.filter((assessment) => assessment.completed !== true);

    if (incompleteSomaticRequiredAssessments?.length === 0) {
        router.push('/account/assessments').catch((err) => console.error(err));
    }

    type Data = {
        [key: string|number]: string | null
    }

    const onSubmit = async (data: Data) => {
        const somaticAssessmentId = somaticAssessment?.id;

        if (!somaticAssessmentId) {
            console.warn('could not find somatic assessment id');
            setShowSuccessAlert(false);
            return;
        }

        const nullAnswers = Object.keys(data).filter((key) => data[key] === null);

        if (nullAnswers.length > 0) {
            console.warn('null answers found');
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

        if (answerSum < 5) {
            severity = 'Minimal';
        }
        else if (answerSum < 10) {
            severity = 'Low';
        }
        else if (answerSum < 15) {
            severity = 'Medium';
        }
        else {
            severity = 'High';
        }

        const result = await clientAssessmentAnswers.mutateAsync({
            externalId: userId,
            assessmentId: somaticAssessmentId,
            answers
        })
        .catch((err) => {
            console.error(err);
            setShowSuccessAlert(false);
            return;
        });

        const completeResult = await completeRequiredAssessmentMutation.mutateAsync({
            externalId: userId,
            assessmentId: somaticAssessmentId,
        })
        .catch((err) => {
            console.error(err);
            setShowSuccessAlert(false);
            return;
        });

        const domainScoreCardResult = await domainScoreCardMutation.mutateAsync({
            externalId: userId,
            somaticPHQ15Score: answerSum,
            somaticSeverity: severity,
        })
        .catch((err) => {
            console.error(err);
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

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-700 pt-5">
            <div className="absolute top-5 left-5"><HomeButton /></div>
            <div className="flex flex-col items-center justify-center border border-indigo-700 rounded shadow-xl shadow-purple-900 bg-slate-100 w-5/6 p-5">
                <h1 className="text-xl font-bold mb-3">{somaticAssessment?.description}</h1>
                <div>On the DSM-5 Level 1 cross-cutting questionnaire that you just completed, you indicated that <span className="italics">during the past 2 weeks</span>you have been bothered by 
                &#34;unexplained aches and pains&#34;, and/or &#34;feeling that your illnesses are not being taken serious enough&#34; at a mild or greater level of severity.  The questions below ask about these
                feelings in more detail and especially how often you have been bothered by a list of symptoms <span className="font-semibold underline">during the past 7 
                days.</span>  
                </div>
                <div className="mt-3"><span className="font-semibold">Please respond to each item by selecting one box per row.</span></div>
                <div className="flex justify-start mt-3">
                    <p className="mr-4"><span className="font-semibold">Not bothered at all &#40;0&#41;</span></p>
                    <p className="mr-4"><span className="font-semibold">Bothered a little &#40;1&#41;</span></p>
                    <p className="mr-4"><span className="font-semibold">Bothered a lot &#40;2&#41;</span></p>
                </div>
            
                <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                { questions?.map((question, index) => (
                    <div key={question.id}>
                        <div className={`py-2 ${index % 2 === 0 ? '' : 'bg-slate-200'}`}>
                            <div className="justify-start w-2/3 inline-flex font-semibold">{question.question}</div>
                            <div className="justify-end w-1/3 inline-flex">
                                <div>
                                    <input className="peer hidden" type="radio" id={`0-${index}`} value="0" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`0-${index}`}>0</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`1-${index}`} value="1" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`1-${index}`}>1</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`2-${index}`} value="2" {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`2-${index}`}>2</label>
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

export default Somatic;