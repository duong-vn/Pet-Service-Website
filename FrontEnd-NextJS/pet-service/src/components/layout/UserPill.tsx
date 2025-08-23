"use client";
import { useRef } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { RootState } from "@/store/store";
import { simpleInfoSelector } from "@/lib/authSlice";
import { FaPencilAlt } from "react-icons/fa";

export default function UserPill() {
  const router = useRouter();

  const user = useAppSelector(simpleInfoSelector);
  console.log(user);

 

  if (!user.authenticated) {
    return (
      <div className="flex justify-center items-center gap-5 h-full w-full ">
        <div
          className="ring-2 rounded-xl dark:hover:bg-neutral-dark dark:text-black dark:bg-background-light dark:ring-white ring-black hover:scale-105 hover:bg-primary-dark transition-all cursor-pointer w-32 text-center p-2 bg-background-dark text-white "
          onClick={() => {
            router.push("/auth/login");
          }}
        >
          đăng nhập
        </div>{" "}
        <div
          className="ring-2  rounded-xl ring-background-dark w-32 text-center p-2 hover:bg-background-light/50 hover:scale-105 transition-all cursor-pointer"
          onClick={() => {
            router.push("/auth/register");
          }}
        >
          đăng kí
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center bg-secondary-light  dark:bg-secondary-dark pr-3 gap-3 ring-1 ring-black/50 dark:ring-white/30  max-w-[250]  p-2 rounded-full  ">
      <FaPencilAlt className="w-8 h-8 xl:hidden" />
      <div className="relative flex-shrink-0 group  ">
        <Image
          src={user.picture ?? "/images/placeholders/User.png"}
          alt="https://lh3.googleusercontent.com/a/ACg8ocLKCWmhPSmBY7_hz0SQWJVR2Wab9UwaxytIHfmCwVXMmIhH0g=s96-c"
          width={48}
          height={48}
          className="rounded-full object-cover  "
        />
        <div className="absolute top-0 border-1 bg-background-dark/50 rounded-full  opacity-0 group-hover:opacity-100  transition-opacity  w-12 h-12 ">
          <FaPencilAlt className="opacity-100 cursor-pointer  text-white  absolute top-1/2 -translate-y-1/2 right-1/2 translate-x-1/2 " />
        </div>
      </div>

      <div className="truncate ">
        {" "}
        <h6 className="font-medium  text-sm ">Hello, {user.name}.</h6>{" "}
        <p> {user.email}</p>
      </div>
      <div className=" absolute inset-0 group opacity-0 hover:opacity-100 hover:bg-black/30 rounded-full transition-all duration-300">
      <FaPencilAlt onClick={(e)=>{
e.stopPropagation()
router.push('/users/me')
      }} size={32} className="opacity-100 cursor-pointer text-white  absolute top-1/2 -translate-y-1/2 right-1/2 translate-x-1/2 " />

      </div>
    </div>
  );
}
