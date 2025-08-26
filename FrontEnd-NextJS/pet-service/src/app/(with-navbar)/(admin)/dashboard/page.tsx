"use client";
import Link from "next/link";
import { useAppSelector } from "@/hooks/redux-hooks";
import { can } from "@/lib/authSlice";
import { PERMISSIONS } from "@/types/permissions";
import { useQueries, useQuery } from "@tanstack/react-query";

export default function AdminDashboardPage() {
  const permissions = useAppSelector((s) => s.auth.user?.permissions);
  const {
    data: appointments,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["appointments"],
  });
  return (
    <div className="min-h-[60vh] max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6">
        Bảng điều khiển
      </h1>
      <p className="mb-6 text-black/70 dark:text-white/70">
        Truy cập nhanh các chức năng quản trị. Một số mục yêu cầu quyền tương
        ứng.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"></div>
    </div>
  );
}
