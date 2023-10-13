import { useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import HomeButton from "~/components/HomeButton";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

const Mania: NextPage = () => {
    const { user } = useUser();
    const router = useRouter();
    const {register, handleSubmit, formState: { isSubmitting, isValid }} = useForm();
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showProcessing, setShowProcessing] = useState(false);

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        router.push('/').catch((err) => console.error(err));

    const questionQuery = api.question.list.useQuery({ assessmentURL: 'mania' });
    const assessmentsQuery = api.assessment.list.useQuery();
    const requiredAssessmentsQuery = api.requiredAssessments.list.useQuery({ externalId: userId });
    const completeRequiredAssessmentMutation = api.requiredAssessments.complete.useMutation();
    const clientAssessmentAnswers = api.clientAssessmentAnswers.create.useMutation();
    const domainScoreCardMutation = api.domainScoreCard.mania.useMutation();

    if (questionQuery.isLoading || assessmentsQuery.isLoading || requiredAssessmentsQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (questionQuery.isError || assessmentsQuery.isError || requiredAssessmentsQuery.isError) {
        return <LoadError type='Page' />
    }

    const questions = questionQuery.data ?? [];
    const maniaAssessment = assessmentsQuery.data?.find((assessment) => assessment.url === 'mania');
    const requriedManiaAssessments = requiredAssessmentsQuery.data?.filter((assessment) => assessment.assessment.url === 'mania');
    const incompleteManiaRequiredAssessments = requriedManiaAssessments?.filter((assessment) => assessment.completed !== true);

    if (incompleteManiaRequiredAssessments?.length === 0) {
        router.push('/account/assessments').catch((err) => console.error(err));
    }

    type Data = {
        [key: string|number]: string | null
    }

    const onSubmit = async (data: Data) => {
        const maniaAssessmentId = maniaAssessment?.id;

        if (!maniaAssessmentId) {
            console.error('could not find mania assessment id');
            setShowSuccessAlert(false);
            return;
        }

        const categories = Object.keys(data).filter((key) => key.includes('category')).map((key) => {
            return { id: [key], value: data[key] };
        });

        const nullAnswers = Object.keys(categories).filter((key) => data[key] === null);

        if (nullAnswers.length > 0) {
            console.error('null answers found');
            setShowErrorAlert(true);
            return;
        }

        const answers = categories.map((category) => {
            let questionId = '';

            try {
                if (category.id[0] === 'category-1') {
                    questionId = questions[0]!.id;
                }
                else if (category.id[0] === 'category-2') {
                    questionId = questions[5]!.id;
                }
                else if (category.id[0] === 'category-3') {
                    questionId = questions[10]!.id;
                }
                else if (category.id[0] === 'category-4') {
                    questionId = questions[15]!.id;
                }
                else if (category.id[0] === 'category-5') {
                    questionId = questions[20]!.id;
                }
            }
            catch (error) {
                console.error(error);
                setShowErrorAlert(true);
                return;
            }
            
            if (questionId === '') {
                console.error('could not find question id');
                setShowErrorAlert(true);
                return null;
            }

            return {
                questionId,
                answer: category.value == null ? 0 : category.value,
            }
        });

        if (!answers || answers.length < 5 || answers.includes(null)) {
            console.error('not enough answers');
            setShowErrorAlert(true);
            return;
        }

        const answerSum = answers.reduce((acc, answer) => acc + (answer?.answer == null ? 0 : +answer.answer), 0);

        const risk: string[] = [];
        let count = 0;

        if (answers[0]!.answer === '5') {
            count++;
            risk.push('Happy');
        }

        if (answers[1]!.answer === '5') {
            count++;
            risk.push('Confident');
        }

        if (answers[2]!.answer === '5' || answers[2]!.answer === '4') {
            count++;
            risk.push('Sleepless');
        }

        if (answers[3]!.answer === '5' || answers[3]!.answer === '4') {
            count++;
            risk.push('Talkative');
        }

        if (answers[4]!.answer === '5') {
            count++;
            risk.push('Active');
        }

        let riskString = '';
        if (count === 0) {
            riskString = 'None to slight';
        }
        else if (count === 1) {
            riskString = `Mild ${riskString}`;
        }
        else if (count === 2) {
            const riskPart = risk[0] ?? '';
            const riskPart2 = risk[1] ?? ''; 
            riskString = `Moderate ${riskPart} and ${riskPart2}`;
        }
        else if (count >= 3) {
            riskString = 'Severe';
        }

       
        const result = await clientAssessmentAnswers.mutateAsync({
            externalId: userId,
            assessmentId: maniaAssessmentId,
            //eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore - I check earlier if answers has length of at least 5
            answers,
        })
        .catch((error) => {
            console.error(error);
            setShowSuccessAlert(true);
            return;
        });

        const completeResult = await completeRequiredAssessmentMutation.mutateAsync({
            externalId: userId,
            assessmentId: maniaAssessmentId,
        })
        .catch((error) => {
            console.error(error);
            setShowSuccessAlert(true);
            return;
        });

        const domainScoreCardResult = await domainScoreCardMutation.mutateAsync({
            externalId: userId,
            maniaRawScore: answerSum,
            maniaRisk: riskString,
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
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-700 pt-5">
            <div className="absolute top-5 left-5"><HomeButton /></div>
            <div className="flex flex-col items-center justify-center border border-indigo-700 rounded shadow-xl shadow-purple-900 bg-slate-100 w-5/6 p-5">
                <h1 className="text-xl font-bold mb-3">{maniaAssessment?.description}</h1>
                <div>On the DSM-5 Level 1 cross-cutting questionnaire that you just completed, you indicated that <span className="italics">during the past 2 weeks</span>you have been bothered by 
                    &#34;sleeping less than usual, but still having a lot of energy&#34; and/or &#34;starting lots more projects than usual or doing more risky things 
                    than usual&#34; at a mild or greater level of severity.  The five statement groups or questions below ask about these feelings in more detail.
                </div>
                <div className="mt-3">
                    <ol>
                        <li><span className="font-semibold">Please read each group of statements/question carefully.</span></li>
                        <li>Choose the one statement in each group that best describes the way you have been feeling for <span className="font-bold underline text-xl">the past week</span></li>
                        <li>Select the box in each row that best fits.</li>
                        <li><span className="font-semibold">Please note:</span> The word &#34;occasionally&#34; when used here means once or twice; &#34;often&#34; means several times or more and &#34;frequently&#34; means most the time.</li>
                    </ol>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                { questions?.map((question, index) => (
                    <div key={question.id}>
                        <div className={`mt-3  ${(index + 1) % 5 === 0 ? 'border-b-2 border-b-indigo-950 pb-3' : ''}`}>
                            <div className="justify-start w-2/3 inline-flex font-semibold">{question.question}</div>
                            <div className="justify-end w-1/3 inline-flex">
                                <div>
                                    <input className="peer hidden" type="radio" id={index.toString()} value={(index + 1) % 5 !== 0 ? (index + 1) % 5 : 5} {...register(`category-${Math.ceil((index + 1) / 5)}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={index.toString()}>{(index + 1) % 5 !== 0 ? (index + 1) % 5 : 5} </label>
                                </div>
                            </div>
                        </div>
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

export default Mania;