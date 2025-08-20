import { api } from "@/utils/axiosInstance";
import axios, { AxiosError } from "axios";

import { toast } from "sonner";
import { ApiResponse, handleError, isResOk } from "../services";
import { BASE_URL } from "@/utils/axiosInstance";
import { setAT } from "@/lib/authToken";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { clearAuth } from "@/lib/authSlice";

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
    if (isResOk(res.status)) {
      const data = res.data;
      const { access_token } = data.data;

      setAT(access_token);
      toast.success("Đăng nhập thành công");
      return true;
    }
    toast.error(res.data.message);
    return false;
  } catch (error) {
    handleError(error);
  }
};
// export const localLogin = async (email: string, password: string) => {
//   const res = await api.post(
//     `/api/auth/login/local`,
//     {
//       username: email,
//       password,
//     },
//     { withCredentials: true }
//   );
//   if (isResOk(res.status)) {
//     const data = res.data;
//     const { access_token } = data.data;

//     setAT(access_token);
//     toast.success("Đăng nhập thành công");
//     return true;
//   }
//   toast.error(res.data.message);
//   return false;
// };

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
    return;
  } catch (error) {
    handleError(error);
  }
};

export const logout = async () => {
  try {
    const res = await api.post("/api/auth/logout");

    if (isResOk(res.status)) {
      toast.success("Đã đăng xuất");

      setAT(null);
      const dispatch = useAppDispatch();
      dispatch(clearAuth());
      return { message: "Đăng xuất thành công" };
    }
  } catch (error: any) {
    handleError(error);
    return null;
  }
};
