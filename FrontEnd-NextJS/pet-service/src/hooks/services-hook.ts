import { PetType, ServiceType } from "@/types/back-end";
import { api } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";


export interface ServiceParams {
  current:number,
  pageSize:number,
  filter?:{
pet:PetType[],
type:ServiceType[]
  },
  sort?:string

} 

export function useServices(serviceParams : ServiceParams) {
  
  return useQuery({
    queryKey: ["services", serviceParams],
    queryFn: async () => {
      const res = (
        await api.get(`/api/services?${buildAqp(serviceParams)}`)
      ).data;

      return res.data;
    },
  });
}
export function buildAqp(p: ServiceParams) {
  const q = new URLSearchParams();

  if (p.filter?.pet?.length)  q.set('pet',  p.filter.pet.join(','));
  if (p.filter?.type?.length) q.set('type', p.filter.type.join(','));

  if (p.sort) q.set('sort', p.sort);


  q.set('current', String(p.current));
  q.set('pageSize', String(p.pageSize));

  return q.toString();
}