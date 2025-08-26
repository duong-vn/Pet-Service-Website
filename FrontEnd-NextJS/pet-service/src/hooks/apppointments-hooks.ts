import { IStatus } from "@/types/back-end";
import { api } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export interface IAppointments {
  _id: string;
  user: string;
  service: {
    _id: string;
    picture: string;
  };
  duration: number;
  petWeight: string;
  date: string;
  startTime: string;
  endTime: string;
  price: string | number;
  status: IStatus;
  note: string;
  createdBy: {
    _id: string;
    email: string;
  };
  createdAt: Date;
}
export interface APParams {
  current: number;
  pageSize: number;
  filter?: {
    status: IStatus;
  };
  sort?: string[];
}

export function useAppointment(params: APParams) {
  return useQuery({
    queryKey: ["appointments", params],
    queryFn: async () => {
      const resData = (
        await api.get(
          `/api/appointments?populate=service&fields=service.picture&${buildAqp(
            params
          )}`
        )
      ).data;
      return resData.data;
    },
  });
}

const buildAqp = (params: APParams) => {
  const q = new URLSearchParams();
  if (!!params.filter?.status) q.set("status", params.filter.status);
  if (!!params.sort) q.set("sort", params.sort.join(","));

  q.set("current", String(params.current));
  q.set("pageSize", String(params.pageSize));
  return q;
};
