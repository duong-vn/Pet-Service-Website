'use client'
import { useRef } from "react";
import Login from "../components/login";
import Image from "next/image";


export default function UserPill() {
    const user = useRef({
        email:'duong@gmail.com',
        name:'ok ok',
        avatar:'https://lh3.googleusercontent.com/a/ACg8ocLKCWmhPSmBY7_hz0SQWJVR2Wab9UwaxytIHfmCwVXMmIhH0g=s96-c'

    })


 
    return (
    <div className="flex items-center pr-3 gap-3 ring-1 ring-black/50 dark:ring-white/30  max-w-[400] w-fit p-2 rounded-full transition-all duration-1000 ease-out hover:max-w-fit"> 
   
        <Image
             src={user.current.avatar}
            alt='https://lh3.googleusercontent.com/a/ACg8ocLKCWmhPSmBY7_hz0SQWJVR2Wab9UwaxytIHfmCwVXMmIhH0g=s96-c'
             width={48}
      height={48}
      className="rounded-full object-cover flex-shrink-0 w-12 h-12" 

        />
       
            <div className="truncate">  <h6 className="font-medium  text-sm">Hello, {user.current.name}.</h6>    <p> {user.current.email}</p></div>

        
   
    </div>
    );
  }
  