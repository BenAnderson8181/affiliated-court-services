import { useState } from "react";
import { api } from "~/utils/api";

type Props = {
    accountId: string;
    externalId: string;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    refetchNextStep: () => void;
}

const IncidentReportRequireModal = ({ accountId, externalId, onClose, refetchNextStep}: Props) => {
    const [showError, setShowError] = useState(false);
    
    const requireIncidentMutation = api.requireIncident.create.useMutation();

    const handleRequireIncident = async () => {
        const requireIncident = await requireIncidentMutation.mutateAsync({
            clientId: accountId,
            clinicianExternalId: externalId
        })
        .catch((err) => {
            console.error(err);
            setShowError(true);
            return;
        })

        if (requireIncident) {
            onClose(false);
            refetchNextStep();
        }
    }

    return (
        <div className="h-fit w-full text-2xl">
            <div className="flex flex-row justify-center mb-2 text-3xl py-2 bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 w-full rounded-t-md">Require Incident Report</div>
            <p className="p-3">Would you like to require this client to make another incident report?</p>
            <div className="p-3 flex justify-end">
                <button className="bg-slate-100 text-slate-700 border border-indigo-700 rounded-md shadow-sm shadow-purple-900 p-2 mt-4 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70" onClick={handleRequireIncident}>Require incident</button>
            </div>
            {
                showError &&
                <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Something went wrong adding a required incident report.  Please try again or contact IT.</div>
            }
        </div>
    )
}

export default IncidentReportRequireModal;