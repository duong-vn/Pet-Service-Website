"use client";
import { useRef } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UserPill() {
  const route = useRouter();
  const user = useRef({
    email: "duong@gmail.com",
    name: "ok ok",
    avatar:
      "https://lh3.googleusercontent.com/a/ACg8ocLKCWmhPSmBY7_hz0SQWJVR2Wab9UwaxytIHfmCwVXMmIhH0g=s96-c",
  });

  const onclick = () => {
    route.push("/auth/login");
  };

  return (
    <div className="flex items-center bg-secondary-light dark:bg-secondary-dark pr-3 gap-3 ring-1 ring-black/50 dark:ring-white/30  max-w-[300]  p-2 rounded-full  hover:max-w-fit">
      <Image
        src={user.current.avatar}
        alt="https://lh3.googleusercontent.com/a/ACg8ocLKCWmhPSmBY7_hz0SQWJVR2Wab9UwaxytIHfmCwVXMmIhH0g=s96-c"
        width={48}
        height={48}
        className="rounded-full object-cover flex-shrink-0 w-12 h-12"
        onClick={onclick}
      />

      <div className="truncate">
        {" "}
        <h6 className="font-medium  text-sm">
          Hello, {user.current.name}.
        </h6>{" "}
        <p> {user.current.email}</p>
      </div>
    </div>
  );
}
