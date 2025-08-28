"use client";
import Pagination from "@/components/layout/Pagination";
import LoadingScreen from "@/components/ui/LoadingScreen";
import RolesList from "@/components/ui/RolesList";
import { api } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/session-hooks";
// chỉnh path đúng file hook của bạn

type RoleDraft = {
  name: string;
  description: string;
  isActive: boolean;
  permissions: string[]; // mảng _id quyền
};

const DEFAULT_DRAFT: RoleDraft = {
  name: "user",
  description: "Normal user stuff",
  isActive: true,
  permissions: [],
};

export default function RolesUI() {
  const router = useRouter();

  // --- form nháp: lưu vào sessionStorage ---
  const [draft, setDraft, clearDraft] = useSession<RoleDraft>(
    "role_form",
    DEFAULT_DRAFT
  );
  const updateDraft = (patch: Partial<RoleDraft>) =>
    setDraft((prev: RoleDraft) => ({ ...prev, ...patch }));

  // --- data list roles ---
  const [params, setParams] = useState({ current: 1, pageSize: 10 });
  const { data: roles, isLoading } = useQuery({
    queryKey: ["roles", params],
    queryFn: async () => {
      const resData = (await api.get("/api/roles", { params })).data;
      return resData.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[100vh] flex justify-center items-center">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Danh sách roles</h1>

      {/* ===== Form nháp Role (lưu session) ===== */}
      <section className="rounded-xl border bg-background p-4 md:p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base md:text-lg font-semibold">
            Tạo/Sửa Role (nháp)
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                clearDraft(); // xoá khỏi sessionStorage
                setDraft(DEFAULT_DRAFT); // reset state hiện tại
              }}
              className="text-sm rounded-lg border px-3 py-1.5 hover:bg-muted"
            >
              Xoá nháp
            </button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {/* name */}
          <label className="block">
            <span className="text-sm">Tên vai trò</span>
            <input
              className="mt-1 w-full rounded-lg border bg-background p-2"
              placeholder="Ví dụ: admin, manager…"
              value={draft.name}
              onChange={(e) => updateDraft({ name: e.target.value })}
            />
          </label>

          {/* isActive */}
          <label className="block">
            <span className="text-sm">Trạng thái</span>
            <div className="mt-1 flex items-center gap-3">
              <input
                id="active"
                type="checkbox"
                checked={draft.isActive}
                onChange={(e) => updateDraft({ isActive: e.target.checked })}
              />
              <label htmlFor="active" className="text-sm">
                Hoạt động
              </label>
            </div>
          </label>

          {/* description – full width */}
          <label className="block md:col-span-2">
            <span className="text-sm">Mô tả</span>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-lg border bg-background p-2"
              placeholder="Mô tả ngắn về vai trò này…"
              value={draft.description}
              onChange={(e) => updateDraft({ description: e.target.value })}
            />
          </label>

          {/* permissions – chỉ 1 field + nút redirect */}
          <div className="md:col-span-2 flex items-center justify-between rounded-lg border p-3">
            <div className="text-sm">
              <div className="font-medium">Permissions</div>
              <div className="text-muted-foreground">
                Đã chọn: <b>{draft.permissions.length}</b>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                // mang theo danh sách id đang chọn để bên /dashboard/permissions check sẵn
                const qs = encodeURIComponent(
                  JSON.stringify(draft.permissions)
                );
                router.push(`/dashboard/permissions?permissions=${qs}`);
              }}
              className="rounded-lg bg-primary-dark/80 hover:bg-primary-dark text-white px-3 py-2 text-sm"
            >
              Chọn quyền
            </button>
          </div>
        </div>
      </section>
      {/* ===== /Form nháp ===== */}

      {/* List roles */}
      <div className="md:px-10">
        <RolesList roles={roles.result} />
      </div>

      {/* Pagination */}
      <div>
        <Pagination
          current={roles.meta.current}
          limit={roles.meta.pageSize}
          setParams={setParams}
          totalItems={roles.meta.total}
          totalPage={roles.meta.pages}
        />
      </div>
    </div>
  );
}
