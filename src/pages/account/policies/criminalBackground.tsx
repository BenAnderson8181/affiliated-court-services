import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import React, { useState } from "react";
import type { ReactNode } from "react";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";
import LoadError from "~/components/LoadError";

type Props = {
    children?: ReactNode
}

const CriminalBackground: React.FC<Props> = () => {
    const { user } = useUser();
    const router = useRouter();
    const [showSignature, setShowSignature] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSaveErrorAlert, setShowSaveErrorAlert] = useState(false);
    const [showRejectError, setShowRejectError] = useState(false);

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        router.push('/').catch((err) => console.error(err));

    const accountQuery = api.account.findAccountByExternalId.useQuery({ externalId: userId });
    const accountSignatureQuery = api.accountSignature.load.useQuery({ externalId: userId });
    const policyQuery = api.policy.list.useQuery();
    const accountPolicyQuery = api.accountPolicy.list.useQuery({ externalId: userId });
    const incidentQuery = api.incident.getLatest.useQuery({ externalId: userId });
    const accountPolicyMutation = api.accountPolicy.upsert.useMutation();

    if (accountQuery.isLoading || accountSignatureQuery.isLoading || policyQuery.isLoading || accountPolicyQuery.isLoading || incidentQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (accountQuery.isError || accountSignatureQuery.isError || policyQuery.isError || accountPolicyQuery.isError || incidentQuery.isError) {
        return <LoadError type='Page' />
    }

    const account = accountQuery.data;
    const accountName = `${account.firstName} ${account.lastName}`;
    const accountSignature = accountSignatureQuery.data;
    const policy = policyQuery.data?.find(p => p.title === 'Criminal Background');
    const accountPolicies = accountPolicyQuery.data;
    const criminalBackgroundPolicy = accountPolicies.find((p) => p.policyId === policy?.id);
    const incident = incidentQuery.data;
    const consentType = incident.incidentType.name;

    if (criminalBackgroundPolicy?.signed === true)
        router.push('/account/policies/demographic').catch((err) => console.error(err));

    const handleSign = () => {
        setShowSignature(true);
    }

    const handleNext = async () => {
        // check if the signature is showing
        if(!showSignature) {
            setShowErrorAlert(true);
            return;
        }

        setShowErrorAlert(false);

        // save the signature
        if (!policy?.id) return;

        const result = await accountPolicyMutation.mutateAsync({
            accountId: account.id,
            policyId: policy?.id,
            signed: true,
        })
        .catch((err) => {
            setShowSaveErrorAlert(true);
            console.error('error: ', err);
        });

        if (!result) {
            setShowErrorAlert(true);
            return;
        }

        router.push(`/account/${account?.id}`).catch((err) => console.error(err));
    }

    const handleReject  = async () => {
        if (!policy?.id) return;

        const result = await accountPolicyMutation.mutateAsync({
            accountId: account?.id,
            policyId: policy?.id,
            signed: false,
            rejected: true
        })
        .catch((err) => {
            setShowRejectError(true);
            console.error('error: ', err);
        });

        if (!result) {
            setShowRejectError(true);
            return;
        }

        router.push(`/account/${account?.id}`).catch((err) => console.error(err));
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 pb-8">
            <h1 className="text-4xl font-thin my-10">CONSENT TO CRIMINAL BACKGROUND CHECK</h1>
            <div className="text-lg w-3/4 text-start border border-indigo-700 rounded-sm p-8 shadow-xl shadow-purple-900 mb-12 bg-slate-200 text-slate-700 relative">
                <br />
                <p>I, {accountName}, hereby give my consent for Affiliated Court Services to conduct a criminal background check as part of the {consentType.toLowerCase()} therapy process. I understand that this check may include, but is not limited to, the following:</p>
                <br />
                <ul className="list-decimal pl-8">
                    <li>Verification of my identity through personal information provided, such as my full name, date of birth, and Social Security number.</li>
                    <li>Search for any criminal records at the federal, state, or local level, including records related to arrests, convictions, pending cases, and sex offender registries.</li>
                    <li>Review of public records, databases, and other resources to gather information relevant to the background check.</li>
                </ul>
                <br />
                <p>I authorize Affiliated Court Services to collect and use this information solely for the purpose of evaluating my suitability for {consentType.toLowerCase()} therapy. I understand that the information obtained from the background check will be kept confidential and will only be shared with authorized individuals involved in the therapy process.</p>
                <br />
                <p>I acknowledge that my consent is voluntary and that I may withdraw it at any time by providing written notice to Affiliated Court Services. However, I understand that such withdrawal may have consequences for the {consentType.toLowerCase()} therapy process, and I will discuss any concerns or potential impacts with my legal counsel or the court.</p>
                <br />
                <p>I release Affiliated Court Services, its employees, agents, and any third-party service providers engaged in conducting the background check from any liability arising from the use or disclosure of the information obtained, except to the extent prohibited by law.</p>
                <br />
                <p>I declare that all the information provided in relation to the {consentType.toLowerCase()} therapy process is accurate and truthful to the best of my knowledge. I understand that any misrepresentation or omission may have consequences for the therapy process as determined by the court or other referring agency.</p>
                <br />
                <p>By signing below, I acknowledge that I have read, understood, and voluntarily consent to the terms outlined in this form.</p>
            </div>
            <div className="flex flex-col items-center justify-center mb-6">
                {
                    !showSignature &&
                    <div>
                        <button className="rounded border border-slate-200 px-3 py-1 text-slate-200 mr-12 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70" onClick={handleSign}>Click to sign</button>
                        <button className="rounded border border-slate-200 px-3 py-1 text-slate-200 mx-12 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70" onClick={handleReject}>Click to reject</button>
                    </div>
                }
                {
                    showSignature &&
                    <div className="mb-6 inline">
                        {accountSignature?.signature &&
                            <div className="inline">Signed:&nbsp;&nbsp;&nbsp;<img alt="Signature" src={accountSignature?.signature} className="inline" /></div>
                        }
                    </div>
                }
            </div>
            <div>
                <button className="rounded border border-slate-200 px-3 py-1 text-slate-200 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70 text-2xl mb-5 mr-14" onClick={handleNext}>Next</button>
            </div>
            { 
                showErrorAlert &&
                <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">Your signature needs to be added before moving forward.</div>
            }
            {
                showSaveErrorAlert &&
                <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">There was an error saving your signature. Please try again.</div>
            }
             {
                showRejectError &&
                <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">There was an error saving the rejection of this consent to criminal background. Please try again.</div>
            }
        </div>
    );
}

export default CriminalBackground;