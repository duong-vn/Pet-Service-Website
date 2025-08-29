"use client";

import { useAppSelector } from "@/hooks/redux-hooks";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { PERMISSIONS } from "@/types/permissions";
import { can } from "@/lib/authSlice";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authenticated = useAppSelector((s) => s.auth.authenticated);
  const permissions = useAppSelector((s) => s.auth.user?.permissions);

  if (authenticated === "checking") {
    return (
      <div className="min-h-[100vh] flex justify-center items-center">
        {" "}
        <LoadingScreen />
      </div>
    );
  }

  if (can(permissions, PERMISSIONS.ROLES_GET)) {
    return (
      <div>
        <main className="">{children}</main>
      </div>
    );
  }
}
