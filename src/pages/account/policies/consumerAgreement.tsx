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

const ConsumerAgreementConsent: React.FC<Props> = () => {
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
    const policy = policyQuery.data?.find(p => p.title === 'Consumer Agreement');
    const accountPolicies = accountPolicyQuery.data;
    const consumerAgreementPolicy = accountPolicies.find((p) => p.policyId === policy?.id);

    if (consumerAgreementPolicy?.signed === true)
        router.push('/account/policies/clientRights').catch((err) => console.error(err));

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
        
        router.push('/account/policies/clientRights').catch((err) => console.error(err));
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100">
            <h1 className="text-4xl font-thin my-10">CONSUMER AGREEMENT</h1>
            <div className="text-lg w-3/4 text-start border border-indigo-700 rounded-sm p-8 shadow-xl shadow-purple-900 mb-6 bg-slate-200 text-slate-700">
                <p>We believe that accountability is the key to personal empowerment.  In accordance with that premise, we expect the client to abide by the following rules and regulations. Failure to follow these rules and regulations may result in termination from the program.</p>
                <br />
                <ul className="list-disc pl-8">
                    <li>You are responsible to provide any and all necessary information from any Court or third-party organization that is required for you to receive an accurate certificate of completion. Affiliated Court Services will not be held responsible if the certificate of completion is not correct due to you not submitting all necessary information.</li>
                    <li>Participants will be required to attend orientation workshop prior to beginning treatment.</li>
                    <li>Participants will be on time for all sessions.  The meeting will be closed after 5 minutes, and no further admittance will be allowed for that session.</li>
                    <li>Groups and individual sessions are 50 minutes in length.  Leaving the group before the session ends will constitute an absence.  Payment for that session will be forfeited.</li>
                    <li>Workshops are typically 4 hours in length with a break in the middle. Leaving the workshop before the session ends will constitute an absence. Payment for that workshop will be forfeited.</li>
                    <li>Prime For Life is a total of 16 hours that can be broken down into sessions of various lengths agreed upon between the Consumer and United Court Services. Leaving the group before the session ends will constitute an absence. Payment for that session will be forfeited.</li>
                    <li>We will abide by Utah and City smoking regulations in accordance with the Utah Clean Air Act, Title 26, Chapter 18, Section 3.  In short, smoking is not allowed inside the building or within 25 feet of the building.</li>
                    <li>Physical or verbal abuse toward group leaders, staff, or other clients will not be tolerated.  This includes discriminatory language regarding any specific population.</li>
                    <li>Participants will not access services while under the influence of alcohol or illicit substances.</li>
                    <li>Participants will not access services while in possession of dangerous weapons.</li>
                    <li>Information discussed during group sessions is to remain confidential.</li>
                    <li>Any behaviors listed above, or deemed inappropriate by therapists or staff, may result in immediate dismissal from sessions, suspension from the program, or termination from the program and court officials will be notified of noncompliance.  Violators will only be allowed to return to the program when approved by the Clinical Director and their Court Agent, if applicable.</li>
                </ul>
                <br />
                <p>By signing below, I agree to abide by the above rules and regulations.</p>
            </div>
            <div className="flex flex-col items-center justify-center mb-6">
                {
                    !showSignature &&
                    <button className="rounded border border-slate-200 px-3 py-1 text-slate-200 mr-12 hover:scale-110 hover:shadow-lg  hover:shadow-purple-900 hover:opacity-70" onClick={handleSign}>Click to sign</button>
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
                <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">Your signature needs to be added and be big enough to save.</div>
            }
            {
                showSaveErrorAlert &&
                <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">There was an error saving your signature. Please try again.</div>
            }
        </div>
    );
}

export default ConsumerAgreementConsent;