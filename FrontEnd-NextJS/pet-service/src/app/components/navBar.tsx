"use client";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  return (
    <header className=" sticky top-0 z-10 ">
      <nav className="  mx-auto max-w-7xl px-4 md:px-6 mt-5  left-0  absolute right-0 inline-block  ">
        <div
          className=" p-3  flex items-center justify-between rounded-2xl  bg-white/0 line-height-1
             shadow-lg ring-1 ring-black/30 backdrop-blur-2xl dark:bg-primary-dark bg-primary-light dark:ring-white/70
          "
        >
          <Link
            className="text-2xl font-semibold"
          href="/">ZOZO</Link>

          <div className="  hidden md:flex justify-between ">
            <Link href="">item</Link>
            <Link href="">item</Link>
            <Link href="">item</Link>
          </div>
            <div className="relative flex justify-end">
                <ThemeToggle />
                <div className="hidden md:inline-flex h-8 items-center">hamburgur</div>
                <button className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border">
                    <span className="sr-only">Open menu</span>
                    {/* icon 3 gạch */}
                </button>
            </div>





        </div>
          <span>
              <button className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6"
                  >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
              </button>
          </span>
      </nav>
      <div className="md:hidden">
        <Link href="">item</Link>
        <Link href="">item</Link>
        <Link href="">item</Link>
      </div>
    </header>
  );
}
