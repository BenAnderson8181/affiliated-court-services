import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import HomeButton from "~/components/MainHomeButton";

import logo from "~/../public/400JpgdpiLogoCropped.jpg";

const AboutUs: NextPage = () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100">
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
                <h1 className="bold">Welcome to Affiliated Court Services - Your Journey to Well-Being Starts Here</h1>
                <div>
                    <h3 className="bold">Our Mission</h3>
                    <p>
                        At Affiliated Court Services, we are committed to providing compassionate, confidential, and effective mental health services that empower individuals to live fulfilling lives. Our mission is to foster a nurturing environment where you can explore your thoughts, feelings, and concerns in a safe space, supported by qualified professionals.
                    </p>
                </div>
                <div>
                    <h3 className="bold">Who We Are</h3>
                    <p>
                        Founded by Lujean Marshal, a licensed therapist with over 30 years of experience, Affiliated Court Services is a dedicated mental health clinic offering a wide array of services tailored to meet your unique needs. Our team of licensed therapists, social workers, and mental health counselors work collaboratively to provide the best care possible.
                    </p>
                </div>
                <div>
                    <h3 className="bold">What We Offer</h3>
                    <div>
                        <ul>
                            <li>
                                Diversion Workshops
                                <li>Substance Use Awareness</li>
                                <li>Prime for Life</li>
                                <li>DUI Victim Impact Panel</li>
                            </li>
                            <li>
                                Psychoeducational Classes
                                <li>Assertiveness Communication Skills</li>
                                <li>Relationship Skills</li>
                                <li>Cognitive Restructuring</li>
                                <li>Anger Management</li>
                                <li>Conflict Resolution</li>
                            </li>
                            <li>Substance Use Disorder Group Therapy Sessions</li>
                            <li>Domestic Violence Group Therapy Sessions</li>
                            <li>Individual Therapy Sessions</li>
                            <li>Evaluations & Assessments that satisfy court orders</li>
                            <li>Other (Contact us for more information)</li>
                        </ul>
                    </div>
                </div>
                <div>
                    <h3 className="bold">Our Approach</h3>
                    <p>
                        We recognize that mental and emotional well-being is a complex tapestry influenced by various factors, from individual history to social circumstances. For those who are attending therapy as part of a court order, the experience can be particularly stressful, often laden with stigma and apprehension.
                    </p>
                    <p>
                        Our approach is centered around creating an environment of non-judgmental understanding and support, tailored to serve this unique clientele. We offer specialized group therapy sessions designed to meet court-mandated requirements, while also providing valuable skills and insights that benefit all areas of life. These sessions are led by experienced therapists trained in handling sensitive issues within a legal context.
                    </p>
                </div>
            </section>
            {/* <section className="fixed bg-purple-900 bottom-0 h-36 w-full left-32 text-slate-100">
                Bottom
            </section> */}
        </main>
    )
}

export default AboutUs;