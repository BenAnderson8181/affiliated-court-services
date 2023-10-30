import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import type { ReactNode } from "react";
import SignatureCanvas from "react-signature-canvas";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

type Props = {
    children?: ReactNode
}

const ESignatureConsent: React.FC<Props> = () => {
    const router = useRouter();
    const signatureCanvas = useRef({} as SignatureCanvas);
    const {user} = useUser();
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSaveErrorAlert, setShowSaveErrorAlert] = useState(false);

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        router.push('/').catch((err) => console.error(err));

    const accountQuery = api.account.findAccountByExternalId.useQuery({externalId: userId});
    const policyQuery = api.policy.list.useQuery();
    const accountPolicyQuery = api.accountPolicy.list.useQuery({ externalId: userId });
    const accountSignatureMutation = api.accountSignature.upsert.useMutation();
    const accountPolicyMutation = api.accountPolicy.upsert.useMutation();

    if (accountQuery.isLoading || policyQuery.isLoading || accountPolicyQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (accountQuery.isError || policyQuery.isError || accountPolicyQuery.isError) {
        return <LoadError type='Page' />
    }

    const account = accountQuery.data;
    const policy = policyQuery.data?.find(p => p.title === 'E-Signature Consent');
    const accountPolicies = accountPolicyQuery.data;
    const eSignatureConsentPolicy = accountPolicies.find((p) => p.policyId === policy?.id);

    if (eSignatureConsentPolicy?.signed === true)
        router.push('/account/policies/consumerAgreement').catch((err) => console.error(err));

    const clear = () => {
        signatureCanvas.current.clear();
    }

    const handleNext = async () => {
        const sig = signatureCanvas.current.toDataURL();

        if (sig.length < 2000) {
            setShowErrorAlert(true);
            return;
        }

        // save the signature to the database
        const result = await accountSignatureMutation.mutateAsync({
            accountId: account.id,
            signature: sig
        })
        .catch((err) => {
            setShowSaveErrorAlert(true);
            console.error(err);
        });

        if (!result) {
            setShowErrorAlert(true);
            return;
        }

        if (!account?.id) return;
        if (!policy?.id) return;
        const apResult = await accountPolicyMutation.mutateAsync({
            accountId: account?.id,
            policyId: policy?.id,
            signed: true,
        })
        .catch((err) => {
            setShowSaveErrorAlert(true);
            console.log('error: ', err);
        });

        if (!apResult) {
            setShowErrorAlert(true);
            return;
        }

        router.push('/account/policies/consumerAgreement').catch((err) => console.error(err));
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100">
            <h1 className="text-4xl font-thin my-6">ELECTRONIC SIGNATURE CONSENT FORM</h1>
            <div className="text-lg w-3/4 text-start border-2 border-indigo-700 rounded-md p-8 shadow-xl shadow-purple-950 bg-slate-200 text-slate-700">
                <p>
                    I, {account.firstName}&nbsp;{account.lastName}, hereby give my consent to electronically sign documents and records (&rdquo;Documents&rdquo;) as may be required by Affiliated Court Services (ACS) in connection with my engagement or interaction with the ACS.
                </p>
                <br />
                <p>
                    By providing my consent, I acknowledge and agree to the following:
                </p>
                <br />
                <ul className="list-disc pl-8">
                    <li>Consent to Electronic Signatures: I understand and agree that my electronic signature, whether in the form of typing my name, selecting an &rdquo;I Agree&rdquo; button, or using any other method provided by ACS, will have the same legal effect as a handwritten signature on paper.</li>
                    <li>Use of Electronic Signatures: I acknowledge that ACS may require me to electronically sign various Documents, including but not limited to contracts, agreements, consent forms, and other legal or business-related documents. I agree to use electronic signatures for such Documents and understand that I may be asked to provide additional verification or authentication to ensure the integrity of the electronic signature process.</li>
                    <li>Email Communication: I consent to receive Documents and related communications electronically via email or through any other electronic means provided by ACS. I understand that it is my responsibility to maintain a valid email address and promptly notify ACS of any changes.</li>
                    <li>Withdrawal of Consent: I understand that I have the right to withdraw my consent to electronically sign Documents at any time. If I choose to withdraw my consent, I understand that it may affect my ability to engage or interact with ACS and that I may need to use alternative means of signing or delivering Documents.</li>
                    <li>Record Retention: I acknowledge that ACS will maintain records of the electronically signed Documents in accordance with applicable laws and regulations. I understand that I may request a copy of any electronically signed Document for my records.</li>
                </ul>
                <br />
                <p>By electronically signing this consent form, I affirm that I have read and understood the terms and conditions set forth above, and I voluntarily give my consent to electronically sign Documents as described herein.</p>
            </div>
            <div>
                <SignatureCanvas ref={signatureCanvas} penColor='black' canvasProps={{ width: 300, height: 120, className: 'bg-slate-200 rounded-lg border-2 border-indigo-700 m-5 shadow-2xl' }} />
            </div>
            <div className="pl-11 mb-5">
                <button className="rounded border border-slate-200 px-3 py-1 text-slate-200 mr-12 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70" onClick={clear}>Clear</button>
                <button className="rounded border border-slate-200 px-3 py-1 text-slate-200 mr-12 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70" onClick={handleNext}>Next</button>
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

export default ESignatureConsent;