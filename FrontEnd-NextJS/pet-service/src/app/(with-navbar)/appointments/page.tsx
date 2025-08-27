"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Appointments from "./Appointments";
import { useAppSelector } from "@/hooks/redux-hooks";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function AppointmentsUI() {
  const searchParams = useSearchParams();
  const service = searchParams.get("service");
  const user = useAppSelector((s) => ({
    role: s.auth.user?.role,
    auth: s.auth.authenticated,
  }));
  const router = useRouter();

  if (user.role?.name === "banned") {
    router.replace("/forbidden");
  }
  if (user.auth === "checking") {
    return (
      <div>
        <LoadingScreen />
      </div>
    );
  } else {
    return <Appointments service={service} />;
  }
}
