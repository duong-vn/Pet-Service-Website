"use client";
import Pagination from "@/components/layout/Pagination";
import LoadingScreen from "@/components/ui/LoadingScreen";
import RolesList from "@/components/ui/RolesList";
import { api } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function RolesUI() {
  const [params, setParams] = useState({ current: 1, pageSize: 10 });
  const {
    data: roles,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["roles", params],
    queryFn: async () => {
      const resData = (await api.get("/api/roles", { params })).data;
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
      <h1 className="text-2xl font-bold">Danh sách roles</h1>
      <div>
        <RolesList roles={roles.result} />
      </div>
      <div>
        <Pagination
          current={roles.meta.current}
          limit={roles.meta.pageSize}
          setParams={setParams}
          totalItems={roles.meta.total}
          totalPage={roles.meta.pages}
        />
      </div>
    </div>
  );
}
