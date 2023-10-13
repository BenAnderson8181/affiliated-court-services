import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useState } from "react";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { formatPhone } from "~/utils";
import { api } from "~/utils/api";
import { RiDownload2Fill } from "react-icons/ri";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type Props = {
    policyTitle: string;
    accountId: string;
}

const AccountPolicyModal = ({ policyTitle, accountId }: Props) => {
    const { user } = useUser();
    const router = useRouter();
    const [showDownloadError, setShowDownloadError] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const userId = user?.id ?? '';
    if (!userId || userId === '' || userId == undefined)
        router.push('/').catch((err) => console.error(err));

    const accountQuery = api.account.findById.useQuery({ id: accountId});
    const accountSignatureQuery = api.accountSignature.load.useQuery({ accountId });
    const incidentQuery = api.incident.getLatest.useQuery({ accountId });
    const priceQuery = api.price.list.useQuery();
    const accountFinanicalQuery = api.accountFinancial.get.useQuery({ accountId })

    if (accountQuery.isLoading || accountSignatureQuery.isLoading || incidentQuery.isLoading || priceQuery.isLoading || accountFinanicalQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (accountQuery.isError || accountSignatureQuery.isError || incidentQuery.isError || priceQuery.isError || accountFinanicalQuery.isError) {
        console.error()
        return <LoadError type='Page' />
    }

    const account = accountQuery.data;
    const accountName = `${account.firstName} ${account.lastName}`;
    const accountSignature = accountSignatureQuery.data;
    const incident = incidentQuery.data;
    const consentType = incident.incidentType.name;
    const prices = priceQuery.data;
    const groupPrice = prices.find((p) => p.name === 'Group');
    const orientationPrice = prices.find((p) => p.name === 'Orientation Workshop');
    const workShopPrice = prices.find((p) => p.name === 'Workshop');
    const individualPrice = prices.find((p) => p.name === 'Individual');
    const interviewPrice = prices.find((p) => p.name === 'Interview');
    const primeForLifePrice = prices.find((p) => p.name === 'Prime for Life');
    const savedPaymentProcess = accountFinanicalQuery.data.paymentProcess;

    const handleDownload = () => {
        setIsExporting(() => true);

        window.setTimeout(async () => {
            const element = document.getElementById('download');

            if (element != null) {
                const canvas = await html2canvas(element);
                const data = canvas.toDataURL('image/png');
            
                const pdf = new jsPDF();
                const imgProperties = pdf.getImageProperties(data);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight =
                  (imgProperties.height * pdfWidth) / imgProperties.width;
            
                pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`${policyTitle}.pdf`);
    
                window.setTimeout(() => {
                    setIsExporting(() => false);
                }, 1000);
            }
            else {
                setShowDownloadError(true);
            }
        }, 500);
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 relative" id="download">
            {
                !isExporting &&
                <div className="absolute top-20 left-4 inline-flex gap-x-4">
                    <p className="cursor-pointer hover:scale-105 hover:opacity-80"><RiDownload2Fill size='2rem' className="text-slate-100" onClick={handleDownload} /></p>
                </div>
            }
            {
                isExporting && 
                <div className="grid grid-cols-2 gap-1 gap-x-16 px-4 bg-indigo-200 text-slate-700 rounded-sm p-6 mt-6 w-3/4 text-lg">
                    <div className="flex justify-between"><p className="font-semibold">Name:</p><p>{account.firstName}&nbsp;{account.lastName}</p></div>
                    <div className="flex justify-between"><p className="font-semibold">Phone:</p><p>{formatPhone(account.phone ?? '')}</p></div>
                    <div className="flex justify-between"><p className="font-semibold">DOB:</p><p>{account.birthDay?.toLocaleDateString()}</p></div>
                    <div className="flex justify-between"><p className="font-semibold">Address:</p><p>{account.address}</p></div>
                    <div className="flex justify-between"><p className="font-semibold">City:</p><p>{account.city}</p></div>
                    <div className="flex justify-between"><p className="font-semibold">State/Zip:</p><p>{account.state?.abbreviation}/{account.zip}</p></div>
                </div>
            }
            {
                policyTitle === 'Client Rights' &&
                <>
                    <h1 className="text-4xl font-thin my-10">CLIENT RIGHTS</h1>
                    <div className="text-lg w-3/4 text-start border border-indigo-700 rounded-sm p-8 shadow-xl shadow-purple-900 mb-12 bg-slate-200 text-slate-700">
                        <p>Our accountability to you:</p>
                        <br />
                        <ul className="list-disc pl-8">
                            <li>
                                You have the right to privacy regarding your participation in this program, with the following exceptions according to Utah State Law:
                                <ul className="list-disc pl-6">
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
                    </div>
                </>
            }
            {
                policyTitle === 'Consumer Agreement' &&
                <>
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
                    </div>
                </>
            }
            {
                policyTitle === 'Criminal Background' &&
                <>
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
                    </div>
                </>
            }
            {
                policyTitle === 'E-Signature Consent' &&
                <>
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
                </>
            }
            {
                policyTitle === 'Informed Consent' &&
                <>
                    <h1 className="text-4xl font-thin my-10">INFORMED CONSENT</h1>
                    <div className="text-lg w-3/4 text-start border border-indigo-700 rounded-sm p-8 shadow-xl shadow-purple-900 mb-12 bg-slate-200 text-slate-700">
                        <p>This information is provided to help you make informed decisions and to take an active role in your treatment.  If you do not understand this information, please ask a staff member for clarification before signing.  Your signature indicates the information and conditions presented here are understandable and agreeable to you.</p>
                        <br />
                        <ul className="list-disc pl-8">
                            <li>Therapy is an interactive process meant to promote insight and personal growth in line with the goals you set with your therapist during your treatment.  You will be expected to be an active participant by identifying goals, learning and practicing new skills, and contributing to group discussions.</li>
                            <li>You have the right to appropriately question any part of your treatment and refuse any intervention that you are uncomfortable with by discussing your concerns with your therapist.</li>
                            <li>Recommendations for treatment are based on standard assessments, police and court documents, and input from the therapist after an individual interview with you.  Treatment plans are subject to change according to your progress in therapy or new information from court or probation agents.</li>
                            <li>You have the right to terminate treatment at any time and will be expected to pay only for those services received.  Your termination will be reported to the appropriate court agents.</li>
                            <li>
                                Your participation in our program is confidential within the limits of the laws of the State of Utah, and relevant professional codes.  Information you disclose during treatment will not be revealed to anyone without your written permission, with the following exceptions:
                                <ul className="pl-6">
                                    <li>∘&nbsp;If you request your information to be submitted to an insurance company on your behalf, information about your diagnosis and treatment plan may be revealed to your insurance carrier.</li>
                                    <li>∘&nbsp;Your therapist is required by law to report any “reasonable suspicion” that a child or vulnerable adult is being abused in any manner.</li>
                                    <li>∘&nbsp;If your therapist has reason to believe you are in imminent danger of harming yourself or another person, they are required to take reasonable steps to prevent such harm from taking place.</li>
                                    <li>∘&nbsp;If your treatment is ordered by a court, updates of your treatment progress will be sent to the appropriate court agent.</li>
                                </ul>
                            </li>
                            <li>You have the right to review your official records at any time, however, be aware that these records belong to the Treatment Center and may not be removed from the Treatment Center.  If you wish, your Therapist or the Clinical Director will review your records with you, and answer any questions concerning the information contained.</li>
                            <li>If you request, your records may be released to any person or agency you designate by filling out and signing an “Authorization for Release of Protected Health Information.”</li>
                        </ul>
                        <br />
                        <p>I understand the information contained in this Informed Consent agreement and agree to all conditions stated.</p>
                    </div>
                </>
            }
            {
                policyTitle === 'Meeting Etiquette Agreement' &&
                <>
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
                    </div>
                </>
            }
            {
                policyTitle === 'Payment Agreement' &&
                <>
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
                        <br />
                        <div>
                            {
                                savedPaymentProcess === 'automatic' &&
                                <div className="inline-flex">
                                    <input className="peer" type="radio" name="allowedPayment" id="automatic" value="1" defaultChecked={true} />
                                    <label className="flex justify-center cursor-pointer rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100 pl-6" htmlFor="automatic">
                                        I authorize Affiliated Court Services to bill the credit card on file on the dates I attend sessions for the above-mentioned amounts
                                    </label>
                                </div>
                            }
                            {
                                savedPaymentProcess === 'manual' &&
                                <div className="inline-flex">
                                    <input className="peer" type="radio" name="allowedPayment" id="manual" value="2" defaultChecked={true} />
                                    <label className="flex justify-center cursor-pointer rounded-sm mr-3 peer-checked:bg-indigo-700 peer-checked:text-slate-100 pl-6" htmlFor="manual">
                                        I authorize Affiliated Court Services to bill the credit card on file only upon my verbal permission for each payment
                                    </label>
                                </div>
                            }
                        </div>
                        <br />
                        <p>Failure to make payment according to this Payment Agreement will prevent you from attending future sessions as well as cancel any already scheduled sessions. Any re-issuance of a certificate of completion will require a $10 fee.</p>
                        <br />
                        <p>If my treatment account should become delinquent and turned over to a collection agency, I agree to pay all attorney and collection fees, as well as any court costs associated with efforts to collect on my delinquent account.</p>
                    </div>
                </>
            }
            {
                policyTitle === 'Release of Information' &&
                <>
                    <h1 className="text-2xl font-thin my-10">AUTHORIZATION FOR THE RELEASE OF PROTECTED HEALTH INFORMATION (PHI)</h1>
                    <div className="text-lg w-3/4 text-start border border-indigo-700 rounded-sm p-8 shadow-xl shadow-purple-900 mb-12 bg-slate-200 text-slate-700">
                        <p>This authorization form has been specifically designed to comply with all State and Federal regulations pertaining to the confidentiality of health information. It must be filled out completely with respect to the required content.</p>
                        {/* <br />
                        <p className="font-semibold">The client who is providing this authorization:</p>
                        <br />
                        <div className="grid grid-cols-2 gap-1 gap-x-16 px-4">
                            <div className="flex justify-between"><p>Name:</p><p>{account.firstName}&nbsp;{account.lastName}</p></div>
                            <div className="flex justify-between"><p>Phone:</p><p>{formatPhone(account.phone ?? '')}</p></div>
                            <div className="flex justify-between"><p>DOB:</p><p>{account.birthDay?.toLocaleDateString()}</p></div>
                            <div className="flex justify-between"><p>Address:</p><p>{account.address}</p></div>
                            <div className="flex justify-between"><p>City:</p><p>{account.city}</p></div>
                            <div className="flex justify-between"><p>State/Zip:</p><p>{account.state?.abbreviation}/{account.zip}</p></div>
                        </div> */}
                        <br />
                        <p className="font-semibold">Authorization is hereby granted for:</p>
                        <p>Person or Agency:&nbsp;&nbsp;&nbsp;&nbsp;Affiliated Court Services (ACS)</p>
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
                </>
            }
            <div className="flex flex-col items-center justify-center mb-6">
                <div className="mb-6 inline">
                    {accountSignature?.signature && 
                        <div className="inline">Signed:&nbsp;&nbsp;&nbsp;<img alt="Signature" src={accountSignature?.signature} className="inline"/></div>
                    }
                </div>
            </div>
            {
                showDownloadError &&
                <div className="border border-yellow-300 round mt-4 p-3 text-slate-100 text-2xl">There was an error saving your signature. Please try again or contact our office.</div>
            }
        </div>
    );
}

export default AccountPolicyModal;