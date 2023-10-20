import Link from "next/link";
import { RiHome4Line } from "react-icons/ri";

const HomeButton = () => {
    return (
        <Link href='/' passHref><RiHome4Line size={50} className="purple-950" /></Link>
    )
}

export default HomeButton;