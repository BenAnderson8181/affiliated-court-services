import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import HomeButton from "~/components/MainHomeButton";

import logo from "~/../public/400JpgdpiLogoCropped.jpg";

const Resources: NextPage = () => {
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
                      <Link href="/services" className="border border-purple-950 text-white bg-amber-500 p-2 rounded-xl text-2xl font-extrabold shadow-lg shadow-black hover:shadow-md hover:shadow-black hover:scale-105 [text-shadow:_0_2px_0_rgb(0_0_0_/_80%)]" passHref>See our client services</Link>
                  </div>
              </div>
          </section>
          <section className="fixed w-32 bg-violet-100 left-0 h-full text-purple-950 top-20 pt-10 text-xl shadow-2xl shadow-purple-950 z-20 font-bold">
              <div className="pb-3 flex justify-center px-3 border-b border-purple-950"><HomeButton /></div>
              <div className="pt-3 px-3"><Link href='about-us' passHref>About Us</Link></div>
              <div className="px-3"><Link href='/services' passHref>Services</Link></div>
              <div className="px-3"><Link href='/resources' passHref>Resoures</Link></div>
              <div className="px-3"><Link href='/signInRedirect' passHref>Account</Link></div>
              <div className="px-3"><Link href='/calendar' passHref>Calendar</Link></div>
              <div className="px-3"><Link href='/account/search' passHref>Search</Link></div>
          </section>
          <section className="h-full w-full flex flex-col relative overflow-hidden text-slate-900 pl-48 pr-16 items-center pt-36">
            Resources
          </section>
        </main>
      </>
    )
}

export default Resources;