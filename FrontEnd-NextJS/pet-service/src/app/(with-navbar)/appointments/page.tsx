"use client";
import { useSearchParams } from "next/navigation";
import Appointments from "./Appointments";

export default function AppointmentsUI() {
  const searchParams = useSearchParams();
  const service = searchParams.get("service");

  return <Appointments service={service} />;
}
