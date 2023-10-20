import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { api } from "~/utils/api"

type Props = {
    id: string
}

const IncidentReportViewModal = ({ id }: Props) => {
    const incidentQuery = api.incident.get.useQuery({ id });

    if (incidentQuery.isLoading) {
        return <Loading type='Modal' />
    }

    if (incidentQuery.isError) {
        return <LoadError type='Modal' />
    }

    const incident = incidentQuery.data;

    return (
        <div className="h-fit min-h-96 w-full">
            <div className="flex flex-row justify-center mb-2 text-3xl py-2 bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 w-full rounded-t-md">{incident.incidentType.name}</div>
            <div className="text-2xl p-2">{incident.comment}</div>
        </div>
    )
}

export default IncidentReportViewModal;