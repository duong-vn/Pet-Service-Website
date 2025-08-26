"use client";
import Link from "next/link";
import { useAppSelector } from "@/hooks/redux-hooks";
import { can } from "@/lib/authSlice";
import { PERMISSIONS } from "@/types/permissions";

export default function AdminSidebar() {
  const permissions = useAppSelector((s) => s.auth.user?.permissions);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-black/10 dark:border-white/10 bg-white/90 dark:bg-white/5 backdrop-blur px-4 py-6">
      <div className="mb-6 px-2">
        <h2 className="text-lg font-semibold">Bảng điều khiển</h2>
        <p className="text-xs text-black/60 dark:text-white/60">
          Quản trị hệ thống
        </p>
      </div>

      <nav className="space-y-1">
        {/* Appointments luôn hiện */}
        <Link
          href="/dashboard"
          className="block rounded-xl px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 border border-transparent hover:border-black/10 dark:hover:border-white/10"
        >
          Lịch hẹn
        </Link>

        {/* Users */}
        {(can(permissions, PERMISSIONS.USERS_GET) ||
          can(permissions, PERMISSIONS.USERS_POST) ||
          can(permissions, PERMISSIONS.USERS_PATCH) ||
          can(permissions, PERMISSIONS.USERS_DELETE)) && (
          <Link
            href="/dashboard/users"
            className="block rounded-xl px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 border border-transparent hover:border-black/10 dark:hover:border-white/10"
          >
            Người dùng
          </Link>
        )}

        {/* Roles */}
        {(can(permissions, PERMISSIONS.ROLES_GET) ||
          can(permissions, PERMISSIONS.ROLES_POST) ||
          can(permissions, PERMISSIONS.ROLES_PATCH) ||
          can(permissions, PERMISSIONS.ROLES_DELETE)) && (
          <Link
            href="/dashboard/users"
            className="block rounded-xl px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 border border-transparent hover:border-black/10 dark:hover:border-white/10"
          >
            Vai trò
          </Link>
        )}

        {/* Permissions */}
        {(can(permissions, PERMISSIONS.PERMISSIONS_GET) ||
          can(permissions, PERMISSIONS.PERMISSIONS_POST) ||
          can(permissions, PERMISSIONS.PERMISSIONS_PATCH) ||
          can(permissions, PERMISSIONS.PERMISSIONS_DELETE)) && (
          <Link
            href="/dashboard/permissions"
            className="block rounded-xl px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 border border-transparent hover:border-black/10 dark:hover:border-white/10"
          >
            Quyền hạn
          </Link>
        )}
      </nav>
    </aside>
  );
}
