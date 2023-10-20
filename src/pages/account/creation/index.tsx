import type { NextPage } from "next";
import { useRouter } from "next/router";

const AccountCreationStart: NextPage = () => {
    const router = useRouter();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100">
            <h1 className="text-4xl font-thin mb-10">Create Account</h1>
            <div className="flex flex-col items-center mb-10">
                <p className="mb-3 italic">If you are here to fulfill court requirements or to attend therapy/group sessions then please select &apos;client&apos;.</p>
                <p className="mb-3 italic">If you are here to see progress of any client(s) then please select &apos;agent&apos;.&nbsp;&nbsp;Please note we will need to validate who you are before approval.</p>
            </div>
            <div>
                <button className="rounded border border-slate-200 px-3 py-1 text-slate-200 mr-12 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70" onClick={() => router.push('/account/creation/client')}>Continue as Client</button>
                <button className="rounded border border-slate-200 px-3 py-1 text-slate-200 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70" onClick={() => router.push('/account/creation/agent')}>Continue as Agent</button>
            </div>
        </div>
    );
}

export default AccountCreationStart;