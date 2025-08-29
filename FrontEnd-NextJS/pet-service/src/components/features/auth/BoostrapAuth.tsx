"use client";

import { useEffect, useRef } from "react";
import { getAT, setAT } from "@/lib/authToken";
import { api } from "@/utils/axiosInstance";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { IUser, setAuth, clearAuth } from "@/lib/authSlice";

export default function BootstrapAuth() {
  const dispatch = useAppDispatch();
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        const res = (await api.post("/api/auth/refresh")).data;
        const data = res.data;

        setAT(data.access_token);

        dispatch(setAuth(data.user as IUser));
      } catch (e: any) {
        const hadAT = !!getAT();

        setAT(null);
        dispatch(clearAuth());
        if (hadAT) {
          toast.error("Phiên đăng nhập đã hết hạn");
        }
      }
    })();
  }, []);

  return null;
}
