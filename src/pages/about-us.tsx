import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import HomeButton from "~/components/MainHomeButton";

import logo from "~/../public/400JpgdpiLogoCropped.jpg";

const AboutUs: NextPage = () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100">
            <section className="h-20 fixed top-0 w-full z-50 text-slate-100 bg-gradient-to-b from-[#2f0f5b] via-[#6941a2] to-[#2f0f5b]">
                <div className="flex justify-between px-10">
                    <div className="">
                    <div className="bg-slate-100 rounded mt-1.5 p-1">
                        <Image 
                        src={logo}
                        alt="Logo"
                        width={90}
                        />
                    </div>
                    </div>
                    <div className="bg-transparent font-bold font-serif text-4xl mt-5">AFFILIATED COURT SERVICES</div>
                    <div className="pt-7">
                    <SignedIn>
                        <div className="border-2 border-purple-950 p-.5 rounded-full shadow-md shadow-black"><UserButton /></div>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode='modal'>
                        <button className="rounded border border-gray-400 px-3 py-1 text-gray-400">
                            Sign In
                        </button>
                        </SignInButton>
                    </SignedOut>
                    </div>
                </div>
            </section>
            <section className="fixed w-32 bg-violet-100 left-0 h-full text-purple-950 top-20 pt-5 text-xl shadow-2xl shadow-purple-950 z-20 font-bold">
                <div className="pb-3 flex justify-center px-3 border-b border-purple-950"><HomeButton /></div>
                <div className="pt-3 px-3"><Link href='/about-us' passHref>About Us</Link></div>
                <div className="px-3"><Link href='/services' passHref>Services</Link></div>
                <div className="px-3"><Link href='/resources' passHref>Resoures</Link></div>
                <div className="px-3"><Link href='/signInRedirect' passHref>Account</Link></div>
                <div className="px-3"><Link href='/calendar' passHref>Calendar</Link></div>
                <div className="px-3"><Link href='/account/search' passHref>Search</Link></div>
            </section>
            <section className="text-slate-900">
                About Us
            </section>
            <section className="fixed bg-purple-900 bottom-0 h-36 w-full left-32 text-slate-100">
                Bottom
            </section>
        </main>
    )
}

export default AboutUs;