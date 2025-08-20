import { api } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export function useServices(current: number, pageSize: number) {
  return useQuery({
    queryKey: ["services", { current, pageSize }],
    queryFn: async () => {
      const res = (
        await api.get(`/api/services?current=${current}&pageSize=${pageSize}`)
      ).data;

      return res.data;
    },
  });
}
