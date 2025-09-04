import { getAT, setAT } from "@/lib/authToken";
import axios from "axios";
import { toast } from "sonner";
export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
axios.defaults.baseURL = BASE_URL;

export const api = axios.create({
  baseURL: BASE_URL, // proxy tới NestJS
  withCredentials: true, // để cookie RT tự gửi khi /auth/refresh
});

api.interceptors.request.use((cfg) => {
  const at = getAT();
  if (at) cfg.headers.Authorization = `Bearer ${at}`;
  return cfg;
});

let refreshing: Promise<string | null> | null = null;

api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const cfg = err.config || {};

    if (err?.response?.status === 401 && !cfg._retry) {
      cfg._retry = true;

      refreshing ??= (async () => {
        try {
          const { data: resData } = await axios.post(
            `/api/auth/refresh`,
            null,
            {
              withCredentials: true,
            }
          );

          const accessToken = resData.data.access_token;
          setAT(accessToken);
          return accessToken as string;
        } catch {
          if (getAT()) toast.error("Phiên đăng nhập đã hết hạn");
          setAT(null);
          return null;
        } finally {
          refreshing = null;
        }
      })();

      const newAT = await refreshing;
      if (newAT) {
        cfg.headers.Authorization = `Bearer ${newAT}`;
        return api(cfg); // retry đúng 1 lần
      }
    } else if (err?.response?.status === 401 && cfg._retry) {
      toast.error("Phiên đăng nhập đã hết hạn");
    }
    return Promise.reject(err);
  }
);
