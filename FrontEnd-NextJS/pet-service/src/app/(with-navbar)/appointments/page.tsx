"use client";
import { handleError } from "@/apiServices/services";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useAppSelector } from "@/hooks/redux-hooks";
import { useSession } from "@/hooks/session-hooks";
import { getAT } from "@/lib/authToken";
import { IService } from "@/types/back-end";
import { api } from "@/utils/axiosInstance";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {DateRange, DayPicker, Matcher} from 'react-day-picker'
import Appointments from "./Appointments";
import UserPill from "@/components/layout/UserPill";
export default function AppointmentsUI() {
  const searchParams = useSearchParams()
  const authenticated = useAppSelector(s=>s.auth.authenticated)
  const [mounted,setMounted] = useState(false)
const [service,setService] = useState(searchParams.get('service'))

  useEffect(()=>{setMounted(true)},[])

  
  if(!authenticated) {
    
    
    return (
    <div className="mx-auto flex flex-col items-center gap-10">
    <div>Bạn chưa đăng nhập!</div>
      <UserPill/>
      
      </div>
)
  }
  
  

  if(!!!service){return <LoadingScreen/>}
 return (
  <Appointments service = {service}/>

 )
}