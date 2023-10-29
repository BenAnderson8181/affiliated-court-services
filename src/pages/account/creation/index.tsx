import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useClerk } from "@clerk/clerk-react";
import Link from "next/link";
import Image from "next/image";

import logo from "~/../public/400JpgdpiLogoCropped.jpg";

const AccountCreationStart: NextPage = () => {
    const router = useRouter();
    const { signOut } = useClerk();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100">
            <Link href="/"
                className="bg-slate-100 rounded mt-1.5 p-1 absolute top-12 left-12">
                <Image 
                    src={logo}
                    alt="Logo"
                    width={90}
                />
            </Link>
            <h1 className="text-4xl font-thin mb-10">Create Account</h1>
            <div className="flex flex-col items-center mb-10">
                <p className="mb-3 font-semibold italic">Already have an account?  <button className="text-slate-200 hover:cursor-pointer p-2" onClick={() => signOut()}>Click here!</button></p>
                <p className="mb-3 italic">If you are here to fulfill court requirements or to attend therapy/group sessions then please select &apos;client&apos;.</p>
                <p className="mb-3 italic">If you are here to see progress of any client(s) then please select &apos;agent&apos;.&nbsp;&nbsp;Please note we will need to validate who you are before approval.</p>
            </div>
            <div>
                <button className="rounded border border-slate-200 px-3 py-1 text-slate-200 mr-12 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70" onClick={() => router.push('/account/creation/client')}>Create Client Account</button>
                <button className="rounded border border-slate-200 px-3 py-1 text-slate-200 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70 mr-12" onClick={() => router.push('/account/creation/agent')}>Create Agent Account</button>
                <button className="rounded border border-slate-200 px-3 py-1 text-slate-200 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70" onClick={() => signOut()}>Continue With Existing Account</button>
            </div>
        </div>
    );
}

export default AccountCreationStart;