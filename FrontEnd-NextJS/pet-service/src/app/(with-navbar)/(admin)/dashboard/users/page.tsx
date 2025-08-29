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
import { handleNumStringForForm } from "@/app/(with-navbar)/services/ServiceModal";
import { uploadToCloud } from "@/apiServices/cloud/services";
import { LuImagePlus } from "react-icons/lu";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

type UserDraft = {
  _id: string | null;
  name: string;
  email: string;
  provider: string;
  public_id?: string;
  picture?: string;
  address?: string;
  age?: number | string;
  phone?: string;
  role: {
    _id: string;
    name: string;
  };
  gender?: string;
  isActive?: boolean;
};

const DEFAULT_DRAFT: UserDraft = {
  _id: null,
  name: "",
  email: "",
  provider: "local",
  role: {
    _id: "68983db643ac6b12fbd53b9f",
    name: "user",
  },
  phone: "",
  gender: "",
  isActive: true,
};

export default function UsersUI() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { modal, open, close } = useModal();
  const qc = useQueryClient();
  const [file, setFile] = useState<File>();
  const [draft, setDraft, clearDraft] = useSession<UserDraft>(
    "user_form",
    DEFAULT_DRAFT
  );
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
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

  useEffect(() => {
    const raw = searchParams.get("role");
    if (raw) {
      try {
        const roles = JSON.parse(raw);
        setDraft((prev: UserDraft) => ({
          ...prev,
          role: roles,
        }));
      } catch (e) {}
    }
    const _id = searchParams.get("_id");
    if (_id) setDraft((prev: UserDraft) => ({ ...prev, _id }));
  }, [searchParams]);

  const onConfirm = async () => {
    let payload = {
      ...draft,
      password,
      emailVerifiedAt: new Date(),
      provider: "local",
    };
    try {
      if (file) {
        const res = await uploadToCloud("/images/users", file);

        if (!res) {
          return;
        }
        updateDraft({ picture: res.secure_url, public_id: res.public_id });
        payload = {
          ...payload,
          picture: res.secure_url,
          public_id: res.public_id,
        };
      }
      await api.post("/api/users", payload);
      toast.success("Tạo user thành công");
      qc.invalidateQueries({ queryKey: ["users"] });
      clearDraft();
      setPassword("");
      setDraft(DEFAULT_DRAFT as any);
      close();
    } catch (err) {
      handleError(err);
    }
  };

  const onUpdate = async () => {
    try {
      if (!draft._id) return toast.error("Missing id");
      let payload: Partial<UserDraft | any> = { ...draft, password: undefined };
      if (file) {
        const res = await uploadToCloud("images/users", file, draft.public_id);

        if (!res) {
          return;
        }
        updateDraft({ picture: res.secure_url, public_id: res.public_id });
        payload = {
          ...payload,
          picture: res.secure_url,
          public_id: res.public_id,
        };
      }

      if (password && password?.trim().length > 0) {
        payload.password = password?.trim();
      }

      await api.patch("/api/users/" + draft._id, payload);
      toast.success("Cập nhật user thành công");
      qc.invalidateQueries({ queryKey: ["users"] });
      clearDraft();
      setPassword("");
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
      setParams((prev) => ({ ...prev, current: 1 }));
      setPassword("");
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
    <div className="space-y-6 px-4">
      <h1 className="text-2xl  font-bold">Danh sách người dùng</h1>

      <section className="rounded-xl border bg-background p-4 md:p-6">
        <div className="flex items-center justify-between max-lg:flex-col gap-4">
          <div className="flex-1 grid grid-col-1  md:grid-cols-2 xl:grid-cols-3  gap-3 items-center">
            <div>
              <div className="flex gap-2">
                <input
                  placeholder="Tên"
                  className="p-2 rounded-lg border w-1/2 mb-2"
                  value={draft.name}
                  onChange={(e) => updateDraft({ name: e.target.value })}
                />
                <input
                  placeholder="Số điện thoại"
                  type="text"
                  className="p-2 rounded-lg border w-1/2 mb-2"
                  value={draft.phone}
                  onChange={(e) => {
                    updateDraft({ phone: handleNumStringForForm(e) });
                  }}
                />
              </div>
              <div className="flex gap-2">
                <input
                  placeholder="Tuổi"
                  type="text"
                  className="p-2 rounded-lg border w-1/2"
                  value={draft.age ?? ""}
                  onChange={(e) =>
                    updateDraft({
                      age: handleNumStringForForm(e),
                    })
                  }
                />
                <select
                  value={draft.gender ?? ""}
                  onChange={(e) => updateDraft({ gender: e.target.value })}
                  className="p-2 rounded-lg border w-1/2"
                >
                  <option value="">Giới tính</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>
            </div>

            <div>
              <input
                placeholder="Email"
                className="p-2 rounded-lg border w-full mb-2"
                value={draft.email}
                onChange={(e) => updateDraft({ email: e.target.value })}
              />
              <div className="relative">
                <input
                  placeholder="Mật khẩu"
                  type={showPassword ? "text" : "password"}
                  className="p-2 rounded-lg border w-full"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                {showPassword ? (
                  <FaEye
                    size={20}
                    className="absolute right-0 top-0 -translate-x-1/2 translate-y-1/2"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <FaEyeSlash
                    size={20}
                    className="absolute right-0 top-0 -translate-x-1/2 translate-y-1/2"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
            </div>

            <div className="flex md:col-span-2 xl:col-span-1 items-center gap-3">
              <div className="flex-1">
                <input
                  placeholder="Địa chỉ"
                  className="p-2 rounded-lg border w-full"
                  value={draft.address ?? ""}
                  onChange={(e) => updateDraft({ address: e.target.value })}
                />
                <div className="text-sm text-muted-foreground mt-2">
                  Vai trò: {draft.role?.name} đã chọn
                </div>
                <button
                  onClick={() => {
                    const qs = encodeURIComponent(JSON.stringify(draft.role));
                    router.push(
                      `/dashboard/roles?role=${qs}&next=/dashboard/users`
                    );
                  }}
                  className="mt-2 px-3 py-1 bg-primary-light/80 rounded text-white text-sm"
                >
                  Chọn role
                </button>
              </div>

              <div className="w-28 h-28 rounded overflow-hidden border">
                <img
                  src={draft.picture || "/images/placeholders/User.png"}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <label
                  className="flex items-center hover:scale-105 cursor-pointer transition-transform"
                  htmlFor="pictureInput"
                >
                  <LuImagePlus size={30} /> <span className="">Thêm ảnh</span>
                </label>
                <input
                  id="pictureInput"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    setFile(f);
                    if (!f) return;
                    const picture = URL.createObjectURL(f);
                    updateDraft({ picture });
                  }}
                  className="text-xs hidden mt-1"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                clearDraft();
                setDraft(DEFAULT_DRAFT as any);
              }}
              className="px-3 py-1 cursor-pointer rounded border"
            >
              Xóa nháp
            </button>

            {isUpdate ? (
              <button
                onClick={() =>
                  open({ type: "update-modal", payload: onUpdate })
                }
                className="px-3 cursor-pointer py-1 rounded bg-primary-light  hover:bg-primary-light text-white"
              >
                Cập nhật
              </button>
            ) : (
              <button
                onClick={() =>
                  open({ type: "update-modal", payload: onConfirm })
                }
                className="px-3 cursor-pointer py-1 rounded bg-primary-light/80 hover:bg-primary-light text-white"
              >
                Tạo mới
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="md:px-10">
        <div className="w-fit mx-auto text-error mb-2 md:hidden ">
          Nhấn giữ vào email để sửa hoặc xóa
        </div>
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
