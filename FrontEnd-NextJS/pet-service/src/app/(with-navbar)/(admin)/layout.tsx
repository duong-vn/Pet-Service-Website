"use client";
import type { Metadata } from "next";

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import Login from "@/components/features/auth/login";
import { useAppSelector } from "@/hooks/redux-hooks";
import UserPill from "@/components/layout/UserPill";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useRouter } from "next/navigation";
import { PERMISSIONS } from "@/types/permissions";
import { can } from "@/lib/authSlice";
import ForbiddenPage from "@/app/(without-navbar)/forbidden/page";
import AdminSidebar from "@/components/layout/AdminSidebar";

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

  if (
    authenticated === "unauthenticated" ||
    !can(permissions, PERMISSIONS.APPOINTMENTS_PATCH)
  ) {
    return <ForbiddenPage />;
  }
  if (can(permissions, PERMISSIONS.APPOINTMENTS_PATCH)) {
    return (
      <div className="min-h-screen">
        <AdminSidebar />
        <main className="pl-64">{children}</main>
      </div>
    );
  }
}
