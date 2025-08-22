import { api } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";


interface ServiceParams {
  current:number,
  pageSize:number,
  filter?:string,
  sort?:string

} 

export function useServices(serviceParams : ServiceParams) {
  const {current,pageSize,filter,sort} = serviceParams
  return useQuery({
    queryKey: ["services", { current, pageSize,filter,sort }],
    queryFn: async () => {
      const res = (
        await api.get(`/api/services`,{params:serviceParams})
      ).data;

      return res.data;
    },
  });
}
