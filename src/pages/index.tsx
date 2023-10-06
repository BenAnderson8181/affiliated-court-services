import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Affiliated Court Services</title>
        <meta name="description" content="Affiliated Court Services Management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2]">
        <div>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode='modal'>
              <button className="rounded border border-gray-400 px-3 py-1 text-gray-400">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </main>
    </>
  );
};

export default Home;
