import Link from "next/link";

// Place this file as app/not-found.tsx (global) or app/segment/not-found.tsx (route-level)
// It will be shown when you call notFound() or when a resource is missing.
export default function NotFound() {
  return (
    <main className="min-h-[70vh] grid place-items-center p-6">
      <div className="text-center max-w-md">
        <div className="text-6xl font-extrabold tracking-tight">404</div>
        <h1 className="mt-2 text-2xl font-semibold">Không tìm thấy nội dung</h1>
        <p className="mt-2 text-gray-600">
          Trang bạn yêu cầu có thể đã bị xoá, đổi tên, hoặc tạm thời không khả
          dụng.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-4 h-10 inline-flex items-center justify-center rounded-xl border border-gray-300 hover:bg-gray-50 transition"
          >
            ← Về trang chủ
          </Link>
          <Link
            href="/services"
            className="px-4 h-10 inline-flex items-center justify-center rounded-xl bg-black text-white hover:opacity-90 transition"
          >
            Xem dịch vụ
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-500">Mã lỗi: 404</p>
      </div>
    </main>
  );
}
