import { api } from "@/utils/axiosInstance";
import axios, { AxiosError } from "axios";

import { toast } from "sonner";
import { BASE_URL, isResOk } from "../services";
import { setAT } from "@/lib/authToken";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { clearAuth } from "@/lib/authSlice";

export const localLogin = async (email: string, password: string) => {
  const res = await api.post(
    `/api/auth/login/local`,
    {
      username: email,
      password,
    },
    { withCredentials: true }
  );
  if (isResOk(res.status)) {
    const data = res.data;
    const { access_token } = data.data;

    setAT(access_token);
    toast.success("Đăng nhập thành công");
    return true;
  }
  toast.error(res.data.message);
  return false;
};

interface IRegister {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export const isRegisterable = async (payload: IRegister) => {
  const res = await api.post("/api/auth/register", payload);
  if (!isResOk(res.status)) {
    toast.error(res.data.message);
    return false;
  }
  toast.info(`Xin hãy kiểu tra email của bạn để xác nhận thông tin.`);
  return true;
};

export const verifyToken = async (token: string) => {
  const res = await api.post("/api/auth/verify-token", { token });
  console.log(res);
  if (isResOk(res.status)) {
    toast.success("Xác nhận thành công");
    setAT(res.data.data.access_token);
    return;
  }
  toast.error(res.data.message);
};

export const logout = async () => {
  // try {
  const res = await api.post("/api/auth/logout");

  if (isResOk(res.status)) {
    toast.success("Đã đăng xuất");

    setAT(null);
    return { message: "Đăng xuất thành công" };
  }
  // } catch (error) {
  //   toast.error("Có lỗi xảy ra khi đăng xuất");
  //   return null;
  // }
};
