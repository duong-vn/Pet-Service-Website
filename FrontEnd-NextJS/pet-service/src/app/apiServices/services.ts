import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const handleGoogleLogin = async (id_token: string) => {
  const login = await axios.post(
    `${BASE_URL}/api/auth/login/google`,
    { id_token },
    { withCredentials: true }
  );
  console.log(login);
  return;
};
