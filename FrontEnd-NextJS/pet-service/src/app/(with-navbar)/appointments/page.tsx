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
import { DateRange, DayPicker, Matcher } from "react-day-picker";
import Appointments from "./Appointments";
import UserPill from "@/components/layout/UserPill";
export default function AppointmentsUI() {
  const searchParams = useSearchParams();
  const service = searchParams.get("service");

  return <Appointments service={service} />;
}
