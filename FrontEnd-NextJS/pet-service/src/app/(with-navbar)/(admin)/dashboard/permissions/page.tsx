"use client";
import Pagination from "@/components/layout/Pagination";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { api } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import PermissionsList from "@/components/list/PermissionsList";

export default function PermissionsUI() {
  const [params, setParams] = useState({ current: 1, pageSize: 10 });
  const {
    data: permissions,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["permissions", params],
    queryFn: async () => {
      const resData = (await api.get("/api/permissions", { params })).data;
      return resData.data;
    },
  });
  if (isLoading) {
    return (
      <div className="min-h-[100vh] flex justify-center items-center ">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Danh sách Permissions</h1>

      {/* List với scroll xử lý bên trong component */}
      <PermissionsList items={permissions.result} current={params.current} />

      <div>
        <Pagination
          current={permissions.meta.current}
          limit={permissions.meta.pageSize}
          setParams={setParams}
          totalItems={permissions.meta.total}
          totalPage={permissions.meta.pages}
        />
      </div>
    </div>
  );
}
