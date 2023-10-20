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

const MeetingEtiquetteConsent: React.FC<Props> = () => {
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
    const policy = policyQuery.data?.find(p => p.title === 'Meeting Etiquette Agreement');
    const accountPolicies = accountPolicyQuery.data;
    const meetingEtiquettePolicy = accountPolicies.find((p) => p.policyId === policy?.id);

    if (meetingEtiquettePolicy?.signed === true)
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

        router.push('/account/policies/demographic').catch((err) => console.error(err));
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 pb-8">
            <h1 className="text-4xl font-thin my-10">ONLINE ETIQUETTE</h1>
            <div className="text-lg w-3/4 text-start border border-indigo-700 rounded-sm p-8 shadow-xl shadow-purple-900 mb-12 bg-slate-200 text-slate-700">
                <p>You are required to adhere to the following Online Etiquette rules during any treatment session. Failure to adhere to these rules will result in your expulsion from the treatment session and may prevent you from further treatment sessions.</p>
                <ul className="list-disc pl-8">
                    <li>Keep in mind that groups are moderated by the Therapist and are not an open forum.</li>
                    <li>Keep your microphone muted unless addressing the group.</li>
                    <li>Use a raised hand icon to indicate your desire to comment or ask a question and wait for the therapist to invite you to speak.</li>
                    <li>Dress appropriately as if you were in an in-person session and be aware of what your camera is showing in the background.</li>
                    <li>Use the chat feature only to address the Therapist or the whole group.  Do not send personal chats to individual group members.</li>
                    <li>Keep your camera on and show your face during the entire session.</li>
                    <li>Schedule your time in a manner that is appropriate for group sessions.  Do not attend group sessions while working, driving, or performing other activities that are not group related.</li>
                    <li>Respect the confidentiality of all group members.  Find a private area to participate in and do not allow others to see or hear what occurs in group sessions.</li>
                </ul>
                <br />
                <p>By signing this Online Etiquette form below, I agree to follow the rules listed above.</p>
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
                            <div className="inline">Signed:&nbsp;&nbsp;&nbsp;<img alt="Signature" src={accountSignature?.signature} className="inline" /></div>
                        }
                    </div>
                }
            </div>
            <div>
                <button className="rounded border border-slate-200 px-3 py-1 text-slate-200 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70 text-2xl" onClick={handleNext}>Next</button>
            </div>
            { 
                showErrorAlert &&
                <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">Your signature needs to be added and be big enough to save.</div>
            }
            {
                showSaveErrorAlert &&
                <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">There was an error saving your signature. Please try again.</div>
            }
        </div>
    );
}

export default MeetingEtiquetteConsent;