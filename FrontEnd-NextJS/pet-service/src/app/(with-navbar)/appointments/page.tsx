"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Appointments from "./Appointments";
import { useAppSelector } from "@/hooks/redux-hooks";
import LoadingScreen from "@/components/ui/LoadingScreen";
import UserPill from "@/components/layout/UserPill";

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
  if (user.auth === "unauthenticated") {
    return (
      <div className="min-h-[60vh] flex space-y-3 flex-col justify-center items-center">
        <div>Bạn chưa đặng nhập</div>
        <UserPill />
      </div>
    );
  }
  if (user.auth === "checking") {
    return (
      <div className="min-h-[60vh] flex space-y-3 flex-col justify-center items-center">
        <LoadingScreen />
      </div>
    );
  } else {
    return <Appointments service={service} />;
  }
}
