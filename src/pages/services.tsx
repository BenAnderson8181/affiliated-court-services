import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import HomeButton from "~/components/MainHomeButton";

import logo from "~/../public/400JpgdpiLogoCropped.jpg";

const Services: NextPage = () => {
    return (
        <main className="flex flex-col h-screen bg-slate-100">
            <section className="w-full h-32 z-50 text-slate-100 bg-gradient-to-b from-[#2f0f5b] via-[#6941a2] to-[#2f0f5b]">
                <div className="flex justify-between px-10">
                    <div className="inline-flex">
                        <div className="bg-slate-100 rounded mt-1.5 p-1">
                            <Image 
                                src={logo}
                                alt="Logo"
                                width={90}
                            />
                        </div>
                        <p className="font-bold font-serif text-2xl mt-7 ml-3 [text-shadow:_0_1px_0_rgb(0_0_0_/_80%)]">AFFILIATED COURT SERVICES</p>
                    </div>
                    <div className="pt-7">
                        <Link href="/services" className="border border-purple-950 text-slate-100 bg-amber-400 p-2 rounded-xl text-xl font-extrabold shadow-lg shadow-black hover:shadow-md hover:shadow-black hover:scale-105 [text-shadow:_0_1px_0_rgb(0_0_0_/_80%)]" passHref>See our client services</Link>
                    </div>
                </div>
            </section>
            <section className="fixed w-32 bg-violet-100 left-0 h-full text-purple-950 top-20 pt-10 text-xl shadow-2xl shadow-purple-950 z-20 font-bold">
                <div className="pb-3 flex justify-center px-3 border-b border-purple-950"><HomeButton /></div>
                <div className="pt-3 px-3"><Link href='/about-us' passHref>About Us</Link></div>
                <div className="px-3"><Link href='/services' passHref>Services</Link></div>
                <div className="px-3"><Link href='/resources' passHref>Resoures</Link></div>
                <div className="px-3"><Link href='/signInRedirect' passHref>Account</Link></div>
                <div className="px-3"><Link href='/calendar' passHref>Calendar</Link></div>
                <div className="px-3"><Link href='/account/search' passHref>Search</Link></div> 
            </section>
            <section className="text-slate-900">
                <h1 className="bold">ACS Programs and Services</h1>
                <div>
                    <h3 className="bold">Comprehensive Court-Approved Evaluations</h3>
                    <p>
                        Using research-based assessments in conjunction with court documents, police reports, and self-report, we will go over the information with you and determine the treatment that best meets your needs.
                    </p>
                    <ul>
                        <li>Substance Use Disorders (drug / alcohol)</li>
                        <li>Domestic Violence (Intimate Partner Violence)</li>
                        <li>Cognitive Restructuring (Thinking Errors)</li>
                        <li>Anger Management</li>
                    </ul>
                </div>
                <div>
                    <h3 className="bold">Substance Use Disorder Group Therapy Sessions:</h3>
                    <p>
                        Give our clients the opportunity to learn interventions for substance use problems, practice skills and process their experiences in a supportive group setting where they can feel safe and understood.
                    </p>
                </div>
                <div>
                    <h3 className="bold">Domestic Violence Group Therapy Sessions:</h3>
                    <p>
                        Give our clients the opportunity to learn what contributes to intimate partner violence and gain insight into their own patterns of harmful behavior in their relationships.  This is done in a group setting meant to feel safe and supportive while still holding individuals accountable for their choices.
                    </p>
                </div>
                <div>
                    <h3 className="bold">Individual Therapy Sessions:</h3>
                    <p>
                        Offer our clients the opportunity to discuss and process their mental health issues one on one with a therapist.
                    </p>
                </div>
                <div>
                    <h3 className="bold">Diversion Workshops: </h3>
                    <div>
                        <h1>Anger Management:</h1>
                        <p>
                            Learning where anger comes from, what the consequences are, and how to choose to respond rather than react.
                        </p>
                    </div>
                    <div>
                        <h1>Conflict Resolution:</h1>
                        <p>
                            Learning that there are many different ways to resolve conflicts, from choosing to avoid issues that don’t really matter, diffusing dangerous situations, negotiating without giving up one’s values, to directly confronting abuses.
                        </p>
                    </div>
                    <div>
                        <h1>Assertiveness Communication Skills:</h1>
                        <p>
                            Learning to communicate in open, honest and appropriate ways in which one maintains respect for self, as well as respect for the other person.
                        </p>
                    </div>
                    <div>
                        <h1>Relationship Skills:</h1>
                        <p>
                            Learning to build a relationship based on honesty, trust and equality.
                        </p>
                    </div>
                    <div>
                        <h1>Cognitive Restructuring:</h1>
                        <p>
                            Learning to recognize thoughts and beliefs that are causing problems for ourselves and creating mental and emotional balance by changing our perspective about one’s life circumstances.
                        </p>
                    </div>
                    <div>
                        <h1>Substance Use Awareness:</h1>
                        <p>
                            Covers basic information about the effects and negative consequences of misusing drugs and alcohol.
                        </p>
                    </div>
                    <div>
                        <h1>Prime For Life:</h1>
                        <p>
                            Helping individuals reduce their risk of alcohol and drug related problems by learning how these issues develop, what we can do to prevent them, and why sometimes we need help.   
                        </p>
                    </div>
                    <div>
                        <h1>DUI Victim Impact Panel:</h1>
                        <p>
                            Provides a forum for people affected by impaired driving to describe to DUI offenders the impact it has had on their lives and on the lives of their families, friends and neighbors.
                        </p>
                    </div>
                </div>
            </section>
            {/* <section className="fixed bg-purple-900 bottom-0 h-36 w-full left-32 text-slate-100">
                Bottom
            </section> */}
        </main>
    )
}

export default Services;