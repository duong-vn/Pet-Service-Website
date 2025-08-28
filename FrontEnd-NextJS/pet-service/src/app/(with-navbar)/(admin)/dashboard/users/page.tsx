"use client";

import Pagination from "@/components/layout/Pagination";
import LoadingScreen from "@/components/ui/LoadingScreen";
import UsersList from "@/components/ui/UsersList";
import { api } from "@/utils/axiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/hooks/session-hooks";
import { useAppSelector } from "@/hooks/redux-hooks";
import { useModal } from "@/hooks/modal-hooks";
import { toast } from "sonner";
import { handleError } from "@/apiServices/services";
import ConfirmModal from "@/components/ui/ConfirmModal";
import DeleteModal from "@/components/ui/DeleteModal";

type UserDraft = {
  _id: string | null;
  name: string;
  email: string;
  provider: string;
  password: string;
  public_id?: string;
  picture?: string;
  address?: string;
  age?: number;
  phone?: string;
  roles: string[];
  isActive?: boolean;
};

const DEFAULT_DRAFT: UserDraft = {
  _id: null,
  name: "",
  email: "",
  provider: "local",
  password: "",
  roles: [],
  isActive: true,
};

export default function UsersUI() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { modal, open, close } = useModal();
  const qc = useQueryClient();

  const [draft, setDraft, clearDraft] = useSession<UserDraft>(
    "user_form",
    DEFAULT_DRAFT
  );
  const userPermissions = useAppSelector((s) => s.auth.user?.permissions);

  const updateDraft = (patch: Partial<UserDraft>) =>
    setDraft((prev) => ({ ...prev, ...patch }));

  const [params, setParams] = useState({ current: 1, pageSize: 10 });

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const resData = (await api.get("/api/users", { params })).data;
      return resData.data;
    },
  });
  console.log(users);

  useEffect(() => {
    const raw = searchParams.get("roles");
    if (raw) {
      try {
        const roles = JSON.parse(decodeURIComponent(raw));
        setDraft((prev: UserDraft) => ({
          ...prev,
          roles: Array.isArray(roles) ? roles : [roles],
        }));
      } catch (e) {}
    }
    const _id = searchParams.get("_id");
    if (_id) setDraft((prev: UserDraft) => ({ ...prev, _id }));
  }, [searchParams]);

  const onConfirm = async () => {
    try {
      await api.post("/api/users", draft);
      toast.success("Tạo user thành công");
      qc.invalidateQueries({ queryKey: ["users"] });
      clearDraft();
      setDraft(DEFAULT_DRAFT as any);
      close();
    } catch (err) {
      handleError(err);
    }
  };

  const onUpdate = async () => {
    try {
      if (!draft._id) return toast.error("Missing id");
      await api.patch("/api/users/" + draft._id, draft);
      toast.success("Cập nhật user thành công");
      qc.invalidateQueries({ queryKey: ["users"] });
      clearDraft();
      setDraft(DEFAULT_DRAFT as any);
      close();
    } catch (err) {
      handleError(err);
    }
  };

  const onDelete = async (_id: string) => {
    try {
      await api.delete("/api/users/" + _id);
      toast.success("Xóa user thành công");
      qc.invalidateQueries({ queryKey: ["users"] });
      close();
    } catch (err) {
      handleError(err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <LoadingScreen />
      </div>
    );
  }

  const isUpdate = !!draft._id;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Danh sách người dùng</h1>

      <section className="rounded-xl border bg-background p-4 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 grid grid-cols-3 gap-3 items-center">
            <input
              placeholder="Tên"
              className="p-2 rounded-lg border"
              value={draft.name}
              onChange={(e) => updateDraft({ name: e.target.value })}
            />
            <input
              placeholder="Email"
              className="p-2 rounded-lg border"
              value={draft.email}
              onChange={(e) => updateDraft({ email: e.target.value })}
            />
            <div className="flex items-center">
              <div className="flex-1">
                <div className="text-sm mb-1">Vai trò</div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">
                    {draft.roles.length} đã chọn
                  </div>
                  <button
                    onClick={() => {
                      const qs = encodeURIComponent(
                        JSON.stringify(draft.roles)
                      );
                      router.push(
                        `/dashboard/roles?roles=${qs}&next=/dashboard/users`
                      );
                    }}
                    className="px-3 py-1 bg-primary-light/80 rounded text-white text-sm"
                  >
                    Chọn role
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                clearDraft();
                setDraft(DEFAULT_DRAFT as any);
              }}
              className="px-3 py-1 rounded border"
            >
              Xóa nháp
            </button>

            {isUpdate ? (
              <button
                onClick={() =>
                  open({ type: "update-modal", payload: onUpdate })
                }
                className="px-3 py-1 rounded bg-primary-light text-white"
              >
                Cập nhật
              </button>
            ) : (
              <button
                onClick={() =>
                  open({ type: "update-modal", payload: onConfirm })
                }
                className="px-3 py-1 rounded bg-primary-light text-white"
              >
                Tạo mới
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="md:px-10">
        <UsersList
          users={users?.result ?? []}
          setDraft={updateDraft}
          onDelete={onDelete}
          permissions={userPermissions}
          open={open}
        />
      </div>

      <div className="pb-2">
        <Pagination
          current={users?.meta?.current ?? 1}
          limit={users?.meta?.pageSize ?? 10}
          setParams={setParams}
          totalItems={users?.meta?.total ?? 0}
          totalPage={users?.meta?.pages ?? 0}
        />
      </div>

      {modal.type === "update-modal" && (
        <ConfirmModal
          onClose={close}
          onConfirm={modal.payload}
          message="Bạn có chắc chắn?"
          smallInfo="Tạo/Cập nhật user"
        />
      )}
      {modal.type === "delete-modal" && (
        <DeleteModal onClose={close} onConfirm={onDelete} _id={modal._id} />
      )}
    </div>
  );
}
