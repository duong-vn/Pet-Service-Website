"use client";
import { handleError } from "@/apiServices/services";
import NotFound from "@/components/layout/NotFound";
import { api } from "@/utils/axiosInstance";
import ServiceDetailClient from "./ServiceDetailClient";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function ServicePage() {
  const { _id } = useParams<{ _id: string }>();

  const { data, isLoading, isError, error } = useQuery({
    enabled: !!_id,
    queryFn: async () => {
      const res = await api.get(`/api/services/${_id}`);
      return res.data;
    },
    queryKey: ["services/:id", _id],
  });
  if (isLoading)
    return (
      <div className="min-h-[100vh] flex justify-center items-center">
        <LoadingScreen />{" "}
      </div>
    );

  if (isError) {
    handleError(error);
    return null;
  }

  if (data.statusCode === 404) return <NotFound />;
  const serviceData = data.data;

  return <ServiceDetailClient serviceData={serviceData} />;
}
