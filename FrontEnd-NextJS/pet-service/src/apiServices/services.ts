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
}
export const getUser = async () => {
  const res = await api.get("/api/auth/get-user");
  const user: IUser = res.data.data;

  console.log("bootstrap user", user);
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
  console.log(login);
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
  const msg = Array.isArray(error.response.data.message)
    ? error.response.data.message.join(", ")
    : error.response.data.message || "Đã có lỗi xảy ra, thử lại sau.";
  toast.error(msg);
  console.error("API Error:", msg);
};
