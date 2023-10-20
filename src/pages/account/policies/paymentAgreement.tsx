import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import React, { useState } from "react";
import type { ReactNode } from "react";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

type Props = {
    children?: ReactNode
}

const PaymentAgreementConsent: React.FC<Props> = () => {
    const { user } = useUser();
    const router = useRouter();
    const [showSignature, setShowSignature] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSaveErrorAlert, setShowSaveErrorAlert] = useState(false);
    const [showFinancialError, setShowFinancialError] = useState(false);
    const [paymentProcess, setPaymentProcess] = useState<'automatic' | 'manual'>('automatic');

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        router.push('/').catch((err) => console.error(err));

    const accountQuery = api.account.findAccountByExternalId.useQuery({ externalId: userId });
    const accountSignatureQuery = api.accountSignature.load.useQuery({ externalId: userId });
    const policyQuery = api.policy.list.useQuery();
    const priceQuery = api.price.list.useQuery();
    const accountPolicyQuery = api.accountPolicy.list.useQuery({ externalId: userId });
    const accountPolicyMutation = api.accountPolicy.upsert.useMutation();
    const accountFinancialMutation = api.accountFinancial.create.useMutation();

    if (accountQuery.isLoading || accountSignatureQuery.isLoading || policyQuery.isLoading || priceQuery.isLoading || accountPolicyQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (accountQuery.isError || accountSignatureQuery.isError || policyQuery.isError || priceQuery.isError || accountPolicyQuery.isError) {
        return <LoadError type='Page' />
    }

    const account = accountQuery.data;
    const accountSignature = accountSignatureQuery.data;
    const policy = policyQuery.data?.find(p => p.title === 'Payment Agreement');
    const prices = priceQuery.data;
    const groupPrice = prices.find((p) => p.name === 'Group');
    const orientationPrice = prices.find((p) => p.name === 'Orientation Workshop');
    const workShopPrice = prices.find((p) => p.name === 'Workshop');
    const individualPrice = prices.find((p) => p.name === 'Individual');
    const interviewPrice = prices.find((p) => p.name === 'Interview');
    const primeForLifePrice = prices.find((p) => p.name === 'Prime for Life');
    const accountPolicies = accountPolicyQuery.data;
    const paymentAgreementPolicy = accountPolicies.find((p) => p.policyId === policy?.id);

    if (paymentAgreementPolicy?.signed === true)
        router.push('/account/policies/meetingEtiquette').catch((err) => console.error(err));

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

        const resultAccountFinancial = await accountFinancialMutation.mutateAsync({
            paymentProcess,
            accountId: account.id
        })
        .catch((err) => {
            setShowFinancialError(true);
            console.error('error: ', err);
        });

        if (!resultAccountFinancial) {
            return;
        }

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
            return;
        }
        
        router.push('/account/policies/meetingEtiquette').catch((err) => console.error(err));
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 pb-8">
            <h1 className="text-4xl font-thin my-10">PAYMENT AGREEMENT</h1>
            <div className="text-lg w-3/4 text-start border border-indigo-700 rounded-sm p-8 shadow-xl shadow-purple-900 mb-12 bg-slate-200 text-slate-700">
                <p>I, {account.firstName}&nbsp;{account.lastName}, agree to pay the amount for the respective service listed below:</p>
                <ul className="list-disc pl-8">
                    <li><span className="font-semibold">Group Session:</span> ${groupPrice?.price} per session</li>
                    <li><span className="font-semibold">Individual Sessions:</span>  ${individualPrice?.price} per follow-up individual sessions</li>
                    {/* <li>Individual Psychotherapy Sessions: ${} per Individual psychotherapy sessions</li> */}
                    <li><span className="font-semibold">Orientation Workshop:</span> ${orientationPrice?.price}</li>
                    <li><span className="font-semibold">Evaluation Interview:</span> ${interviewPrice?.price} per interview</li>
                    <li><span className="font-semibold">Prime for Life:</span> ${primeForLifePrice?.price} per program</li>
                    <li><span className="font-semibold">Diversion Workshop:</span> ${workShopPrice?.price} per program</li>
                </ul>
                <br />
                <p>Payments will be made prior to each session, interview, or program. I also agree to pay a fee of $50 for no-shows or cancellations (less than 48 hours ahead of scheduled appointment time) of individual or re-evaluation sessions missed or $20 for each Group Session missed. Any emergencies requiring you to re-schedule, please contact our Office as soon as possible.</p>
                <div>
                    <div className="inline-flex">
                        <input className="peer" type="radio" name="allowedPayment" id="automatic" value="1" onChange={() => setPaymentProcess(() => 'automatic')} defaultChecked={true} />
                        <label className="flex justify-center cursor-pointer rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100 pl-6" htmlFor="automatic">
                            I authorize Affiliated Court Services to bill the credit card on file on the dates I attend sessions for the above-mentioned amounts
                        </label>
                    </div>
                    <div className="inline-flex">
                        <input className="peer" type="radio" name="allowedPayment" id="manual" value="2" onChange={() => setPaymentProcess(() => 'manual')} />
                        <label className="flex justify-center cursor-pointer rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100 pl-6" htmlFor="manual">
                            I authorize Affiliated Court Services to bill the credit card on file only upon my verbal permission for each payment
                        </label>
                    </div>
                </div>
                <br />
                <p>Failure to make payment according to this Payment Agreement will prevent you from attending future sessions as well as cancel any already scheduled sessions. Any re-issuance of a certificate of completion will require a $10 fee.</p>
                <br />
                <p>If my treatment account should become delinquent and turned over to a collection agency, I agree to pay all attorney and collection fees, as well as any court costs associated with efforts to collect on my delinquent account.</p>
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
            {
                showFinancialError &&
                <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">There was an error saving the payment agreement. Please try again.</div>
            }
        </div>
    );
}

export default PaymentAgreementConsent;