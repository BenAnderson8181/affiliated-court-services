import { api } from "~/utils/api";
import { useState } from "react";
import Loading from "~/components/Loading";
import LoadError from "~/components/LoadError";

type Props = {
    accountId: string;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onRefresh: () => void;
}

const ClientAlertModal = ({ accountId, onClose, onRefresh}: Props) => {
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [alert, setAlert] = useState('');

    const clientAlertQuery = api.clientAlert.get.useQuery({ accountId });
    const clientAlertMutation = api.clientAlert.upsert.useMutation();

    if (clientAlertQuery.isLoading) {
        <Loading type="Modal" />
    }

    if (clientAlertQuery.isError) {
        <LoadError type="Modal" />
    }

    const clientAlert = clientAlertQuery.data;

    const onSave = async () => {
        const result = await clientAlertMutation.mutateAsync({
            id: clientAlert?.id ?? undefined,
            accountId,
            alert
        })
        .catch((err) => {
            setShowErrorAlert(true);
            console.error(err);
            return;
        });

        if (result) {
            onRefresh();
            onClose(false);
        }
    }

    const onCancel = () => {
        onClose(false);
    }

    return (
        <div className="h-full w-full p-0 flex flex-col">
            <div>
                <p className="flex flex-row justify-center text-3xl py-2 bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 w-full rounded-t-md">Client Alert</p>
                <br />
                <textarea 
                    className="border border-indigo-950 rounded-md shadow-indigo-950 shadow-md p-3 w-11/12 h-36 flex mx-auto" 
                    defaultValue={clientAlert?.alert} 
                    onChange={(e) => setAlert(e.target.value)}
                />
            </div>
            <div className="p-3 flex justify-end">
                <button className="bg-slate-100 text-slate-700 border border-indigo-700 rounded-md shadow-sm shadow-purple-900 p-2 mt-4 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70 mr-4" onClick={onSave}>Save</button>
                <button className="bg-slate-100 text-red-700 border border-red-700 rounded-md shadow-sm shadow-purple-900 p-2 mt-4 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70" onClick={onCancel}>Cancel</button>
            </div>
            {
                showErrorAlert &&
                <div className="border border-orange-500 round mt-4 p-3 text-slate-700 text-2xl">Something went wrong saving the client alert.  Please try again or contact IT.</div>
            }
        </div>
    )
}

export default ClientAlertModal;