import { api } from "@/utils/axiosInstance";
import axios, { AxiosError } from "axios";

import { toast } from "sonner";
import { BASE_URL } from "../services";
import { setAT } from "@/lib/authToken";

export const localLogin = async (email: string, password: string) => {
  try {
    const res = (
      await axios.post(`${BASE_URL}/api/auth/login/local`, {
        username: email,
        password,
      })
    ).data;
    const data = res.data;
    const { access_token } = data;
    setAT(access_token);
    toast.success("Đăng nhập thành công");
  } catch (error) {
    toast.error("Email hoặc mật khẩu không đúng!");
  }
};
