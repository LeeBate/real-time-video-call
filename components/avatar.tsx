import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

const Avatar = ({ src }: { src: string }) => {
    if(!src) {
        return (
            <FaUserCircle size={24} className="text-gray-400 rounded-full" />
        )
    }
  return (
    <Image src={src} alt="" className=" rounded-full" height={40} width={40} />
  );
};

export default Avatar;
