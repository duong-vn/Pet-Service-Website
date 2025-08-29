import { IUser } from "@/lib/authSlice";

import { api, BASE_URL } from "@/utils/axiosInstance";
import axios from "axios";
import { toast } from "sonner";

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

interface IToken {
  access_token: string;
  user: IUser;
}
export const getUser = async (): Promise<IUser> => {
  const res = await api.get<ApiResponse<IUser>>("/api/auth/get-user");
  const user: IUser = res.data.data;

  return user;
};

export const handleGoogleLogin = async (
  id_token: string
): Promise<ApiResponse<IToken>> => {
  const login = await axios.post(
    `${BASE_URL}/api/auth/login/google`,
    { id_token },
    { withCredentials: true }
  );

  return login.data;
};

export function isNumericString(s: string) {
  return /^\d+$/.test(s); // chỉ 0-9, không khoảng trắng/ký tự khác
}

export function isResOk(statusCode: number) {
  return statusCode >= 200 && statusCode < 300;
}
export const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
export const handleError = (error: any) => {
  try {
    const msg = Array.isArray(error.response?.data.message)
      ? error.response.data.message.join(", ")
      : error.response.data.message || "Đã có lỗi xảy ra, thử lại sau.";
    toast.error(msg);
    console.error("API Error:", msg);
  } catch (error) {
    toast.error("Đã có lỗi xảy ra, thử lại sau.");
    console.error("API Error:", error);
  }
};

export function scrollWindowToTop(behavior: ScrollBehavior = "smooth") {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, left: 0, behavior });
}

export const sendNotifyEmail = async (appointments_id: string) => {
  try {
    const res = (await api.post(`/api/mail/appointments/${appointments_id}`))
      .data;

    return res.data;
  } catch (error) {
    handleError(error);
    return null;
  }
};
