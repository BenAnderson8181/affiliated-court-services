import { useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import HomeButton from "~/components/HomeButton";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

const Dsm5selfrated: NextPage = () => {
    const { user } = useUser();
    const router = useRouter();
    const {register, handleSubmit, formState: { isSubmitting, isValid }} = useForm();
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showProcessing, setShowProcessing] = useState(false);

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        router.push('/').catch((err) => console.error(err));

    const questionQuery = api.question.list.useQuery({ assessmentURL: 'dsm5selfrated' });
    const assessmentsQuery = api.assessment.list.useQuery();
    const requiredAssessmentsQuery = api.requiredAssessments.list.useQuery({ externalId: userId });
    const requiredAssessmentsMutation = api.requiredAssessments.create.useMutation();
    const completeRequiredAssessmentMutation = api.requiredAssessments.complete.useMutation();
    const clientAssessmentAnswers = api.clientAssessmentAnswers.create.useMutation();
    const domainScoreCardMutation = api.domainScoreCard.create.useMutation();

    if (questionQuery.isLoading || assessmentsQuery.isLoading || requiredAssessmentsQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (questionQuery.isError || assessmentsQuery.isError || requiredAssessmentsQuery.isError) {
        return <LoadError type='Page' />
    }

    const questions = questionQuery.data;
    const dsm5selfratedAssessment = assessmentsQuery.data?.find((assessment) => assessment.url === 'dsm5selfrated');
    const dsm5selfratedRequiredAssessments = requiredAssessmentsQuery.data?.filter((assessment) => assessment.assessment.url === 'dsm5selfrated');
    const incompleteDSM5RequiredAssessments = dsm5selfratedRequiredAssessments?.filter((assessment) => assessment.completed !== true);

    if (incompleteDSM5RequiredAssessments?.length === 0) {
        router.push('/account/assessments').catch((err) => console.error(err));
    }

    type Data = {
        [key: string|number]: string | null
    }

    const onSubmitButton = async (data: Data) => {
        const dsm5selfratedAssessmentId = dsm5selfratedAssessment?.id;

        if (!dsm5selfratedAssessmentId) {
            console.error('could not find dsm5selfrated assessment id');
            setShowSuccessAlert(true);
            return;
        }

        const nullAnswers = Object.keys(data).filter((key) => data[key] === null);

        if (nullAnswers.length > 0) {
            setShowErrorAlert(true);
            return;
        }

        const answers = Object.keys(data).map((key) => {
            const answer = data[key]!.split('-');
            return {
                questionId: key,
                answer: answer[0] ?? '0',
                domain: answer[1]
            }
        });

        // we need to score each domain to determine what other assessments are required
        // please refer to the DSM-5 Self-Rated Level 1 Cross-Cutting Symptom Measure - Adult
        // for more information on how to score each domain
        // https://www.psychiatry.org/getmedia/e0b4b299-95b3-407b-b8c2-caa871ca218d/APA-DSM5TR-Level1MeasureAdult.pdf
        const domainI = answers.filter((answer) => answer.domain === 'I').map(a => +a.answer).reduce((prev, curr) => {
            return curr > prev ? curr : prev;
        });
        const domainII = answers.filter((answer) => answer.domain === 'II').map(a => +a.answer).reduce((prev, curr) => {
            return curr > prev ? curr : prev;
        });
        const domainIII = answers.filter((answer) => answer.domain === 'III').map(a => +a.answer).reduce((prev, curr) => {
            return curr > prev ? curr : prev;
        });
        const domainIV = answers.filter((answer) => answer.domain === 'IV').map(a => +a.answer).reduce((prev, curr) => {
            return curr > prev ? curr : prev;
        });
        const domainV = answers.filter((answer) => answer.domain === 'V').map(a => +a.answer).reduce((prev, curr) => {
            return curr > prev ? curr : prev;
        });
        const domainVI = answers.filter((answer) => answer.domain === 'VI').map(a => +a.answer).reduce((prev, curr) => {
            return curr > prev ? curr : prev;
        });
        const domainVII = answers.filter((answer) => answer.domain === 'VII').map(a => +a.answer).reduce((prev, curr) => {
            return curr > prev ? curr : prev;
        });
        const domainVIII = answers.filter((answer) => answer.domain === 'VIII').map(a => +a.answer).reduce((prev, curr) => {
            return curr > prev ? curr : prev;
        });
        const domainIX = answers.filter((answer) => answer.domain === 'IX').map(a => +a.answer).reduce((prev, curr) => {
            return curr > prev ? curr : prev;
        });
        const domainX = answers.filter((answer) => answer.domain === 'X').map(a => +a.answer).reduce((prev, curr) => {
            return curr > prev ? curr : prev;
        });
        const domainXI = answers.filter((answer) => answer.domain === 'XI').map(a => +a.answer).reduce((prev, curr) => {
            return curr > prev ? curr : prev;
        });
        const domainXII = answers.filter((answer) => answer.domain === 'XII').map(a => +a.answer).reduce((prev, curr) => {
            return curr > prev ? curr : prev;
        });
        const domainXIII = answers.filter((answer) => answer.domain === 'XIII').map(a => +a.answer).reduce((prev, curr) => {
            return curr > prev ? curr : prev;
        });

        // check each domain score and add to the assessment list if over the threshold
        if (domainI >= 2) {
            // Depression | Depression
            const depressionAssessmentId = assessmentsQuery.data.find((assessment) => assessment.url === 'depression')?.id;

            if (!depressionAssessmentId) {
                console.error('could not find depression assessment id');
                setShowSuccessAlert(true);
                return;
            }

            await requiredAssessmentsMutation.mutateAsync({
                externalId: userId,
                assessmentId: depressionAssessmentId
            })
            .catch((error) => {
                console.error(error);
                setShowSuccessAlert(true);

                // we may need to rollback/remove them all if any fail
            });
        }

        if (domainII >= 2) {
            // Anger | Anger
            const angerAssessmentId = assessmentsQuery.data.find((assessment) => assessment.url === 'anger')?.id;

            if (!angerAssessmentId) {
                console.error('could not find anger assessment id');
                setShowSuccessAlert(true);
                return;
            }

            await requiredAssessmentsMutation.mutateAsync({
                externalId: userId,
                assessmentId: angerAssessmentId
            })
            .catch((error) => {
                console.error(error);
                setShowSuccessAlert(true);

                // we may need to rollback/remove them all if any fail
            });
        }

        if (domainIII >= 2) {
            // Mania | Mania
            const maniaAssessmentId = assessmentsQuery.data.find((assessment) => assessment.url === 'mania')?.id;

            if (!maniaAssessmentId) {
                console.error('could not find mania assessment id');
                setShowSuccessAlert(true);
                return;
            }

            await requiredAssessmentsMutation.mutateAsync({
                externalId: userId,
                assessmentId: maniaAssessmentId
            })
            .catch((error) => {
                console.error(error);
                setShowSuccessAlert(true);

                // we may need to rollback/remove them all if any fail
            });
        }

        if (domainIV >= 2) {
            // Anxiety | Anxiety
            const anxietyAssessmentId = assessmentsQuery.data.find((assessment) => assessment.url === 'anxiety')?.id;

            if (!anxietyAssessmentId) {
                console.error('could not find anxiety assessment id');
                setShowSuccessAlert(true);
                return;
            }

            await requiredAssessmentsMutation.mutateAsync({
                externalId: userId,
                assessmentId: anxietyAssessmentId
            })
            .catch((error) => {
                console.error(error);
                setShowSuccessAlert(true);

                // we may need to rollback/remove them all if any fail
            });
        }

        if (domainV >= 2) {
            // Somatic Symptoms | Somatic
            const somaticAssessmentId = assessmentsQuery.data.find((assessment) => assessment.url === 'somatic')?.id;

            if (!somaticAssessmentId) {
                console.error('could not find somatic assessment id');
                setShowSuccessAlert(true);
                return;
            }

            await requiredAssessmentsMutation.mutateAsync({
                externalId: userId,
                assessmentId: somaticAssessmentId
            })
            .catch((error) => {
                console.error(error);
                setShowSuccessAlert(true);

                // we may need to rollback/remove them all if any fail
            });
        }

        if (domainVI >= 1) {
            // Suicidal Ideation | None
        }

        if (domainVII >= 1) {
            // Psychosis | None
        }

        if (domainVIII >= 2) {
            // Sleep | Sleep
            const sleepAssessmentId = assessmentsQuery.data.find((assessment) => assessment.url === 'sleep')?.id;

            if (!sleepAssessmentId) {
                console.error('could not find sleep assessment id');
                setShowSuccessAlert(true);
                return;
            }

            await requiredAssessmentsMutation.mutateAsync({
                externalId: userId,
                assessmentId: sleepAssessmentId
            })
            .catch((error) => {
                console.error(error);
                setShowSuccessAlert(true);

                // we may need to rollback/remove them all if any fail
            });
        }

        if (domainIX >= 2) {
            // Memory | None
        }

        if (domainX >= 2) {
            // Repetitive Thoughts and Behaviors | Repetitive
            const repetitiveAssessmentId = assessmentsQuery.data.find((assessment) => assessment.url === 'repetitive')?.id;

            if (!repetitiveAssessmentId) {
                console.error('could not find repetitive assessment id');
                setShowSuccessAlert(true);
                return;
            }

            await requiredAssessmentsMutation.mutateAsync({
                externalId: userId,
                assessmentId: repetitiveAssessmentId
            })
            .catch((error) => {
                console.error(error);
                setShowSuccessAlert(true);

                // we may need to rollback/remove them all if any fail
            });
        }

        if (domainXI >= 2) {
            // Dissociation | None
        }

        if (domainXII >= 2) {
            // Personality Functioning | None
        }

        if (domainXIII >= 1) {
            // Substance Use | Substance
            const substanceAssessmentId = assessmentsQuery.data.find((assessment) => assessment.url === 'substance')?.id;

            if (!substanceAssessmentId) {
                console.error('could not find substance assessment id');
                setShowSuccessAlert(true);
                return;
            }

            await requiredAssessmentsMutation.mutateAsync({
                externalId: userId,
                assessmentId: substanceAssessmentId
            })
            .catch((error) => {
                console.error(error);
                setShowSuccessAlert(true);

                // we may need to rollback/remove them all if any fail
            });
        }

        // save the answers
        const trimmedAnswers = answers.map((answer) => {
            return {
                questionId: answer.questionId,
                answer: answer.answer.toString()
            }
        });

        const result = await clientAssessmentAnswers.mutateAsync({
            externalId: userId,
            assessmentId: dsm5selfratedAssessmentId,
            answers: trimmedAnswers
        })
        .catch((error) => {
            console.error(error);
            setShowSuccessAlert(true);
            return;
        });

        const completeResult = await completeRequiredAssessmentMutation.mutateAsync({
            externalId: userId,
            assessmentId: dsm5selfratedAssessmentId
        })
        .catch((error) => {
            console.error(error);
            setShowSuccessAlert(true);
            return;
        });

        const domainScorecardResult = await domainScoreCardMutation.mutateAsync({
            externalId: userId,
        })
        .catch((error) => {
            console.error(error);
            setShowSuccessAlert(true);
            return;
        });

        if (result && completeResult && domainScorecardResult) {
            setShowProcessing(true);
            window.setTimeout(() => {
                router.push('/account/assessments').catch((err) => console.error(err));
            }, 5000);
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-700 pt-5">
            <div className="absolute top-5 left-5"><HomeButton /></div>
            <div className="flex flex-col items-center justify-center border border-indigo-700 rounded shadow-xl shadow-purple-900 bg-slate-100 w-5/6 p-5">
                <h1 className="text-2xl font-bold mb-10">DSM-5 Self-Rated Level 1 Cross-Cutting Symptom Measure - Adult</h1>
                <div>Over the last 2 weeks, how often have you been bothered by any of the following problems?</div>
                <div>For each question please select the number that relates most to you</div>
                <div className="flex justify-start mt-5">
                    <p className="mr-4"><span className="font-semibold">None &#40;0&#41;</span><br />Not&nbsp;at&nbsp;all</p>
                    <p className="mr-4"><span className="font-semibold">Slight &#40;1&#41;</span><br />Rare,&nbsp;less&nbsp;then&nbsp;a&nbsp;day&nbsp;or&nbsp;2</p>
                    <p className="mr-4"><span className="font-semibold">Mild &#40;2&#41;</span><br />Several&nbsp;days</p>
                    <p className="mr-4"><span className="font-semibold">Moderate &#40;3&#41;</span><br />More&nbsp;then&nbsp;half&nbsp;the&nbsp;days</p>
                    <p className=""><span className="font-semibold">Severe &#40;4&#41;</span><br />Nearly&nbsp;every&nbsp;day</p>
                </div>
              
                <form onSubmit={handleSubmit(onSubmitButton)}>
                { questions?.map((question, index) => (
                    <div key={question.id}>
                        <div className={`py-2 ${index % 2 === 0 ? '' : 'bg-slate-200'}`}>
                            <div className="justify-start w-2/3 inline-flex font-semibold">{question.question}</div>
                            <div className="justify-end w-1/3 inline-flex">
                                <div>
                                    <input className="peer hidden" type="radio" id={`0-${index}`} value={`0-${question.domain}`} {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`0-${index}`}>0</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`1-${index}`} value={`1-${question.domain}`} {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`1-${index}`}>1</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`2-${index}`} value={`2-${question.domain}`} {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`2-${index}`}>2</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`3-${index}`} value={`3-${question.domain}`} {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`3-${index}`}>3</label>
                                </div>
                                <div>
                                    <input className="peer hidden" type="radio" id={`4-${index}`} value={`4-${question.domain}`} {...register(`${question.id}`)} />
                                    <label className="flex justify-center w-6 cursor-pointer border border-indigo-700 rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100" htmlFor={`4-${index}`}>4</label>
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
    );
}

export default Dsm5selfrated;