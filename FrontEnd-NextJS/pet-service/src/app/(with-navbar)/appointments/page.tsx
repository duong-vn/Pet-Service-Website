"use client";
import { handleError } from "@/apiServices/services";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useSession } from "@/hooks/session-hooks";
import { getAT } from "@/lib/authToken";
import { api } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ServicesUI() {
  const searchParams = useSearchParams()
  const [service,setService] = useState(searchParams.get('service'))
  if(!!!service)return <LoadingScreen/>

  const {data, isLoading,isError,error} = useQuery({
    enabled:!!service,
    queryFn: async ()=>{ 
        const res = await api.get(`/api/services/${service}`)
        return res.data
    },
    queryKey:['services/:id',service]}

)
  // const [value,setValue,clear]= useSession<{petWeight:number,phone:string}>('services-appointments',{petWeight:0,phone:''})

if(isError) {handleError(error); return null}
if(isLoading)return <LoadingScreen/>

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // trạng thái ban đầu
      animate={{ opacity: 1, y: 0 }} // trạng thái khi xuất hiện
      exit={{ opacity: 0, y: -50 }} // trạng thái khi biến mất
      transition={{ duration: 0.5 }} // thời gian & easing
      className="p-4 bg-blue-500 text-white rounded"
    >
     {service}
    </motion.div>
  );
}
