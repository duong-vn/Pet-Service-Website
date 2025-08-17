import { api } from "@/utils/axiosInstance";
import axios, { AxiosError } from "axios";

import { toast } from "sonner";
import { BASE_URL, isResOk } from "../services";
import { setAT } from "@/lib/authToken";

export const localLogin = async (email: string, password: string) => {
  try {
    const res = (
      await api.post(
        `/api/auth/login/local`,
        {
          username: email,
          password,
        },
        { withCredentials: true }
      )
    ).data;
    const data = res.data;
    const { access_token } = data;

    setAT(access_token);
    toast.success("Đăng nhập thành công");
    return true;
  } catch (error) {
    toast.error("Email hoặc mật khẩu không đúng!");
    return false;
  }
};
interface IRegister {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export const isRegisterable = async (payload: IRegister) => {
  const { email } = payload;
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
