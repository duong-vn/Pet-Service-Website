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
  FaChevronUp,
} from "react-icons/fa";
import { GiDogHouse } from "react-icons/gi";
import { FaCalendarDays } from "react-icons/fa6";
import { MdHomeRepairService } from "react-icons/md";

export default function NavBar() {
  const { toggle } = useSidebar();
  const [hidden, setHidden] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const lastY = useRef(0);
  const iconClass = useRef(
    `transition-all duration-100 
    hover:p-3 
    hover:ring
     rounded-3xl
     dark:ring-background-light
      ring-background-dark
        
        `
  );
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
          if (isNearTop) {
            setScrolling(false);
          } else {
            setScrolling(true);
          }
          if (goingDown && !isNearTop) {
            setHidden(true);
          } else if (isNearTop || goingUp) {
            setHidden(false);
          }

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
        " w-full top-0 z-10 sticky  ",
        "transition-transform duration-500 ease-out will-change-transform ",
        hidden ? "-translate-y-[calc(100%+1.5rem)] " : "-translate-y-0 ",
      ].join(" ")}
    >
      <nav className=" pl-1 container  pt-3  2xl:mx-auto  max-w-screen-2xl flex justify-center items-center  ">
        <div
          className={[
            "  flex min-w-[250] max-h-[52] items-center justify-between rounded-3xl",
            "line-height-1  backdrop-blur-2xl",
            " transition-all duration-400",
            scrolling
              ? "  ring-1 shadow-lg  ring-black/30 dark:ring-white/30 xl:min-w-[400] bg-primary-light/15"
              : " bg-background-light-light dark:bg-primary-dark/50 xl:min-w-[800] ",
          ].join(" ")}
        >
          {/* House icon */}
          {scrolling ? (
            <div
              className={[
                "text-3xl p-3 font-display flex    ",
                iconClass.current,
              ].join(" ")}
              onClick={() => window.scrollTo(0, 0)}
            >
              <GiDogHouse />
            </div>
          ) : (
            <Link
              className={[
                "text-3xl p-3  font-display flex",
                iconClass.current,
                " ",
              ].join(" ")}
              href="/"
            >
              <GiDogHouse />
            </Link>
          )}

          {/* service icon */}
          <Link
            href=""
            className={[
              iconClass.current,
              "  ",
              "p-1 hidden hover:scale-110 ",
              scrolling ? " " : "xl:flex ",
            ].join(" ")}
          >
            <MdHomeRepairService className="w-10 h-10  " />
          </Link>
          {/* hide navbar icon */}
          <div
            onClick={() => setHidden(true)}
            className={[
              iconClass.current,
              "  ",
              "p-2  hover:scale-110 ",
              scrolling ? " flex " : " hidden",
            ].join(" ")}
          >
            <FaChevronUp className="w-10 h-10  " />
          </div>

          {/* calendar icon */}
          <Link
            href="/view "
            className={[
              iconClass.current,
              " ",
              "p-2 hidden hover:scale-110 ",
              scrolling ? " " : "xl:flex ",
            ].join(" ")}
          >
            {" "}
            <FaCalendarDays className="w-7 h-7 " />
          </Link>
          {/* shop icon */}
          <Link
            href="/shop"
            className={[
              iconClass.current,
              "  ",
              "hidden p-2  hover:scale-110 ",
              scrolling ? " " : "xl:flex ",
            ].join(" ")}
          >
            <FaShoppingCart className="w-7 h-7  " />
          </Link>
          {/* theme icon */}
          <div
            className={["flex cursor-pointer p-2  ", iconClass.current].join(
              " "
            )}
          >
            <ThemeToggle />
          </div>
        </div>

        {/* hamburger icon */}
        <div
          className={[
            "mx-2  hover:scale-110",
            scrolling ? "" : " absolute right-0",
          ].join(" ")}
          onClick={() => toggle()}
        >
          <SidebarBtn />
        </div>
      </nav>
    </header>
  );
}
