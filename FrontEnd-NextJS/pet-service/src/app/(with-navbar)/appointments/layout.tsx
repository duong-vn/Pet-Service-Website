"use client";
import type { Metadata } from "next";

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import Login from "@/components/features/auth/login";
import { useAppSelector } from "@/hooks/redux-hooks";
import UserPill from "@/components/layout/UserPill";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authenticated = useAppSelector((s) => s.auth.authenticated);

  if (authenticated === "checking") {
    return (
      <div className="min-h-[100vh] flex justify-center items-center">
        {" "}
        <LoadingScreen />
      </div>
    );
  }

  if (authenticated === "unauthenticated") {
    return (
      <div className="mx-auto min-h-[50vh] flex flex-col justify-center items-center gap-10">
        <div>Bạn chưa đăng nhập!</div>
        <UserPill />
      </div>
    );
  }

  return <>{children}</>;
}
