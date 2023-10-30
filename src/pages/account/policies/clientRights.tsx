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

const ClientRightsConsent: React.FC<Props> = () => {
    const { user } = useUser();
    const router = useRouter();
    const [showSignature, setShowSignature] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSaveErrorAlert, setShowSaveErrorAlert] = useState(false);

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        router.push('/').catch((err) => console.error(err));

    const accountQuery = api.account.findAccountByExternalId.useQuery({ externalId: userId });
    const accountSignatureQuery = api.accountSignature.load.useQuery({ externalId: userId });
    const policyQuery = api.policy.list.useQuery();
    const accountPolicyQuery = api.accountPolicy.list.useQuery({ externalId: userId });
    const accountPolicyMutation = api.accountPolicy.upsert.useMutation();

    if (accountQuery.isLoading || accountSignatureQuery.isLoading || policyQuery.isLoading || accountPolicyQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (accountQuery.isError || accountSignatureQuery.isError || policyQuery.isError || accountPolicyQuery.isError) {
        return <LoadError type='Page' />
    }

    const account = accountQuery.data;
    const accountSignature = accountSignatureQuery.data;
    const policy = policyQuery.data?.find(p => p.title === 'Client Rights');
    const accountPolicies = accountPolicyQuery.data;
    const clientRightsPolicy = accountPolicies.find((p) => p.policyId === policy?.id);

    if (clientRightsPolicy?.signed === true)
        router.push('/account/policies/informedConsent').catch((err) => console.error(err));

    const handleSign = () => {
        setShowSignature(true);
    }
    
    const handleNext = async () => {
        // check if the signature is showing
        if(!showSignature) {
            setShowErrorAlert(true);
            return;
        }

        // save the signature
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
            setShowErrorAlert(true);
            return;
        }
        
        router.push('/account/policies/informedConsent').catch((err) => console.error(err));
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100">
            <h1 className="text-4xl font-thin my-10">CLIENT RIGHTS</h1>
            <div className="text-lg w-3/4 text-start border border-indigo-700 rounded-sm p-8 shadow-xl shadow-purple-900 mb-12 bg-slate-200 text-slate-700">
                <p>Our accountability to you:</p>
                <br />
                <ul className="list-disc pl-8">
                    <li>
                        You have the right to privacy regarding your participation in this program, with the following exceptions according to Utah State Law:
                        <ul className="pl-6 list-none">
                            <li>∘&nbsp;If we become aware of abuse to children or vulnerable adults, or imminent danger of harming yourself or another person, we are required to report abuse and take reasonable steps to prevent harm.</li>
                            <li>∘&nbsp;Any and all other situations required to be reported by law in the State of Utah.</li>
                        </ul>
                    </li>
                    <li>You have the right to freedom from potential harm or acts of violence toward you or other participants.</li>
                    <li>You have the right to freedom from discrimination while in our offices and treatment sessions.</li>
                    <li>You have the right to be treated with dignity and respect by our staff members or other group participants.</li>
                    <li>You have the right to know what the client&rsquo;s responsibilities, tasks, and rules of conduct are.</li>
                    <li>You have the right to know what the fees are for each service provided while in treatment in this program.</li>
                    <li>You have the right to know the possible sanctions and consequences for misconduct while participating in this program.</li>
                    <li>You have the right to know the reasons for involuntary termination, and the criteria for re-admission to the program.</li>
                    <li>You have the right to know the grievance and complaint process.</li>
                </ul>
                <br />
                <p>By signing below, I verify that I understand these rights.</p>
            </div>
            <div className="flex flex-col items-center justify-center mb-6">
                {
                    !showSignature &&
                    <button className="rounded border border-slate-200 px-3 py-1 text-slate-200 mr-12 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70" onClick={handleSign}>Click to sign</button>
                }
                {
                    showSignature &&
                    <div className="mb-6 inline">
                        {accountSignature?.signature && 
                            <div className="inline">Signed:&nbsp;&nbsp;&nbsp;<img alt="Signature" src={accountSignature?.signature} className="inline"/></div>
                        }
                    </div>
                }
            </div>
            <div>
                <button className="rounded border border-slate-200 px-3 py-1 text-slate-200 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70 text-2xl mb-5" onClick={handleNext}>Next</button>
            </div>
            { 
                showErrorAlert &&
                <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">Your signature needs to be added before moving forward.</div>
            }
            {
                showSaveErrorAlert &&
                <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">There was an error saving your signature. Please try again or contact our office.</div>
            }
        </div>
    );
}

export default ClientRightsConsent;