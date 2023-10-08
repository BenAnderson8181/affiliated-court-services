import { UserButton } from "@clerk/nextjs";
import type { NextPage } from "next";
import Link from "next/link";
import { RiCalendarCheckFill } from "react-icons/ri";

const Header: NextPage = (props) => {
    console.log('Header Props: ', props)
    return (
        <div className="h-32 w-full p-6 flex justify-between opacity-80 border-b-2 border-indigo-950">
            <div className="flex items-center">
                <h1 className="text-2xl font-thin">Menu</h1>
                <div className="ml-5 cursor-pointer hover:scale-110"><Link href='/calendar' passHref><RiCalendarCheckFill size={50}/></Link></div>
            </div>
            <div className="flex justify-start -translate-x-16">
                <h1 className="text-2xl font-thin">Logo</h1>
            </div>
            <div className="flex items-center">
                <UserButton />
            </div>
        </div>
    )
}

export default Header;