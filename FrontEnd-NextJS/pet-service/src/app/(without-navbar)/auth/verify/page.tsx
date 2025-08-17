"use client";
import { verifyToken } from "@/apiServices/auth/services";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState(false);
  const router = useRouter();

  const verify = async (token: string) => {
    await verifyToken(token);
  };

  useEffect(() => {
    const hash = window.location.hash.slice(1); // phần sau '#'
    console.log(hash);
    if (!hash) {
      setToken(false);
      return;
    } else {
      setToken(true);
      verify(hash);
    }

    // Xóa token khỏi URL cho sạch (không reload trang)
    history.replaceState({}, "", "verify-email");
  }, []);
  if (!token) {
    return (
      <div className="flex justify-center items-center flex-col text-center h-screen dark:text-primary-light text-secondary-dark">
        <h1 className="text-5xl">
          Vui lòng kiểm tra email của bạn để xác nhận.
        </h1>
        <div
          className={[
            "w-[400] p-5 mt-4 text-2xl",
            " dark:hover:bg-accent-dark border border-black dark:border-white/70 rounded-xl",
            " hover:bg-primary-light cursor-pointer",
            "transition-all duration-100",
          ].join(" ")}
          onClick={() => router.replace("/")}
        >
          Quay về trang chủ
        </div>
      </div>
    );
  }

  return (
    <>
      <LoadingScreen />
    </>
  );
}
