import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useState } from "react";
import type { ReactNode } from "react";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";
import LoadError from "~/components/LoadError";

type Props = {
    children?: ReactNode;
}

const DemographicQuestionnaire: React.FC<Props> = () => {
    const { user } = useUser();
    const router = useRouter();
    const [showSaveErrorAlert, setShowSaveErrorAlert] = useState(false);
    const [demographic, setDemographic] = useState('');
    const [showDemographicError, setShowDemographicError] = useState(false);

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        router.push('/').catch((err) => console.error(err));

    const accountQuery = api.account.findAccountByExternalId.useQuery({ externalId: userId });
    const policyQuery = api.policy.list.useQuery();
    const accountPolicyQuery = api.accountPolicy.list.useQuery({ externalId: userId });
    const accountPolicyMutation = api.accountPolicy.upsert.useMutation();
    const demographicMutation = api.demographic.update.useMutation();

    if (accountQuery.isLoading || policyQuery.isLoading || accountPolicyQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (accountQuery.isError || policyQuery.isError || accountPolicyQuery.isError) {
        return <LoadError type='Page' />
    }

    const account = accountQuery.data;
    const policy = policyQuery.data?.find(p => p.title === 'Demographic');
    const accountPolicies = accountPolicyQuery.data;
    const demographicPolicy = accountPolicies.find((p) => p.policyId === policy?.id);

    if (demographicPolicy?.signed === true)
        router.push(`/account/${account?.id}`).catch((err) => console.error(err));

    const handleNext = async () => {
        const demogrpahicResult = await demographicMutation.mutateAsync({
            demographic
        })
        .catch((err) => {
            console.error(err);
            setShowDemographicError(true);
        });

        if (!demogrpahicResult)
            return;

        if (!account?.id) return;
        if (!policy?.id) return;
        const result = await accountPolicyMutation.mutateAsync({
            accountId: account?.id,
            policyId: policy?.id,
            signed: true,
        })
        .catch((err) => {
            setShowSaveErrorAlert(true);
            console.error('error: ', err);
        });

        if (!result) {
            setShowSaveErrorAlert(true);
            return;
        }
        
        router.push(`/account/${account?.id}`).catch((err) => console.error(err));
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100">
            <h1 className="text-4xl font-thin my-10">DEMOGRAPHIC QUESTIONNAIRE</h1>
            <div className="text-lg w-3/4 text-start border border-indigo-700 rounded-sm p-8 shadow-xl shadow-purple-900 mb-6 bg-slate-200 text-slate-700">
                <p>What is your race/ethnicity? Please select the option that best describes you:</p>
                <br />
                <div className="pl-8">
                    <div className="flex justify-start">
                        <input className="peer" type="radio" name="demographic" id="native" value="1" onChange={() => setDemographic(() => 'native')} />
                        <label className="flex justify-center cursor-pointer rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100 px-6" htmlFor="native">
                            American Indian or Alaska Native
                        </label>
                    </div>
                    <div className="flex justify-start">
                        <input className="peer" type="radio" name="demographic" id="asian" value="2" onChange={() => setDemographic(() => 'asian')} />
                        <label className="flex justify-center cursor-pointer rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100 px-6" htmlFor="asian">
                            Asian
                        </label>
                    </div>
                    <div className="flex justify-start">
                        <input className="peer" type="radio" name="demographic" id="black" value="3" onChange={() => setDemographic(() => 'black')} />
                        <label className="flex justify-center cursor-pointer rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100 px-6" htmlFor="black">
                            Black or African American
                        </label>
                    </div>
                    <div className="flex justify-start">
                        <input className="peer" type="radio" name="demographic" id="hispanic" value="4" onChange={() => setDemographic(() => 'hispanic')} />
                        <label className="flex justify-center cursor-pointer rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100 px-6" htmlFor="hispanic">
                            Hispanic or Latino
                        </label>
                    </div>
                    <div className="flex justify-start">
                        <input className="peer" type="radio" name="demographic" id="islander" value="5" onChange={() => setDemographic(() => 'islander')} />
                        <label className="flex justify-center cursor-pointer rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100 px-6" htmlFor="islander">
                            Native Hawaiian or Other Pacific Islander
                        </label>
                    </div>
                    <div className="flex justify-start">
                        <input className="peer" type="radio" name="demographic" id="white" value="6" onChange={() => setDemographic(() => 'white')} />
                        <label className="flex justify-center cursor-pointer rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100 px-6" htmlFor="white">
                            White
                        </label>
                    </div>
                    <div className="flex justify-start">
                        <input className="peer" type="radio" name="demographic" id="multi" value="7" onChange={() => setDemographic(() => 'multi')} />
                        <label className="flex justify-center cursor-pointer rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100 px-6" htmlFor="multi">
                            Two or more races
                        </label>
                    </div>
                    <div className="flex justify-start">
                        <input className="peer" type="radio" name="demographic" id="other" value="9" onChange={() => setDemographic(() => 'other')} />
                        <label className="flex justify-center cursor-pointer rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100 px-6" htmlFor="other">
                            Other
                        </label>
                    </div>
                    <div className="flex justify-start">
                        <input className="peer" type="radio" name="demographic" id="not" value="8" onChange={() => setDemographic(() => 'not')} defaultChecked={true} />
                        <label className="flex justify-center cursor-pointer rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100 px-6" htmlFor="not">
                            Prefer not to say
                        </label>
                    </div>
                </div>
                <br />
                <p>Your response to the question regarding race/ethnicity is voluntary and will be treated as confidential. This information is being collected solely for the purpose of research and/or meeting government reporting requirements. Providing this information will in no way affect your treatment plan.  The data collected will be used in the aggregate and will not be individually identifiable. Thank you for your cooperation.</p>
            </div>
            <div>
                <button className="rounded border border-slate-200 px-3 py-1 text-slate-200 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70 text-2xl mb-5" onClick={handleNext}>Next</button>
            </div>
            {
                showSaveErrorAlert &&
                <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">There was an error saving your signature. Please try again.</div>
            }
            {
                showDemographicError &&
                <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">There was an error saving the demographic data. Please try again.</div>
            }
        </div>
    );
}

export default DemographicQuestionnaire;