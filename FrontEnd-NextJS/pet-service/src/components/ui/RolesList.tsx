import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./context-menu";
import { FaTrashCan } from "react-icons/fa6";
import { can } from "@/lib/authSlice";
import { PERMISSIONS } from "@/types/permissions";
import { FaPencilAlt } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";

type Role = {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  permissions: { _id: string; key: string }[];
  createdAt: string;
  updatedAt: string;
};

export default function RolesList({
  roles,
  setDraft,
  onDelete,
  open,
  permissions,
}: {
  roles: Role[];
  setDraft: (any: any) => void;
  onDelete: (_id: string) => void;
  open: any;
  permissions: any;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isUserChoosing = !!searchParams.get("role");
  if (!roles?.length) {
    return (
      <div className="rounded-xl border bg-background p-8 text-center text-sm text-muted-foreground">
        Chưa có vai trò nào.
      </div>
    );
  }

  return (
    <ul
      className="
        grid grid-cols-1 lg:grid-cols-2 gap-2
        rounded-xl border overflow-hidden
      "
    >
      {roles.map((role, i) => (
        <ContextMenu key={role._id}>
          <ContextMenuTrigger className="relative">
            <RoleRow role={role} />
            {isUserChoosing && (
              <div
                onClick={() => {
                  const url = searchParams.get("next");
                  const rolee = JSON.stringify({
                    _id: role._id,
                    name: role.name,
                  });
                  router.push(`${url}?role=${rolee}`);
                }}
                className="absolute hover:scale-125 transition-transform bg-primary-light/80 hover:bg-primary-light right-10 top-5 border rounded-3xl p-2 cursor-pointer dark:bg-primary-dark dark:hover:bg-primary-dark/80"
              >
                chọn
              </div>
            )}
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              className="cursor-pointer"
              onClick={() =>
                open({
                  type: "delete-modal",
                  _id: role._id,
                })
              }
            >
              {can(permissions, PERMISSIONS.SERVICES_DELETE) && (
                <div className=" flex justify-center space-x-2 items-center">
                  <FaTrashCan className=" text-error cursor-pointer" />
                  <span>Xóa</span>
                </div>
              )}
            </ContextMenuItem>
            <ContextMenuItem
              className="cursor-pointer"
              onClick={() => setDraft(role)}
            >
              {can(permissions, PERMISSIONS.SERVICES_PATCH) && (
                <div className=" flex justify-center space-x-2 items-center">
                  <FaPencilAlt />
                  <span>Sửa</span>
                </div>
              )}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </ul>
  );
}

function RoleRow({ role }: { role: Role }) {
  const statusClasses = role.isActive
    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
    : "bg-muted text-muted-foreground border-border";

  return (
    <li
      className={`
        p-4 sm:p-5
        bg-primary-light/40
        border-b
        lg:border-b
            rounded-2xl  
        hover:bg-muted/50 transition-colors
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold leading-6 truncate">
              {role.name}
            </h2>
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusClasses}`}
            >
              {role.isActive ? "Hoạt động" : "Ngưng"}
            </span>
          </div>

          {role.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {role.description}
            </p>
          )}

          <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>
              Tạo: {new Date(role.createdAt).toLocaleDateString("vi-VN")}
            </span>
            <span className="opacity-40">•</span>
            <span>
              Cập nhật: {new Date(role.updatedAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>

        {/* Khu action ở bên phải nếu cần (Xem quyền/Sửa/Xoá) */}
      </div>
    </li>
  );
}
