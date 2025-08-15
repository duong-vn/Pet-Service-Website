import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

interface IToken {
  access_token: string;
}

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
