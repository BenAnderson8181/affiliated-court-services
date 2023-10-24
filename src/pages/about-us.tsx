import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import HomeButton from "~/components/MainHomeButton";

import logo from "~/../public/400JpgdpiLogoCropped.jpg";

const AboutUs: NextPage = () => {
    return (
        <>
            <main className="flex flex-col h-full bg-slate-100">
                <section className="w-full h-24 z-50 text-slate-100 bg-gradient-to-b from-[#2f0f5b] via-[#6941a2] to-[#2f0f5b] fixed">
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
                <section className="h-full w-full flex flex-col relative overflow-hidden text-slate-900 pl-48 pr-16 items-center pt-36">
                    <h1 className="text-3xl font-bold">Welcome to Affiliated Court Services</h1>
                    <h2 className="text-2xl font-semibold">Your Journey to Well-Being Starts Here</h2>
                    <div className="pt-12">
                        <h3 className="font-bold text-xl text-center mb-6">Our Mission</h3>
                        <p className="text-xl border border-purple-950 bg-white p-3 rounded-md shadow-sm shadow-purple-950">
                            At Affiliated Court Services, we are committed to providing compassionate, confidential, and effective mental health services that empower individuals to live fulfilling lives. Our mission is to foster a nurturing environment where you can explore your thoughts, feelings, and concerns in a safe space, supported by qualified professionals.
                        </p>
                    </div>
                    <div className="pt-12">
                        <h3 className="font-bold text-xl text-center mb-6">Who We Are</h3>
                        <p className="text-xl border border-purple-950 bg-white p-3 rounded-md shadow-sm shadow-purple-950">
                            Founded by Lujean Marshal, a licensed therapist with over 30 years of experience, Affiliated Court Services is a dedicated mental health clinic offering a wide array of services tailored to meet your unique needs. Our team of licensed therapists, social workers, and mental health counselors work collaboratively to provide the best care possible.
                        </p>
                    </div>
                    <div className="pt-12">
                        <h3 className="font-bold text-xl text-center mb-6">What We Offer</h3>
                        <div className="flex flex-row justify-between text-xl border border-purple-950 bg-white p-3 rounded-md shadow-sm shadow-purple-950">
                            <ul className="w-1/2 list-disc px-6 list-inside">
                                <p className="font-semibold">Diversion Workshops</p>
                                <li className="pl-6">Substance Use Awareness</li>
                                <li className="pl-6">Prime for Life</li>
                                <li className="pl-6">DUI Victim Impact Panel</li>
                                <br />
                                <li>Substance Use Disorder Group Therapy Sessions</li>
                                <li>Domestic Violence Group Therapy Sessions</li>
                                
                                <li>Evaluations & Assessments that satisfy court orders</li>
                            </ul>
                            <ul className="w-1/2 list-disc list-inside pl-6">
                                <p className="font-semibold">Psychoeducational Classes</p>
                                <li className="pl-6">Assertiveness Communication Skills</li>
                                <li className="pl-6">Relationship Skills</li>
                                <li className="pl-6">Cognitive Restructuring</li>
                                <li className="pl-6">Anger Management</li>
                                <li className="pl-6">Conflict Resolution</li>
                                <br />
                                <li>Individual Therapy Sessions</li>
                                <li>Other (Contact us for more information)</li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-12">
                        <h3 className="font-bold text-xl text-center mb-6">Our Approach</h3>
                        <p className="text-xl border border-purple-950 bg-white p-3 rounded-md shadow-sm shadow-purple-950">
                            We recognize that mental and emotional well-being is a complex tapestry influenced by various factors, from individual history to social circumstances. For those who are attending therapy as part of a court order, the experience can be particularly stressful, often laden with stigma and apprehension.
                            <br /><br />
                            Our approach is centered around creating an environment of non-judgmental understanding and support, tailored to serve this unique clientele. We offer specialized group therapy sessions designed to meet court-mandated requirements, while also providing valuable skills and insights that benefit all areas of life. These sessions are led by experienced therapists trained in handling sensitive issues within a legal context.
                            <br /><br />
                            We combine various therapeutic methods, including Cognitive Behavioral Therapy (CBT), Dialectical Behavior Therapy (DBT), and trauma-informed care to address the multifaceted needs of our patients. Our objective is not only to satisfy court mandates but also to empower our patients to enact meaningful change, thereby improving their quality of life.
                        </p>
                    </div>
                    <div className="pt-12 mb-16">
                        <h3 className="font-bold text-xl text-center mb-6">Why Choose Us?</h3>
                        <div className="text-xl border border-purple-950 bg-white p-3 rounded-md shadow-sm shadow-purple-950">
                            <ul className="list-disc pl-6">
                                <li><span className="font-semibold">Highly Skilled Team:</span> Our clinicians are highly trained and experienced in various therapeutic modalities.</li>
                                <li><span className="font-semibold">Confidentiality:</span> We adhere to the highest ethical standards to ensure your privacy is protected.</li>
                                <li><span className="font-semibold">Flexible Scheduling:</span> Convenient online booking and flexible appointment times to suit your lifestyle.</li>
                            </ul>
                        </div>
                    </div>
                </section>
                {/* <section className="fixed bg-purple-900 bottom-0 h-36 w-full left-32 text-slate-100">
                    Bottom
                </section> */}
            </main>
        </>
    )
}

export default AboutUs;