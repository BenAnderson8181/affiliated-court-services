import { useState } from "react";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

type Props = {
    accountId: string;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    refetchNextStep: () => void;
}

const GoalRequireModal = ({ accountId, onClose, refetchNextStep}: Props) => {
    const [showError, setShowError] = useState(false);
    const [showGoalId, setShowSetGoalId] = useState(false);
    const [goalId, setGoalId] = useState('');

    const goalsQuery = api.goal.list.useQuery();
    const requireGoalMutation = api.requiredGoal.create.useMutation();

    if (goalsQuery.isLoading) {
        return <Loading type='Modal' />
    }

    if (goalsQuery.isError) {
        return <LoadError type='Modal' />
    }

    const goals = goalsQuery.data;

    const handleRequireGoal = async () => {
        if (goalId === "-1" || goalId.length === 0) {
            setShowSetGoalId(true);
            return;
        }

        const requireGoal = await requireGoalMutation.mutateAsync({
            clientId: accountId,
            goalId: goalId
        })
        .catch((err) => {
            console.error(err);
            setShowError(true);
        })

        if (requireGoal) {
            onClose(false);
            refetchNextStep();
        }
    }

    return (
        <div className="h-fit w-full text-2xl">
            <div className="flex flex-row justify-center mb-2 text-3xl py-2 bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 w-full rounded-t-md">Require Goal</div>
            <p className="p-3">Select a goal you would like to have this client fill out.</p>
            <select className="border-2 border-slate-700 rounded-md ml-3" onChange={(e) => setGoalId(() => e.target.value)}>
                <option value="-1">-- Please select a goal --</option>
                {
                    goals.map((item) => {
                        return <option value={item.id} key={item.id}>{item.name}</option>
                    })
                }
            </select>
            <div className="p-3 flex justify-end">
                <button className="bg-slate-100 text-slate-700 border border-indigo-700 rounded-md shadow-sm shadow-purple-900 p-2 mt-4 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70" onClick={handleRequireGoal}>Add goal sheet</button>
            </div>
            {
                showError &&
                <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Something went wrong adding a required goal.  Please try again or contact IT.</div>
            }
            {
                showGoalId &&
                <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Please select a goal.</div>
            }
        </div>
    )
}

export default GoalRequireModal; 