"use client";
import Link from "next/link";
import { useAppSelector } from "@/hooks/redux-hooks";
import { can } from "@/lib/authSlice";
import { PERMISSIONS } from "@/types/permissions";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

export default function AdminSidebar() {
  const permissions = useAppSelector((s) => s.auth.user?.permissions);
  const [open, setOpen] = useState(false);
  return (
    <>
      {" "}
      {!open && (
        <div
          className="fixed ml-2 hover:scale-105 will-change-transform cursor-pointer ring-black  transition-transform ring-transparent hover:ring-2 dark:ring-white rounded-full"
          onClick={() => setOpen(true)}
        >
          <MdKeyboardArrowRight size={40} />
        </div>
      )}
      <aside
        className={[
          !open ? "-translate-x-[calc(100%)]" : "translate-x-0",
          "fixed left-0 z-30  transition-transform duration-300 will-change-transform  w-64 rounded-e-3xl border-r border-black/10 dark:border-white/10 bg-white/90 dark:bg-white/5 backdrop-blur px-4 py-6",
        ].join(" ")}
      >
        <div className="mb-6 px-2 flex justify-between items-center">
          <div>
            {" "}
            <h2 className="text-lg font-semibold">Bảng điều khiển</h2>
            <p className="text-xs text-black/60 dark:text-white/60">
              Quản trị hệ thống
            </p>
          </div>
          {open && (
            <div
              className=" absolute -right-12 top-2 cursor-pointer hover:scale-105 dark:ring-white  ring-black transition-transform ring-transparent hover:ring-2  rounded-full

              "
              onClick={() => setOpen(false)}
            >
              <MdKeyboardArrowLeft className="" size={40} />
            </div>
          )}
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
    </>
  );
}
