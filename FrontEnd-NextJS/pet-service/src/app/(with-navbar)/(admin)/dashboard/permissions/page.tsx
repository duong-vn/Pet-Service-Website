"use client";
import Pagination from "@/components/layout/Pagination";
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { Switch } from "@/components/ui/switch";
import { MODULES } from "@/types/back-end";

import { api } from "@/utils/axiosInstance";
import { Collapsible } from "@radix-ui/react-collapsible";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import PermissionRow from "./PermissionRow";

interface Permission {
  _id: string;
  name: string;
  key: string;
  module: string;
}

export default function PermissionsUI() {
  const [params, setParams] = useState({ current: 1, pageSize: 40 });
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
  const searchParams = useSearchParams();

  const [selected, setSelected] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(searchParams.get("permissions") ?? "[]"));
    } catch {
      return new Set<string>();
    }
  });

  const grouped = useMemo(() => {
    if (isLoading) return {};
    const modules = permissions.result.reduce((g: any, p: Permission) => {
      if (!g[p.module]) {
        g[p.module] = [];
      }
      g[p.module].push(p);
      return g;
    }, {});
    return modules;
  }, [permissions?.result, isLoading]);
  console.log(selected);
  const onToogle = useCallback((e: boolean, _id: string) => {
    setSelected((prev) => {
      const set = new Set(prev);
      e ? set.add(_id) : set.delete(_id);
      return set;
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4 space-y-6">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Danh sách Permissions</h1>
        <span className="text-sm text-muted-foreground">
          Tổng:{" "}
          {permissions?.meta.total ??
            Object.values(grouped).reduce(
              (n: number, arr) => n + (arr as Permission[]).length,
              0
            )}
        </span>
      </div>

      {/* Accordion modules */}
      <div className="space-y-3">
        {Object.entries(grouped)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([module, perms]) => (
            <Collapsible
              key={module}
              className="rounded-xl border bg-background shadow-sm"
            >
              <CollapsibleTrigger className="group flex w-full items-center justify-between px-4 py-3 text-left">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium">
                    {module?.[0]?.toUpperCase() || "M"}
                  </span>
                  <span className="font-medium capitalize">
                    {module === MODULES.APPOINTMENTS && "Lịch hẹn"}
                    {module === MODULES.SERVICES && "Dịch vụ"}
                    {module === MODULES.PRICERULES && "Luật giá"}
                    {module === MODULES.USERS && "Người dùng"}
                    {module === MODULES.ROLES && "Vai trò"}
                    {module === MODULES.PERMISSIONS && "Quyền hạn"}
                    {/* fallback nếu module không nằm trong enum */}
                    {!Object.values(MODULES).includes(module as any) && module}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                    {(perms as Permission[]).length} quyền
                  </span>
                  <svg
                    className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" />
                  </svg>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent className="px-4 pb-4">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {(perms as Permission[]).map((p) => (
                    <PermissionRow
                      key={p._id}
                      isChecked={selected.has(p._id)}
                      onToogle={onToogle}
                      p={p}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
      </div>

      {/* Pagination giữ nguyên của bạn */}
      <div className="flex items-center justify-center py-2"></div>
    </div>
  );
}
