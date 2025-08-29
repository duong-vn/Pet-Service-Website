import { api } from "@/utils/axiosInstance";
import { toast } from "sonner";

import { setAT } from "@/lib/authToken";
import { handleError } from "../services";

export const localLogin = async (email: string, password: string) => {
  try {
    const res = await api.post(
      `/api/auth/login/local`,
      {
        username: email,
        password,
      },
      { withCredentials: true }
    );

    const data = res.data;
    const { access_token } = data.data;

    setAT(access_token);
    toast.success("Đăng nhập thành công");
    return data;
  } catch (error) {
    handleError(error);
  }
};

interface IRegister {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export const isRegisterable = async (payload: IRegister) => {
  try {
    const res = await api.post("/api/auth/register", payload);

    toast.info(`Xin hãy kiểu tra email của bạn để xác nhận thông tin.`);
    return true;
  } catch (error: any) {
    toast.error(error.response.data.message);
    return false;
  }
};

export const verifyToken = async (token: string) => {
  try {
    const res = await api.post("/api/auth/verify-token", { token });

    toast.success("Xác nhận thành công");
    setAT(res.data.data.access_token);

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const logout = async () => {
  try {
    await api.post("/api/auth/logout");

    toast.success("Đã đăng xuất");
    setAT(null);

    return { message: "Đăng xuất thành công" };
  } catch (error: any) {
    handleError(error);
    return null;
  }
};

export const isVerified = async (token: string) => {
  try {
    const res = await api.post("/api/auth/verify-forget-password", { token });

    toast.success("Xác thực thành công");
    return res.data.data;
  } catch (error: any) {
    handleError(error);
    return false;
  }
};

export const resetPassword = async (token: string, password: string) => {
  try {
    await api.post("/api/auth/reset-password", { token, password });
    toast.success("Đặt lại mật khẩu thành công");
    return true;
  } catch (error: any) {
    handleError(error);
    return false;
  }
};
