"use client";

import { useEffect } from "react";
import { setAT } from "@/lib/authToken";
import { api } from "@/utils/axiosInstance";

export default function BootstrapAuth() {
  useEffect(() => {
    // Gọi /auth/refresh ngay khi app load
    api
      .post("/api/auth/refresh")
      .then((res) => {
        setAT(res.data.accessToken);
      })
      .catch(() => {
        setAT(null);
      });
  }, []);

  return null; // Không render gì, chỉ chạy logic
}
