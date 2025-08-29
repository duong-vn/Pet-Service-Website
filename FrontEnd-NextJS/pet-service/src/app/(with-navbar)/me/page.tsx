"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { api } from "@/utils/axiosInstance";
import { toast } from "sonner";
import { uploadToCloud } from "@/apiServices/cloud/services";
import { LuImagePlus } from "react-icons/lu";

type User = {
  _id: string;
  name?: string;
  email?: string;
  age?: number;
  public_id?: string;
  gender?: string;
  address?: string;
  phone?: string;
  picture?: string; // có thể là URL hoặc base64 preview
};

export default function MePage() {
  const qc = useQueryClient();

  // Lấy thông tin người dùng hiện tại
  const { data, isLoading } = useQuery<User | undefined>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/api/auth/get-user");
      return res.data.data as User;
    },
  });
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File>();

  const [form, setForm] = useState<Partial<User> | null>(null);

  // Đồng bộ form khi data tải xong
  useEffect(() => {
    if (data) {
      setForm({
        name: data.name ?? "",
        email: data.email ?? "",
        age: data.age ?? undefined,
        gender: data.gender ?? "",
        address: data.address ?? "",
        phone: data.phone ?? "",
        public_id: data.public_id ?? undefined,
        picture: data.picture ?? "",
      });
    }
  }, [data]);

  // Mutation cập nhật hồ sơ
  const mutation = useMutation({
    mutationFn: async (payload: Partial<User>) => {
      const res = await api.patch("/api/users/me", payload);
      return res.data;
    },
    onSuccess: async () => {
      toast.success("Cập nhật thành công");
      await qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Lỗi khi cập nhật");
    },
  });

  if (isLoading || !form) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingScreen />
      </div>
    );
  }

  const onSave = async () => {
    setLoading(true);
    let picture = form?.picture;
    let public_id = form?.public_id;
    if (file) {
      const res = await uploadToCloud("images/users", file, form.public_id);

      picture = res.secure_url;
      public_id = res.public_id;
    }

    const payload: Partial<User> = {
      name: form.name,
      age: form.age,
      gender: form.gender,
      address: form.address,
      phone: form.phone,
      picture,
      public_id,
    };
    mutation.mutate(payload);
    setLoading(false);
  };

  const saving = mutation.isPending;

  return (
    <div className="p-6 max-w-3xl mx-auto  ">
      <h1 className="text-2xl  mb-4">Hồ sơ của tôi</h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Cột trái: form */}
        <div className="col-span-2 space-y-4">
          <div>
            <label className="text-sm">Họ tên</label>
            <input
              className="w-full p-2 border rounded"
              value={form.name ?? ""}
              onChange={(e) =>
                setForm((prev) => ({ ...(prev ?? {}), name: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="text-sm">Email (readonly)</label>
            <input
              className="w-full p-2 border rounded"
              value={form.email ?? ""}
              readOnly
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm">Tuổi</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={form.age ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...(prev ?? {}),
                    age: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-sm">Giới tính</label>
              <select
                className="w-full p-2 border rounded"
                value={form.gender ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...(prev ?? {}),
                    gender: e.target.value,
                  }))
                }
              >
                <option value="">Chọn</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>
            <div>
              <label className="text-sm">Số điện thoại</label>
              <input
                className="w-full p-2 border rounded"
                value={form.phone ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...(prev ?? {}),
                    phone: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div>
            <label className="text-sm">Địa chỉ</label>
            <input
              className="w-full p-2 border rounded"
              value={form.address ?? ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...(prev ?? {}),
                  address: e.target.value,
                }))
              }
            />
          </div>

          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-primary-light text-white rounded"
              onClick={onSave}
              disabled={!!saving}
            >
              {saving || loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </div>

        {/* Cột phải: avatar */}
        <div className="col-span-1">
          <div className="w-full h-56 border rounded overflow-hidden mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.picture || "/images/placeholders/User.png"}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
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
              if (!f) return;
              setFile(f);
              const pre = URL.createObjectURL(f);
              setForm((prev) => ({
                ...(prev ?? {}),
                picture: pre,
              }));
            }}
            className="hidden"
          />
          <div className="text-sm text-muted-foreground mt-2"></div>
        </div>
      </div>
    </div>
  );
}
