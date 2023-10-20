import { useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

const Assessment: NextPage = () => {
    const router = useRouter();
    const { user } = useUser();
    const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);

    const userId = user?.id;
    if (!userId || userId === '' || userId === undefined)
        router.push('/').catch((err) => console.error(err));

    const requiredAssessmentsQuery = api.requiredAssessments.list.useQuery({ externalId: userId! });
    const accountQuery = api.account.findAccountByExternalId.useQuery({ externalId: userId! });

    if (requiredAssessmentsQuery.isLoading || accountQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (requiredAssessmentsQuery.isError || accountQuery.isError) {
        return <LoadError type='Page' />
    }
    
    const requiredAssessments = requiredAssessmentsQuery.data;
    const account = accountQuery.data;

    if (!requiredAssessments || requiredAssessments.length === 0) {
        setShowErrorAlert(true);
        console.error('error: ', requiredAssessmentsQuery.error);
        router.push(`/account/${account.id}`).catch((err) => console.error(err));
    }

    const firstUnfinishedAssessment = requiredAssessments.find(a => !a.completed);
    if (firstUnfinishedAssessment) {
        router.push(`/account/assessments/${firstUnfinishedAssessment.assessment.url}`).catch((err) => console.error(err));
    }
    else {
        router.push(`/account/${account.id}`).catch((err) => console.error(err));
    }
       
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100">
            Finding Required Assessments...
            { showErrorAlert &&
                <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">Something went wrong setting your assessments.  Please contact our office at 8018881234 for assistance</div>
            }
        </div>
    );
}

export default Assessment;