import { useState } from "react";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

type Props = {
    accountId: string;
    externalId: string;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    refetchNextStep: () => void;
}

const AssessmentRequireModal = ({ accountId, onClose, refetchNextStep}: Props) => {
    const [showError, setShowError] = useState(false);
    const [showAssessmentId, setShowSetAssessmentId] = useState(false);
    const [assessmentId, setAssessmentId] = useState('');

    const assessmentsQuery = api.assessment.list.useQuery();
    const requireAssessmentMutation = api.requiredAssessments.create.useMutation();

    if (assessmentsQuery.isLoading) {
        return <Loading type='Modal' />
    }

    if (assessmentsQuery.isError) {
        return <LoadError type='Modal' />
    }

    const assessments = assessmentsQuery.data;

    const handleRequireAssessment = async () => {
        if (assessmentId === "-1" || assessmentId.length === 0) {
            setShowSetAssessmentId(true);
            return;
        }

        const requireAssessment = await requireAssessmentMutation.mutateAsync({
            clientId: accountId,
            assessmentId
        })
        .catch((err) => {
            console.error(err);
            setShowError(true);
        })

        if (requireAssessment) {
            onClose(false);
            refetchNextStep();
        }
    }

    return (
        <div className="h-fit w-full text-2xl">
            <div className="flex flex-row justify-center mb-2 text-3xl py-2 bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 w-full rounded-t-md">Require Assessment</div>
            <p className="p-3">Select an assessment you would like to have this client fill out.</p>
            <select className="border-2 border-slate-700 rounded-md ml-3" onChange={(e) => setAssessmentId(() => e.target.value)}>
                <option value="-1">-- Please select an assessment --</option>
                {
                    assessments.map((item) => {
                        return <option value={item.id} key={item.id}>{item.name}</option>
                    })
                }
            </select>
            <div className="p-3 flex justify-end">
                <button className="bg-slate-100 text-slate-700 border border-indigo-700 rounded-md shadow-sm shadow-purple-900 p-2 mt-4 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70" onClick={handleRequireAssessment}>Require assessment</button>
            </div>
            {
                showError &&
                <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Something went wrong adding a required assessment.  Please try again or contact IT.</div>
            }
            {
                showAssessmentId &&
                <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Please select an assessment.</div>
            }
        </div>
    )
}

export default AssessmentRequireModal; 