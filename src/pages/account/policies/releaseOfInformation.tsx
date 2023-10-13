import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import React, { useState } from "react";
import type { ReactNode } from "react";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";
import LoadError from "~/components/LoadError";
import { formatPhone } from "~/utils";

type Props = {
    children?: ReactNode
}

const ReleaseOfInformationConsent: React.FC<Props> = () => {
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
    const accountPolicyMutation = api.accountPolicy.upsert.useMutation();

    if (accountQuery.isLoading || accountSignatureQuery.isLoading || policyQuery.isLoading || accountPolicyQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (accountQuery.isError || accountSignatureQuery.isError || policyQuery.isError || accountPolicyQuery.isError) {
        return <LoadError type="Page" />;
    }

    const account = accountQuery.data;
    const accountSignature = accountSignatureQuery.data;
    const policy = policyQuery.data?.find(p => p.title === 'Release of Information');
    // const accountPolicies = accountPolicyQuery.data;
    // const releaseOfInformationPolicy = accountPolicies.find((p) => p.policyId === policy?.id);



    // if (releaseOfInformationPolicy?.signed === true)
    //     router.push('/account/policies/paymentAgreement').catch((err) => console.error(err));

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
            signed: true
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

    const handleReject = async () => {
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
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100">
            <h1 className="text-2xl font-thin my-10">AUTHORIZATION FOR THE RELEASE OF PROTECTED HEALTH INFORMATION (PHI)</h1>
            <div className="text-lg w-3/4 text-start border border-indigo-700 rounded-sm p-8 shadow-xl shadow-purple-900 mb-12 bg-slate-200 text-slate-700">
                <p>This authorization form has been specifically designed to comply with all State and Federal regulations pertaining to the confidentiality of health information. It must be filled out completely with respect to the required content.</p>
                <br />
                <p className="font-semibold">The client who is providing this authorization:</p>
                <br />
                <div className="grid grid-cols-3 gap-1 gap-x-16 px-4">
                    <div className="flex justify-between"><p>Name:</p><p>{account.firstName}&nbsp;{account.lastName}</p></div>
                    <div className="flex justify-between"><p>Phone:</p><p>{formatPhone(account.phone ?? '')}</p></div>
                    <div className="flex justify-between"><p>DOB:</p><p>{account.birthDay?.toLocaleDateString()}</p></div>
                    <div className="flex justify-between"><p>Address:</p><p>{account.address}</p></div>
                    <div className="flex justify-between"><p>City:</p><p>{account.city}</p></div>
                    <div className="flex justify-between"><p>State/Zip:</p><p>{account.state?.abbreviation}/{account.zip}</p></div>
                </div>
                <br /><div></div>
                <p className="font-semibold">Authorization is hereby granted for:</p>
                <p>Person or Agency:&nbsp;&nbsp;&nbsp;&nbsp;Affiliated Court Services (ACS)&nbsp;&nbsp;&nbsp;&nbsp;123 Fake Street Fakeville, FK 88888</p>
                <br />
                <p className="font-semibold">The specific information requested to be released:</p>
                <br />
                <div className="grid grid-cols-2 gap-1 gap-x-16">
                    {/* <p className="font-semibold">Assessment/Evaluation</p>
                    <p className="font-semibold">Consultation</p>
                    <p className="font-semibold">Discharge Summary</p>
                    <p className="font-semibold">Clinic/Progress Notes</p>
                    <p className="font-semibold">Mental Status</p>
                    <p className="font-semibold">History & Physical</p>
                    <p className="font-semibold">Lab Reports</p>
                    <p className="font-semibold">Court or Criminal History</p>
                    <p className="font-semibold">Other (Please List)</p> */}
                    {/* Here we need to put the information that is shared to the agents/referring agency */}
                </div>
                <br />
                <p><span className="font-semibold">Dates of treatment starting on:</span> {new Date().toLocaleDateString()} <span className="font-semibold">to:</span> In progress</p> {/* Once we record completion date we need to add it here} */}
                <br />
                <p className="italic">I acknowledge and hereby consent to such, that the released information may contain alcohol, drug abuse, psychiatric, or court related information.</p>
                <br />
                <p>Records are being released to:</p>
                <br />
                <div>
                    {/* Here we put the people/agencies we will release info to */}
                </div>
                <br />
                <p><span className="font-semibold">Revoking my authorization and expiration (Optional):</span> I understand that I have the right to revoke this authorization at any time by sending a written request to ACS prior to the expiration date. Revocation of this authorization will expire on the following date. If I fail to specify an expiration date, this authorization will expire 12 months from the date signed. <span className="font-semibold">Revoking this release prior to obtaining your Certificate of Completion may prevent ACS from issuing you a Certificate of Completion.</span></p>
                <br />
                <p><span className="font-semibold">Signature to give my authorization:</span> I understand that authorizing the disclosure of Protected Health Information is voluntary and I need not sign this authorization in order to receive services. I also understand that the disclosure of this information carries with it the potential for unauthorized re-disclosure(s) and the information may no longer be protected by Federal Confidentiality Rules.</p>
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
                <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">Your signature needs to be added and be big enough to save.</div>
            }
            {
                showSaveErrorAlert &&
                <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">There was an error saving your signature. Please try again.</div>
            }
            {
                showRejectError &&
                <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">There was an error saving the rejection of this release of information. Please try again.</div>
            }
        </div>
    );
}

export default ReleaseOfInformationConsent;