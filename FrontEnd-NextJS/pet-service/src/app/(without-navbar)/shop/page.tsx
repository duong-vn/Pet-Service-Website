"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ShopPage() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="text-center p-8 w-[90%] wmx-auto">
        {/* Icon hoặc Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto  bg-secondary-dark rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <h1 className="text-4xl md:text-6xl font-bold text-neutral-dark mb-4">
          Coming Soon
        </h1>

        <p className="text-xl md:text-2xl text-neutral-dark mb-6">
          Cửa hàng đang được phát triển{dots}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 border-2 border-secondary-dark text-neutral-dark    rounded-lg hover:bg-secondary-dark hover:text-white transition-all duration-300 font-semibold"
          >
            Về trang chủ
          </Link>
        </div>

        {/* Footer Note */}
        <p className="font-display  text-neutral-dark mt-8 ">
          Thank you for your patience! 🐾
        </p>
      </div>
    </div>
  );
}
