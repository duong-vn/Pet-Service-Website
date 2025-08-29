"use client";
import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen w-full bg-black text-white flex items-center justify-center p-6">
      <section className="relative mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <div className="p-8 md:p-10 text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-sm">
            {/* inline lock icon */}
            <svg
              aria-hidden
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white"
            >
              <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>

          {/* Heading */}
          <h1 className="text-center text-3xl md:text-4xl font-semibold tracking-tight text-white">
            403 · Không có quyền truy cập
          </h1>
          <p className="mt-3 text-center text-white/80">
            Bạn không có quyền truy cập tài nguyên này.
          </p>

          {/* Context */}

          {/* Actions */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              onClick={() =>
                typeof window !== "undefined" ? window.history.back() : null
              }
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10"
            >
              ← Go back
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-transparent bg-primary-light text-black px-4 py-2.5 text-sm font-semibold hover:opacity-90"
            >
              Home
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10"
            >
              Sign in
            </Link>
          </div>

          <p className="mt-6 text-center text-sm text-white/70">
            Nếu bạn nghĩ đây là nhầm lẫn, hãy liên hệ quản trị viên.
          </p>
        </div>
      </section>
    </main>
  );
}
