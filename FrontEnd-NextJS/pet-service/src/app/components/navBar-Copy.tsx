// components/NavBar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "#features", label: "Tính năng" },
  { href: "#pricing", label: "Giá" },
  { href: "#faq", label: "FAQ" },
];

export default function NavBars() {
  const [open, setOpen] = useState(false);

  // khóa scroll khi mở menu mobile
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky inset-x-0 top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mt-3 mb-3 flex items-center justify-between rounded-2xl bg-white/70 p-3 shadow-sm ring-1 ring-black/5 backdrop-blur dark:bg-neutral-900/70 dark:ring-white/10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 select-none">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400" />
            <span className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              PetCare
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <NavItem key={href} href={href}>
                {label}
              </NavItem>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href="#get-started"
              className="hidden md:inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium ring-1 ring-indigo-500/20 transition
                         hover:shadow-lg hover:shadow-indigo-500/20
                         bg-indigo-600 text-white hover:bg-indigo-500
                         dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              Bắt đầu
            </Link>

            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-black/10 transition
                         hover:bg-black/5 dark:ring-white/10 dark:hover:bg-white/5 md:hidden`}
            >
              {/* Icon hamburger -> X */}
              <span className="sr-only">Open menu</span>
              <span
                className={`block h-0.5 w-5 origin-center transition-all duration-300
                           bg-neutral-900 dark:bg-neutral-100
                           ${open ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 transition-all duration-300
                           bg-neutral-900 dark:bg-neutral-100
                           ${open ? "opacity-0" : "opacity-100"} `}
              />
              <span
                className={`block h-0.5 w-5 origin-center transition-all duration-300
                           bg-neutral-900 dark:bg-neutral-100
                           ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300
                    ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="mx-4 -mt-2 rounded-2xl bg-white/80 p-2 shadow ring-1 ring-black/5 backdrop-blur dark:bg-neutral-900/80 dark:ring-white/10">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-neutral-800 transition hover:bg-black/5 dark:text-neutral-100 dark:hover:bg-white/5"
            >
              <span>{label}</span>
              {/* Mũi tên trượt vào */}
              <span className="translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                →
              </span>
            </Link>
          ))}
          <Link
            href="#get-started"
            onClick={() => setOpen(false)}
            className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            Bắt đầu
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group relative rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
    >
      <span>{children}</span>
      {/* Underline trượt */}
      <span
        className="pointer-events-none absolute inset-x-2 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-indigo-500 to-cyan-400 transition-transform duration-300 group-hover:scale-x-100"
        aria-hidden="true"
      />
    </Link>
  );
}
