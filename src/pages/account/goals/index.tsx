import { useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

const Goal: NextPage = () => {
    const router = useRouter();
    const { user } = useUser();
    const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        router.push('/').catch((err) => console.error(err));

    const requiredGoalsQuery = api.requiredGoal.list.useQuery({ externalId: userId });
    const accountQuery = api.account.findAccountByExternalId.useQuery({ externalId: userId! });

    if (requiredGoalsQuery.isLoading || accountQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (requiredGoalsQuery.isError || accountQuery.isError) {
        return <LoadError type='Page' />
    }
    
    const requiredGoals = requiredGoalsQuery.data;
    const account = accountQuery.data;

    if (!requiredGoals || requiredGoals.length === 0) {
        setShowErrorAlert(true);
        console.error('error: ', requiredGoalsQuery.error);
        router.push(`/account/${account.id}`).catch((err) => console.error(err));
    }

    // const firstUnfinishedGoal = requiredGoals.find(a => !a.completed);
    // if (firstUnfinishedGoal) {
    //     router.push(`/account/goals/${firstUnfinishedGoal.goal.url}`).catch((err) => console.error(err));
    // }
    // else {
    router.push(`/account/${account.id}`).catch((err) => console.error(err));
    // }
       
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100">
            Finding Required Goals...
            { showErrorAlert &&
                <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">Something went wrong setting your goals.  Please contact our office at 8018881234 for assistance</div>
            }
        </div>
    );
}

export default Goal;