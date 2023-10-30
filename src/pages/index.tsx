import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import type { NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import HomeButton from "~/components/MainHomeButton";
import { RiGovernmentFill, RiCreativeCommonsByFill, RiStore3Fill, RiHeartPulseFill, RiCapsuleFill } from "react-icons/ri";

import logo from "~/../public/400JpgdpiLogoCropped.jpg";
import main from "~/../public/water-home-unsplash.jpg";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Affiliated Court Services</title>
        <meta name="description" content="Affiliated Court Services Management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col h-full">
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
              <Link href="/services" className="border border-purple-950 text-white bg-amber-500 p-2 rounded-xl text-2xl font-extrabold shadow-lg shadow-black hover:shadow-md hover:shadow-black hover:scale-105 [text-shadow:_0_2px_0_rgb(0_0_0_/_80%)]" passHref>See our client services</Link>
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
        <section className="h-full w-full flex flex-col relative overflow-hidden">
          <div className="h-[75vh]">
            <p className="absolute left-1/4 top-40 text-4xl font-serif font-light text-purple-900 [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">Welcome to Affiliated Court Services</p>
            <p className="absolute left-1/4 top-52 text-3xl font-serif font-thin translate-x-6 text-purple-950 [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">Your Journey to Well Being Starts Here</p>
            <Image
              src={main}
              alt="water"
              className="w-full object-contain min-h-0"
            /> 
            <div className="absolute left-52 bottom-16 z-50">
              <SignedIn>
                <Link href='/signInRedirect' className="border-2 border-purple-950 text-purple-950 bg-transparent p-8 rounded-xl text-xl font-extrabold shadow-lg shadow-purple-950 hover:shadow-md hover:shadow-black hover:bg-purple-950 hover:text-slate-100 [text-shadow:_0_1px_0_rgb(0_0_0_/_30%)]" passHref>Take me to my account!</Link>
              </SignedIn>
              <SignedOut>
                <SignInButton mode='modal'>
                  <button className="border-4 border-purple-950 text-purple-950 bg-transparent p-8 rounded-2xl text-xl font-extrabold shadow-lg shadow-purple-950 hover:shadow-md hover:shadow-black hover:bg-purple-950 hover:text-slate-100 hover:scale-110 [text-shadow:_0_1px_0_rgb(0_0_0_/_30%)]">
                    Get Started
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </section>
        <section className="pl-32 bg-gradient-to-b from-purple-950 to-purple-500 w-full text-slate-100 shadow-inner shadow-slate-800">
          <div className="flex justify-evenly p-10 text-slate-100 text-lg">
            <div className="-translate-x-16">
              <div><RiGovernmentFill size='1.8rem' className="text-slate-100 inline mr-3 -translate-y-1" />Comprehensive Court-Approved Evaluations</div>
              <div><RiCapsuleFill size='1.8rem' className="text-slate-100 inline mr-3 -translate-y-1" />Substance Use Disorder Group Therapy Sessions</div>
              <div><RiHeartPulseFill size='1.8rem' className="text-slate-100 inline mr-3 -translate-y-1" />Domestic Violence Group Therapy Sessions</div>
              <div><RiCreativeCommonsByFill size='1.8rem' className="text-slate-100 inline mr-3 -translate-y-1" />Individual Therapy Sessions</div>
              <div><RiStore3Fill size='1.8rem' className="text-slate-100 inline mr-3 -translate-y-1" />Diversion Workshops</div>
            </div>
            <div className="translate-x-8">
              <p>Founded by <span className="font-serif">Lujean Marshall</span></p>
              <p>Over 30 years of experience</p>
              <p>801-888-8888</p>
              <p>info@affiliatedcourtservices.org</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
