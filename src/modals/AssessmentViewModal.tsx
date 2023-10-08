import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

type Props = {
    assessment: string;
    accountId: string;
}

const AssessmentViewModal = ({ assessment, accountId }: Props) => {
    const assessmentQuery = api.clientAssessmentAnswers.get.useQuery({ assessment, accountId });
    const maniaQuestionQuery = api.question.list.useQuery({ assessmentURL: 'mania' });

    if (assessmentQuery.isLoading || maniaQuestionQuery.isLoading) {
        return <Loading type='Modal' />
    }

    if (assessmentQuery.isError || maniaQuestionQuery.isError) {
        return <LoadError type="Modal" />
    }

    const clientAssessment = assessmentQuery.data;
    const name = assessment.split(' - ')[0];

    const maniaQuestions: string[] = [];
    if (name === 'Mania') {
        if (clientAssessment.length === 5){
            const questions = maniaQuestionQuery.data;
            maniaQuestions.push(questions[+clientAssessment[0]!.answer - 1]?.question ?? '');
            maniaQuestions.push(questions[+clientAssessment[1]!.answer + 4]?.question ?? '');
            maniaQuestions.push(questions[+clientAssessment[2]!.answer + 9]?.question ?? '');
            maniaQuestions.push(questions[+clientAssessment[3]!.answer + 14]?.question ?? '');
            maniaQuestions.push(questions[+clientAssessment[4]!.answer + 19]?.question ?? '');
        }
    }

    return (
        <div className="h-fit w-full">
            <div className={`flex flex-row justify-center px-2 ${name === 'DSM-5 Self Rated' ? 'text-xl pt-1 pb-2' : 'text-3xl py-2 mb-2'} bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 w-full rounded-t-md`}>{assessment}</div>
            <div className="text-2xl p-2">
                {
                    name === 'Anger' &&
                    <div className="flex justify-start mb-3 text-xl">
                        <p className="mr-4"><span className="font-semibold">Never &#40;1&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Rarely &#40;2&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Sometimes &#40;3&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Often &#40;4&#41;</span></p>
                        <p className=""><span className="font-semibold">Always &#40;5&#41;</span></p>
                    </div>
                }
                {
                    name === 'Anxiety' &&
                    <div className="flex justify-start mb-3 text-xl">
                        <p className="mr-4"><span className="font-semibold">Never &#40;1&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Rarely &#40;2&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Sometimes &#40;3&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Often &#40;4&#41;</span></p>
                        <p className=""><span className="font-semibold">Always &#40;5&#41;</span></p>
                    </div>
                }
                {
                    name === 'Depression' &&
                    <div className="flex justify-start mb-3 text-xl">
                        <p className="mr-4"><span className="font-semibold">Never &#40;1&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Rarely &#40;2&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Sometimes &#40;3&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Often &#40;4&#41;</span></p>
                        <p className=""><span className="font-semibold">Always &#40;5&#41;</span></p>
                    </div>
                }
                {
                    name === 'DSM-5 Self Rated' &&
                    <div className="flex justify-start text-base">
                        <p className="mr-4"><span className="font-semibold">None &#40;0&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Slight &#40;1&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Mild &#40;2&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Moderate &#40;3&#41;</span></p>
                        <p className=""><span className="font-semibold">Severe &#40;4&#41;</span></p>
                    </div>
                }
                {
                    name === 'Mania' &&
                    maniaQuestions.map((question, index) => {
                        return (
                            <div key={`mania-${index}`} className={`flex justify-between ${index % 2 === 0 ? 'bg-slate-200' : ''}`}>
                                <div>{question}</div>
                            </div>
                        )
                    })
                }
                {
                    name === 'Repetitive Thoughts and Behaviors' &&
                    <div className="flex justify-start mb-3 text-lg">
                        <p className="mr-4"><span className="font-semibold">0-None </span></p>
                        <p className="mr-4"><span className="font-semibold">1-Mild &#40;less than an hour a day&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">2-Moderate &#40;1 to 3 hours a day&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">3-Severe &#40;3 to 8 hours a day&#41;</span></p>
                        <p className=""><span className="font-semibold">4-Extreme &#40;more than 8 hours a day&#41;</span></p>
                    </div>
                }
                {
                    name === 'Sleep Disturbance' &&
                    <div className="flex justify-end mb-3 w-full text-xl">
                        <p className="mr-4"><span className="font-semibold">Not at all  &#40;1&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">A little bit &#40;2&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Somewhat &#40;3&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Quite a bit &#40;4&#41;</span></p>
                        <p className=""><span className="font-semibold">Very much &#40;5&#41;</span></p>
                    </div>
                }
                {
                    name === 'Sleep Disturbance' &&
                    clientAssessment.map((question, index) => {
                        if (index === 0 || index === 3) {
                            return (
                                <div key={question.id} className={`flex justify-between ${index % 2 === 0 ? 'bg-slate-200' : ''}`}>
                                    <div>{question.question.question}</div>
                                    <div className="font-semibold">{question.answer}</div>
                                </div>
                            )
                        }
                    })
                }
                {
                    name === 'Sleep Disturbance' &&
                    <div className="flex justify-end mb-3 w-full text-xl">
                        <p className="mr-4"><span className="font-semibold">Not at all  &#40;5&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">A little bit &#40;4&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Somewhat &#40;3&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Quite a bit &#40;2&#41;</span></p>
                        <p className=""><span className="font-semibold">Very much &#40;1&#41;</span></p>
                    </div>
                }
                {
                    name === 'Sleep Disturbance' &&
                    clientAssessment.map((question, index) => {
                        if (index === 1 || index === 2) {
                            return (
                                <div key={question.id} className={`flex justify-between ${index % 2 === 0 ? 'bg-slate-200' : ''}`}>
                                    <div>{question.question.question}</div>
                                    <div className="font-semibold">{question.answer}</div>
                                </div>
                            )
                        }
                    })
                }
                {
                    name === 'Sleep Disturbance' &&
                    <div className="flex justify-end mb-3 w-full text-xl">
                        <p className="mr-4"><span className="font-semibold">Never &#40;1&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Rarely &#40;2&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Sometimes &#40;3&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Often &#40;4&#41;</span></p>
                        <p className=""><span className="font-semibold">Always &#40;5&#41;</span></p>
                    </div>
                }
                {
                    name === 'Sleep Disturbance' &&
                    clientAssessment.map((question, index) => {
                        if (index === 4 || index === 5) {
                            return (
                                <div key={question.id} className={`flex justify-between ${index % 2 === 0 ? 'bg-slate-200' : ''}`}>
                                    <div>{question.question.question}</div>
                                    <div className="font-semibold">{question.answer}</div>
                                </div>
                            )
                        }
                    })
                }
                {
                    name === 'Sleep Disturbance' &&
                    <div className="flex justify-end mb-3 w-full text-xl">
                        <p className="mr-4"><span className="font-semibold">Never &#40;5&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Rarely &#40;4&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Sometimes &#40;3&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Often &#40;2&#41;</span></p>
                        <p className=""><span className="font-semibold">Always &#40;1&#41;</span></p>
                    </div>
                }
                {
                    name === 'Sleep Disturbance' &&
                    clientAssessment.map((question, index) => {
                        if (index === 6) {
                            return (
                                <div key={question.id} className={`flex justify-between ${index % 2 === 0 ? 'bg-slate-200' : ''}`}>
                                    <div>{question.question.question}</div>
                                    <div className="font-semibold">{question.answer}</div>
                                </div>
                            )
                        }
                    })
                }
                {
                    name === 'Sleep Disturbance' &&
                        <div className="flex justify-end mb-3 w-full text-xl">
                        <p className="mr-4"><span className="font-semibold">Very poor &#40;5&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Poor &#40;4&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Fair &#40;3&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Good &#40;2&#41;</span></p>
                        <p className=""><span className="font-semibold">Very good &#40;1&#41;</span></p>
                    </div>
                }
                {
                    name === 'Sleep Disturbance' &&
                    clientAssessment.map((question, index) => {
                        if (index === 7) {
                            return (
                                <div key={question.id} className={`flex justify-between ${index % 2 === 0 ? 'bg-slate-200' : ''}`}>
                                    <div>{question.question.question}</div>
                                    <div className="font-semibold">{question.answer}</div>
                                </div>
                            )
                        }
                    })
                }
                {
                    name === 'Somatic Symptom' &&
                    <div className="flex justify-start mb-3 text-lg">
                        <p className="mr-4"><span className="font-semibold">Not bothered at all &#40;0&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Bothered a little &#40;1&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Bothered a lot &#40;2&#41;</span></p>
                    </div>
                }
                {
                    name === 'Substance Use' &&
                    <div className="flex justify-start mb-3 text-lg">
                        <p className="mr-4"><span className="font-semibold">None at all &#40;0&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">One or 2 days &#40;1&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">Several days &#40;2&#41;</span></p>
                        <p className="mr-4"><span className="font-semibold">More than half the days &#40;3&#41;</span></p>
                        <p className=""><span className="font-semibold">Nearly every day &#40;4&#41;</span></p>
                    </div>
                }
                {
                    (name !== 'Sleep Disturbance' && name !== 'Mania') &&
                    clientAssessment.map((question, index) => (
                        <div key={question.id} className={`flex justify-between ${name === 'DSM-5 Self Rated' ? 'text-base' : ''} ${index % 2 === 0 ? 'bg-slate-200' : ''}`}>
                            <div>{question.question.question}</div>
                            <div className="font-semibold">{question.answer}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default AssessmentViewModal;