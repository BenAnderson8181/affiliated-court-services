import { useState } from "react";

type Requirement = {
    fulfilled: number;
    required: number;
    requirementType: string;
}

type Contact = {
    name: string;
    email: string;
}

type Props = {
    firstName?: string;
    lastName?: string;
    percentComplete?: number;
    requirements?: Requirement[];
    contacts?: Contact[];
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProgressReportModal = ({ firstName, lastName, percentComplete, requirements, contacts = [], onClose}: Props) => {
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showInvalidEmailAlert, setShowInvalidEmailAlert] = useState(false); 
    const [showEmailSent, setShowEmailSent] = useState(false);
    const [comment, setComment] = useState('');
    const [email, setEmail] = useState('');
    const [disabled, setDisabled] = useState(false);

    const onSend = async () => {
        if (email.length < 6) {
            setShowInvalidEmailAlert(true);
        }

        try {
            await fetch('/api/email/progressReport', {
                method: 'POST',
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    comment,
                    percentComplete,
                    requirements
                })
            });

            setTimeout(() => {
                setShowEmailSent(false);
            }, 5000)
            setShowEmailSent(true);
        }
        catch(error) {
            console.error('error: ', error)

            setShowErrorAlert(true);
        }
    }

    const onContactSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === '') {
            setDisabled(false);
        }
        else {
            setDisabled(true);
            setEmail(() => e.target.value);
        }
    }

    const onCancel = () => {
        onClose(false);
    }

    return (
        <div className="h-full w-full p-0 flex flex-col">
            <div className="flex flex-row justify-center text-3xl py-2 bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 w-full rounded-t-md">Email Progress Report</div>
            <div className="p-8">
                {
                    contacts?.length > 0 &&
                    <label className="mb-2">
                        <div className="text-2xl font-light mb-3">Find contact - If a contact is selected it will use their email instead of the to email field</div>
                        <select
                            className="rounded-md border w-full border-slate-400 text-slate-700 py-0 px-2 text-xl"
                            onChange={onContactSelect}
                        >
                            <option value="">-- You may choose a contact --</option>
                            {
                                contacts.map((c) => {
                                    return <option key={c.email} value={c.email}>{c.name}</option>
                                })
                            }
                        </select>
                    </label>
                }
                <label className="mb-2">
                    <div className="text-2xl font-light mb-3">To Email</div>
                    <input
                        type="text"
                        placeholder="To Email"
                        className="rounded-md border border-slate-700 text-slate-700 py-0 px-2 text-xl w-full"
                        onChange={(e) => (setEmail(() => e.target.value))}
                        disabled={disabled}
                    />
                </label>
                <label className="mb-2">
                    <div className="text-2xl font-light mb-3">Comment</div>
                    <textarea  className="border border-indigo-950 w-full rounded-md shadow-indigo-950 shadow-md p-3" onChange={(e) => setComment(() => e.target.value)} />
                </label>
                <div>
                    <button className="bg-purple-700 text-slate-100 border border-indigo-800 rounded-md shadow-lg shadow-purple-950 px-4 py-3 mt-4 hover:scale-105 hover:shadow-lg hover:shadow-purple-900 hover:opacity-90 mr-8" onClick={() => onSend()}>Send</button>
                    <button className="bg-red-700 text-slate-100 border border-red-900 rounded-md shadow-lg shadow-red-950 px-4 py-3 mt-4 hover:scale-105 hover:shadow-lg hover:shadow-red-950 hover:opacity-90" onClick={() => onCancel()}>Cancel</button>
                </div>
                { 
                    showEmailSent &&
                    <div className="border border-green-500 round mt-4 p-3 text-green-600 text-2xl">Email successfully sent to {email}</div>
                }
                {
                    showInvalidEmailAlert &&
                    <div className="border border-yellow-700 rounded-md mt-4 p-3 text-yellow-700 text-2xl">Please provide a valid to email.</div>
                }
                {
                    showErrorAlert &&
                    <div className="border border-yellow-700 rounded-md mt-4 p-3 text-yellow-700 text-2xl">Failed to send the email.  Please check the to email and comment and try again.</div>
                }
            </div>
        </div>
    )
}

export default ProgressReportModal;