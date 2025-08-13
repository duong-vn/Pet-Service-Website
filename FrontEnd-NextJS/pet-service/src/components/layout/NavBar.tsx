"use client";
import Link from "next/link";
import ThemeToggle from "../ui/ThemeToggle";
import { useEffect, useRef, useState } from "react";
import UserPill from "./UserPill";
import SidebarBtn from "../ui/SidebarBtn";
import { useSidebar } from "@/context/SidebarContext";
import {
  FaHome,
  FaUser,
  FaShoppingCart,
  FaCog,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import { MdHomeRepairService } from "react-icons/md";
export default function NavBar() {
  const { toggle } = useSidebar();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        const y = window.scrollY;
        window.requestAnimationFrame(() => {
          const delta = 6;

          const isNearTop = y < 10;
          const goingDown = y - lastY.current > delta;
          const goingUp = lastY.current - y > 3 * delta;
          if (goingDown && !isNearTop) {
            setHidden(true);
          } else if (isNearTop || goingUp) {
            setHidden(false);
          }
          console.log(
            "y",
            y,
            "isNearTop",
            isNearTop,
            "goingUp",
            goingUp,
            "goingDown",
            goingDown,
            "lastY",
            lastY
          );

          lastY.current = y;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={[
        " w-full top-0 z-10 sticky ",
        "transition-transform duration-500 ease-out will-change-transform",
        hidden ? "-translate-y-[calc(100%+1.5rem)] " : "-translate-y-0 ",
      ].join(" ")}
    >
      <nav className=" pl-1 container  pt-3  2xl:mx-auto  max-w-screen-2xl flex  items-center  ">
        <div
          className=" p-3 flex flex-1  items-center justify-between rounded-3xl   line-height-1
             shadow-lg ring-1 ring-black/30 backdrop-blur-2xl dark:bg-secondary-dark/50 bg-secondary-light/30 dark:ring-white/330
          "
        >
          <Link className="text-3xl font-display " href="/">
            ZOZO
          </Link>

          <Link href="" className="hidden xl:flex ">
            <MdHomeRepairService className="w-10 h-10 " />
          </Link>
          <Link href="/view " className="hidden xl:flex ">
            {" "}
            <FaCalendarDays className="w-7 h-7 " />
          </Link>
          <Link href="/shop" className="hidden xl:flex ">
            <FaShoppingCart className="w-7 h-7  " />
          </Link>

          <ThemeToggle />
        </div>
        {/* User info appear on nav bar when on pc */}
        <span className="ml-3 hidden ">
          <UserPill />
        </span>
        {/* Hamburger for mobile */}
        <div
          className="mx-2 flex-shrink-0 flex xl:hiddsen "
          onClick={() => toggle()}
        >
          <SidebarBtn />
        </div>{" "}
        {/* Hamburger for mobile */}
        {/* User  */}
      </nav>
    </header>
  );
}
