"use client";

import { IUser } from "@/types/back-end";
import React from "react";
import { FaTrash, FaEdit, FaPencilAlt } from "react-icons/fa";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./context-menu";
import { can } from "@/lib/authSlice";
import { PERMISSIONS } from "@/types/permissions";
import { FaTrashCan } from "react-icons/fa6";

type Props = {
  users: IUser[];
  setDraft: (patch: Partial<any>) => void;
  onDelete: (id: string) => void;
  permissions: any;
  open: (opts: any) => void;
};

export default function UsersList({
  users,
  setDraft,
  onDelete,
  permissions,
  open,
}: Props) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-neutral-800">
          <tr className="text-left">
            <th className="px-4 py-3 text-sm font-semibold">Người dùng</th>
            <th className="px-4 py-3 text-sm font-semibold">Email</th>
            <th className="px-4 py-3 text-sm font-semibold">Vai trò</th>
            <th className="px-4 py-3 text-sm max-md:hidden font-semibold">
              Xác thực
            </th>
            <th className="px-4 py-3 text-sm  font-semibold"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
          {users.map((u: IUser) => {
            return (
              <tr
                key={u._id}
                className="hover:bg-gray-50 dark:hover:bg-neutral-800/40"
              >
                <td className="px-4 py-3">
                  <div className=" flex items-center gap-3">
                    <img
                      src={u?.picture ?? "/images/placeholders/User.png"}
                      alt={u.name}
                      className="w-10 h-10  rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium hidden md:flex">{u.name}</div>
                      <div className="text-xs hidden md:block text-muted-foreground">
                        Sđt: {u.phone ?? "-"} • Tuổi{u.age ?? "-"} tuổi • Giới
                        tính: {u.gender ?? "-"}
                      </div>
                      <div className="text-xs  hidden md:blocktext-muted-foreground">
                        địa chỉ: {u.address || "-"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4  overflow- py-3 text-sm text-muted-foreground">
                  <ContextMenu key={u._id}>
                    <ContextMenuTrigger>{u.email}</ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          open({
                            type: "delete-modal",
                            _id: u._id,
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
                        onClick={() => setDraft(u)}
                      >
                        {can(permissions, PERMISSIONS.USERS_PATCH) && (
                          <div className=" flex justify-center space-x-2 items-center">
                            <FaPencilAlt />
                            <span>Sửa</span>
                          </div>
                        )}
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {u?.role?.name ?? "Không có tên vai trò"}
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:block">
                  {/* emailVerifiedAt: only care if null or not */}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      u.emailVerifiedAt
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {u.emailVerifiedAt ? "Đã xác thực" : "Chưa"}
                  </span>
                </td>

                <td className="px-4 max-md:hidden py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setDraft(u);
                      }}
                      className="p-2 rounded hover:bg-muted"
                      title="Sửa"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => open({ type: "delete-modal", _id: u._id })}
                      className="p-2 rounded hover:bg-muted text-error"
                      title="Xóa"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
