"use client";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  return (
    <header className=" bg-amber-700 dark:bg-amber-400  sticky top-0 z-10">
      <nav className="  mx-auto max-w-7xl px-4 md:px-6 mt-5">
        <div
          className=" border mt-3 mb-3 flex items-center justify-between rounded-2xl  bg-white/70
            p-3 shadow-sm ring-1 ring-black/5 backdrop-blur-2xl dark:bg-amber-600 dark:ring-white/70
        "
        >
          <Link href="/">logo</Link>

          <div className="">
            <Link href="">item</Link>
            <Link href="">item</Link>
            <Link href="">item</Link>
          </div>

          <div>
            <Link href="">hambergur</Link>
            <ThemeToggle />
            <button>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>
      <div className="md:hidden">
        <Link href="">item</Link>
        <Link href="">item</Link>
        <Link href="">item</Link>
      </div>
    </header>
  );
}
