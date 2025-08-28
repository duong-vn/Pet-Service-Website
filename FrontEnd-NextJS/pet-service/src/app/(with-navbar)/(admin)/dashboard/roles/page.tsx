"use client";
import Pagination from "@/components/layout/Pagination";
import LoadingScreen from "@/components/ui/LoadingScreen";
import RolesList from "@/components/ui/RolesList";
import { api } from "@/utils/axiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/hooks/session-hooks";
import { can } from "@/lib/authSlice";
import { useAppSelector } from "@/hooks/redux-hooks";
import { PERMISSIONS } from "@/types/permissions";
import { useModal } from "@/hooks/modal-hooks";
import { toast } from "sonner";
import { patchRoles, postRoles } from "@/apiServices/roles/services";
import ConfirmModal from "@/components/ui/ConfirmModal";
import DeleteModal from "@/components/ui/DeleteModal";
import { handleError } from "@/apiServices/services";

type RoleDraft = {
  _id: string | null;
  name: string;
  description: string;
  isActive: boolean;
  permissions: string[];
};

const DEFAULT_DRAFT: RoleDraft = {
  _id: null,
  name: "user",
  description: "Người dùng cơ bản, có các quyền sẵn có trong server",
  isActive: true,
  permissions: [],
};

export default function RolesUI() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { modal, open, close } = useModal();
  const [, rerender] = useState(0);

  const [draft, setDraft, clearDraft] = useSession<RoleDraft>(
    "role_form",
    DEFAULT_DRAFT
  );
  const qc = useQueryClient();
  const userPermissions = useAppSelector((s) => s.auth.user?.permissions);

  const updateDraft = (patch: Partial<RoleDraft>) =>
    setDraft((prev: RoleDraft) => ({ ...prev, ...patch }));

  const [params, setParams] = useState({ current: 1, pageSize: 10 });

  const { data: roles, isLoading } = useQuery({
    queryKey: ["roles", params],
    queryFn: async () => {
      const resData = (await api.get("/api/roles", { params })).data;
      return resData.data;
    },
  });
  const isUpdate = useMemo(() => !!draft._id, [draft._id]);

  useEffect(() => {
    const permissions = JSON.parse(
      searchParams.get("permissions") ?? JSON.stringify(draft.permissions)
    );
    setDraft((prev: RoleDraft) => ({ ...prev, permissions }));
    // const _id = searchParams.get("_id") ?? draft._id;
    // setDraft((prev: RoleDraft) => ({ ...prev, _id }));
  }, [searchParams]);

  const onUpdate = async () => {
    const { _id } = draft;
    if (!_id || _id.length < 1) {
      toast.error("Không có id sao cập nhật được");
      // clearDraft();
    }

    const res = await patchRoles(draft as any);
    if (res) {
      toast.success("Cập nhật thành công!");
      qc.invalidateQueries({ queryKey: ["roles"] });
      updateDraft(DEFAULT_DRAFT);
      clearDraft();
    } else toast.error("Có lỗi hiện không cập nhật được");

    close();
  };

  const onConfirm = async () => {
    const res = await postRoles(draft as any);
    if (res) {
      toast.success("Tạo thành công!");
      qc.invalidateQueries({ queryKey: ["roles"] });
      updateDraft(DEFAULT_DRAFT);
      clearDraft();
    } else toast.error("Có lỗi hiện không Tạo được được");

    close();
  };

  const onDelete = async (_id: string) => {
    try {
      const res = await api.delete("/api/roles/" + _id);
      toast.success("Xóa thành công");
      qc.invalidateQueries({ queryKey: ["roles"] });
      close();
    } catch (error) {
      handleError(error);
      return;
    }
  };

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

      {/* form */}
      <section className="rounded-xl border bg-background p-4 md:p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base md:text-lg font-semibold">
            Tạo/Sửa Role (nháp)
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                clearDraft();
                setDraft(DEFAULT_DRAFT);
              }}
              className="text-sm rounded-lg border px-3 py-1.5 hover:bg-muted"
            >
              Xoá nháp
            </button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {/* name */}
          <div className="flex gap-3 items-center w-full">
            {" "}
            <label className="flex-1">
              <div className="text-sm">Tên vai trò</div>
              <input
                className="mt-1 w-full rounded-lg flex items-center  border border-secondary-dark dark:border-primary-light bg-background p-2"
                placeholder="Ví dụ: admin, manager…"
                value={draft.name}
                onChange={(e) => updateDraft({ name: e.target.value })}
              />
            </label>
            <div className="flex flex-col">
              <label className="font-medium">Permissions</label>
              <div className="text-muted-foreground p-1 gap-2 items-center border border-secondary-dark dark:border-primary-light rounded-full flex justify-between">
                <b> Đã chọn: {draft.permissions.length}</b>
                <button
                  type="button"
                  onClick={() => {
                    // mang theo danh sách id đang chọn để bên /dashboard/permissions check sẵn
                    const qs = encodeURIComponent(
                      JSON.stringify(draft.permissions)
                    );
                    const next = encodeURIComponent(
                      "/dashboard/roles?_id=" + draft._id
                    );
                    router.push(
                      `/dashboard/permissions?permissions=${qs}&next=${next}`
                    );
                  }}
                  className="rounded-full bg-primary-dark/80 hover:bg-primary-dark text-white px-2 py-2 text-sm"
                >
                  Chọn quyền
                </button>
              </div>
            </div>
          </div>

          {/* description – full width */}
          <label className="block ">
            <span className="text-sm">Mô tả</span>
            <textarea
              rows={3}
              className="mt-1 w-full dark:border-primary-light border-secondary-dark rounded-lg border bg-background p-2"
              placeholder="Mô tả ngắn về vai trò này…"
              value={draft.description}
              onChange={(e) => updateDraft({ description: e.target.value })}
            />
          </label>

          {/* isActive */}
          <div className="md:col-span-2 flex justify-between">
            <label className="">
              <div className="text-sm">Trạng thái</div>
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

            {isUpdate
              ? can(userPermissions, PERMISSIONS.ROLES_PATCH) && (
                  <button
                    onClick={() => {
                      open({ type: "update-modal", payload: onUpdate });
                    }}
                    className="border rounded-xl hover:scale-105 transition-transform will-change-transform py-1 px-2 border-secondary-dark dark:border-primary-light bg-primary-light/80 hover:bg-primary-light dark:bg-primary-dark dark:hover:bg-primary-dark/80"
                  >
                    Cập nhật
                  </button>
                )
              : can(userPermissions, PERMISSIONS.ROLES_POST) && (
                  <button
                    onClick={() => {
                      open({ type: "update-modal", payload: onConfirm });
                    }}
                    className="border py-1 rounded-xl px-2 hover:scale-105 transition-transform will-change-transform border-secondary-dark dark:border-primary-light bg-primary-light/80 hover:bg-primary-light dark:bg-primary-dark dark:hover:bg-primary-dark/80"
                  >
                    Tạo mới
                  </button>
                )}
          </div>
        </div>
      </section>

      {/* List roles */}
      <div className="md:px-10">
        <RolesList
          roles={roles.result}
          setDraft={updateDraft}
          onDelete={onDelete}
          permissions={userPermissions}
          open={open}
        />
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
      {modal.type === "update-modal" && (
        <ConfirmModal
          onClose={close}
          onConfirm={modal.payload}
          message="Bạn có chắc chắn với quyết định của bạn không?"
          smallInfo="Tạo/cập nhật vai trò"
        />
      )}
      {modal.type === "delete-modal" && (
        <DeleteModal onClose={close} onConfirm={onDelete} _id={modal._id} />
      )}
    </div>
  );
}
