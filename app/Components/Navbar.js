"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center w-full justify-between h-[48px] gap-3 px-4 bg-yellow-500">
      <div className="text-white text-lg font-bold w-[40%] ">Admin Portal</div>
      <div className="flex justify-between w-[60%]">
        {session ? (
          <>
            <button
                onClick={() => signOut()}
                className="text-black py-2 bg-white rounded-lg hover:bg-gray-300 transition-colors w-[20%] sm:w-[10%] h-[40px] flex justify-center items-center"
              >
                Logout
              </button>
            <div className="flex items-center w-[30%] space-x-4">
              <div>{session.user.name}</div>
              <Image
                src={session.user.image}
                alt="User image icon"
                width={40}
                height={40} 
                className="border rounded-full"
              />
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => signIn()}
              className="text-black py-2 bg-white rounded-lg hover:bg-gray-300 transition-colors w-[20%] sm:w-[10%] h-[40px] flex justify-center items-center"
            >
              Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;