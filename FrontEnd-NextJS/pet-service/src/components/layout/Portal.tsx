"use client";
import { ReactNode, useEffect, useState } from "react";

export default function Portal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // if (mounted) document.body.classList.add("overflow-hidden");
    // else document.body.classList.remove("overflow-hidden");

    return () => document.body.classList.remove("overflow-hidden");
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-40"
        onClick={() => {
          setMounted(false);
        }}
      >
        <div
          className="fixed "
          onClick={(e) => {
            e.stopPropagation;
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
